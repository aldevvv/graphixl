import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import { isPrivateOrBlockedIp, SsrfSecurityError, validateUrlSyntax } from "../security/ssrf";

const MAX_HTML_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
const DEFAULT_TIMEOUT_MS = 7000;
const MAX_REDIRECTS = 5;
const USER_AGENT = "GraphixlBot/1.0 (+https://github.com/aldevvv/graphixl)";

/**
 * Creates a DNS lookup function that checks each resolved IP before
 * allowing socket connection.
 */
function createSecureLookup() {
  return (
    hostname: string,
    options: dns.LookupOptions,
    callback: (err: NodeJS.ErrnoException | null, address: string | dns.LookupAddress[], family?: number) => void
  ) => {
    dns.lookup(hostname, { all: true }, (err, addresses) => {
      if (err) {
        return callback(err, "", 4);
      }
      if (!addresses || addresses.length === 0) {
        return callback(new SsrfSecurityError(`No DNS addresses found for host ${hostname}`), "", 4);
      }
      for (const entry of addresses) {
        if (isPrivateOrBlockedIp(entry.address)) {
          return callback(
            new SsrfSecurityError(`Access to resolved address ${entry.address} is restricted`),
            "",
            4
          );
        }
      }
      const preferred = addresses.find((a) => a.family === 4) || addresses[0];
      if (options && (options as { all?: boolean }).all) {
        callback(null, addresses as unknown as string);
      } else {
        callback(null, preferred.address, preferred.family);
      }
    });
  };
}

const secureHttpAgent = new http.Agent({
  keepAlive: false,
  lookup: createSecureLookup() as unknown as http.AgentOptions["lookup"],
});

const secureHttpsAgent = new https.Agent({
  keepAlive: false,
  lookup: createSecureLookup() as unknown as https.AgentOptions["lookup"],
});

export interface FetchResult {
  html: string;
  finalUrl: string;
  contentType: string;
}

/**
 * Performs a secure HTTP GET request to retrieve HTML from an untrusted URL.
 */
export async function fetchHtmlSafely(
  initialUrl: string,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<FetchResult> {
  let currentUrl = validateUrlSyntax(initialUrl);
  let redirectCount = 0;

  while (redirectCount <= MAX_REDIRECTS) {
    const isHttps = currentUrl.protocol === "https:";
    const client = isHttps ? https : http;
    const agent = isHttps ? secureHttpsAgent : secureHttpAgent;

    const requestResult = await new Promise<{
      statusCode: number;
      headers: http.IncomingHttpHeaders;
      body: string;
    }>((resolve, reject) => {
      const req = client.request(
        currentUrl,
        {
          method: "GET",
          agent,
          headers: {
            "User-Agent": USER_AGENT,
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
          },
          timeout: timeoutMs,
        },
        (res) => {
          const statusCode = res.statusCode ?? 200;
          const headers = res.headers;

          // If redirect status code, do not read full body
          if ([301, 302, 303, 307, 308].includes(statusCode)) {
            res.resume();
            return resolve({ statusCode, headers, body: "" });
          }

          let totalBytes = 0;
          const chunks: Buffer[] = [];

          res.on("data", (chunk: Buffer) => {
            totalBytes += chunk.length;
            if (totalBytes > MAX_HTML_SIZE) {
              req.destroy();
              return reject(new Error("Response size exceeded 2 MB limit"));
            }
            chunks.push(chunk);
          });

          res.on("end", () => {
            const body = Buffer.concat(chunks).toString("utf-8");
            resolve({ statusCode, headers, body });
          });

          res.on("error", (err) => {
            reject(err);
          });
        }
      );

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timed out"));
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.end();
    });

    const { statusCode, headers, body } = requestResult;

    if ([301, 302, 303, 307, 308].includes(statusCode)) {
      const location = headers.location;
      if (!location) {
        throw new Error(`Received redirect status ${statusCode} without Location header`);
      }

      redirectCount++;
      if (redirectCount > MAX_REDIRECTS) {
        throw new Error("Maximum redirect limit reached");
      }

      const nextUrl = new URL(location, currentUrl);
      currentUrl = validateUrlSyntax(nextUrl.toString());
      continue;
    }

    if (statusCode < 200 || statusCode >= 400) {
      throw new Error(`Target returned HTTP status ${statusCode}`);
    }

    const contentType = (headers["content-type"] ?? "").toLowerCase();

    return {
      html: body,
      finalUrl: currentUrl.toString(),
      contentType,
    };
  }

  throw new Error("Unable to complete request within redirect limits");
}

/**
 * Safely fetches an image and converts it into a base64 data URL.
 * Returns null if the fetch fails or violates security bounds.
 */
export async function fetchImageAsDataUrlSafely(
  imageUrl: string,
  timeoutMs = 5000
): Promise<string | null> {
  try {
    const targetUrl = validateUrlSyntax(imageUrl);
    const isHttps = targetUrl.protocol === "https:";
    const client = isHttps ? https : http;
    const agent = isHttps ? secureHttpsAgent : secureHttpAgent;

    return await new Promise<string | null>((resolve) => {
      const req = client.request(
        targetUrl,
        {
          method: "GET",
          agent,
          headers: {
            "User-Agent": USER_AGENT,
            Accept: "image/png,image/jpeg,image/webp,image/svg+xml,image/*;q=0.8",
          },
          timeout: timeoutMs,
        },
        (res) => {
          const statusCode = res.statusCode ?? 200;
          if (statusCode < 200 || statusCode >= 300) {
            res.resume();
            return resolve(null);
          }

          const rawContentType = res.headers["content-type"] ?? "image/jpeg";
          const contentType = rawContentType.split(";")[0].trim().toLowerCase();

          if (!contentType.startsWith("image/") && !contentType.includes("svg")) {
            res.resume();
            return resolve(null);
          }

          let totalBytes = 0;
          const chunks: Buffer[] = [];

          res.on("data", (chunk: Buffer) => {
            totalBytes += chunk.length;
            if (totalBytes > MAX_IMAGE_SIZE) {
              req.destroy();
              return resolve(null);
            }
            chunks.push(chunk);
          });

          res.on("end", () => {
            const buffer = Buffer.concat(chunks);
            const base64 = buffer.toString("base64");
            resolve(`data:${contentType};base64,${base64}`);
          });

          res.on("error", () => {
            resolve(null);
          });
        }
      );

      req.on("timeout", () => {
        req.destroy();
        resolve(null);
      });

      req.on("error", () => {
        resolve(null);
      });

      req.end();
    });
  } catch {
    return null;
  }
}
