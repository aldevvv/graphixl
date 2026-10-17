import dns from "node:dns";
import ipaddr from "ipaddr.js";

export class SsrfSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SsrfSecurityError";
  }
}

/**
 * Checks whether an IP address string belongs to a private, loopback,
 * link-local, multicast, or reserved subnet.
 */
export function isPrivateOrBlockedIp(ipString: string): boolean {
  try {
    let addr = ipaddr.parse(ipString);

    // Normalize IPv4-mapped IPv6 addresses (e.g. ::ffff:127.0.0.1)
    if (addr.kind() === "ipv6" && (addr as ipaddr.IPv6).isIPv4MappedAddress()) {
      addr = (addr as ipaddr.IPv6).toIPv4Address();
    }

    if (addr.kind() === "ipv4") {
      const range = (addr as ipaddr.IPv4).range();
      const blockedRanges = [
        "unspecified",
        "broadcast",
        "linkLocal",
        "loopback",
        "private",
        "carrierGradeNat",
        "reserved",
      ];
      if (blockedRanges.includes(range)) {
        return true;
      }

      // Check specific cloud metadata IPs
      const octets = (addr as ipaddr.IPv4).octets;
      if (octets[0] === 169 && octets[1] === 254) {
        return true;
      }
      if (octets[0] === 100 && octets[1] === 100 && octets[2] === 100 && octets[3] === 200) {
        return true;
      }
      if (octets[0] === 0) {
        return true;
      }

      return false;
    }

    if (addr.kind() === "ipv6") {
      const ipv6 = addr as ipaddr.IPv6;
      const range = ipv6.range();

      // For translation prefixes (RFC 6052 / RFC 6145 / NAT64), inspect embedded IPv4
      if (range === "rfc6052" || range === "rfc6145") {
        const high = ipv6.parts[6];
        const low = ipv6.parts[7];
        const embeddedIpv4 = new ipaddr.IPv4([
          (high >> 8) & 0xff,
          high & 0xff,
          (low >> 8) & 0xff,
          low & 0xff,
        ]);
        return isPrivateOrBlockedIp(embeddedIpv4.toString());
      }

      // For 6to4 prefixes (RFC 3056), inspect embedded IPv4
      if (range === "6to4") {
        const p1 = ipv6.parts[1];
        const p2 = ipv6.parts[2];
        const embeddedIpv4 = new ipaddr.IPv4([
          (p1 >> 8) & 0xff,
          p1 & 0xff,
          (p2 >> 8) & 0xff,
          p2 & 0xff,
        ]);
        return isPrivateOrBlockedIp(embeddedIpv4.toString());
      }

      const blockedRanges = [
        "unspecified",
        "linkLocal",
        "multicast",
        "loopback",
        "uniqueLocal",
        "ipv4Mapped",
        "teredo",
        "reserved",
        "discard",
        "deprecatedSiteLocal",
      ];
      return blockedRanges.includes(range);
    }

    return true;
  } catch {
    // If it cannot be parsed as a valid IP address, treat as unsafe
    return true;
  }
}

/**
 * Validates a URL string for protocol, syntax, and prohibited hosts.
 */
export function validateUrlSyntax(rawUrl: string): URL {
  if (!rawUrl || typeof rawUrl !== "string") {
    throw new SsrfSecurityError("URL is required");
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > 2048) {
    throw new SsrfSecurityError("URL exceeds maximum permitted length");
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new SsrfSecurityError("Invalid URL syntax");
  }

  // Enforce protocol constraints
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new SsrfSecurityError("Only HTTP and HTTPS protocols are permitted");
  }

  // Disallow user credentials in URL
  if (parsed.username || parsed.password) {
    throw new SsrfSecurityError("URLs containing user credentials are not permitted");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!hostname) {
    throw new SsrfSecurityError("URL must contain a valid hostname");
  }

  // Reject local and internal hostnames
  const prohibitedHosts = [
    "localhost",
    "metadata.google.internal",
    "metadata.internal",
    "instance-data",
  ];
  if (prohibitedHosts.includes(hostname) || hostname.endsWith(".local") || hostname.endsWith(".internal") || hostname.endsWith(".lan")) {
    throw new SsrfSecurityError(`Access to host '${hostname}' is prohibited`);
  }

  // If hostname is directly an IP literal, validate it immediately
  if (ipaddr.isValid(hostname)) {
    if (isPrivateOrBlockedIp(hostname)) {
      throw new SsrfSecurityError(`Access to IP address '${hostname}' is prohibited`);
    }
  }

  return parsed;
}

/**
 * Resolves a hostname via DNS and verifies that all resolved IP addresses are public.
 */
export async function resolveAndValidateHost(hostname: string): Promise<string[]> {
  // If already an IP address, validate directly
  if (ipaddr.isValid(hostname)) {
    if (isPrivateOrBlockedIp(hostname)) {
      throw new SsrfSecurityError(`Access to IP '${hostname}' is prohibited`);
    }
    return [hostname];
  }

  try {
    const addresses = await dns.promises.lookup(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      throw new SsrfSecurityError(`DNS resolution returned no addresses for '${hostname}'`);
    }

    const verifiedIps: string[] = [];
    for (const entry of addresses) {
      if (isPrivateOrBlockedIp(entry.address)) {
        throw new SsrfSecurityError(`Host '${hostname}' resolves to restricted IP '${entry.address}'`);
      }
      verifiedIps.push(entry.address);
    }

    return verifiedIps;
  } catch (error) {
    if (error instanceof SsrfSecurityError) {
      throw error;
    }
    throw new SsrfSecurityError(`DNS lookup failed for host '${hostname}'`);
  }
}
