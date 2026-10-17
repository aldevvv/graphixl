import { NextRequest, NextResponse } from "next/server";
import { ResolveRequestSchema, ResolveResponse } from "@/lib/resolver/types";
import { fetchHtmlSafely } from "@/lib/resolver/fetcher";
import { extractMetadataFromHtml } from "@/lib/resolver/extract";
import { SsrfSecurityError, validateUrlSyntax, resolveAndValidateHost } from "@/lib/security/ssrf";

export async function POST(req: NextRequest): Promise<NextResponse<ResolveResponse>> {
  try {
    const json = await req.json().catch(() => null);
    const parsed = ResolveRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid URL string is required",
          code: "INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    const { url } = parsed.data;

    // Validate syntax and protocol
    let parsedUrl: URL;
    try {
      parsedUrl = validateUrlSyntax(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid URL syntax";
      return NextResponse.json(
        {
          success: false,
          error: message,
          code: "INVALID_URL",
        },
        { status: 400 }
      );
    }

    // Verify DNS resolution against private network ranges
    try {
      await resolveAndValidateHost(parsedUrl.hostname);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Target host resolution failed";
      return NextResponse.json(
        {
          success: false,
          error: message,
          code: "SSRF_RESTRICTED",
        },
        { status: 400 }
      );
    }

    // Fetch HTML securely
    const fetchResult = await fetchHtmlSafely(parsedUrl.toString());

    // Extract normalized metadata
    const metadata = extractMetadataFromHtml(fetchResult.html, fetchResult.finalUrl);

    return NextResponse.json({
      success: true,
      metadata,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          code: "SSRF_BLOCKED",
        },
        { status: 400 }
      );
    }

    const errorMsg = err instanceof Error ? err.message : "Unable to retrieve link metadata";
    const isTimeout = errorMsg.toLowerCase().includes("timed out");

    return NextResponse.json(
      {
        success: false,
        error: isTimeout ? "The target website took too long to respond" : errorMsg,
        code: isTimeout ? "TIMEOUT" : "FETCH_ERROR",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}
