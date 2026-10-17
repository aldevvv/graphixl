import { NextRequest, NextResponse } from "next/server";
import { RenderRequestSchema } from "@/lib/cards/schema";
import { renderCardToPng, renderCardToSvg } from "@/lib/cards/renderer";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const json = await req.json().catch(() => null);
    const parsed = RenderRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid card document or render options",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { document, scale, format } = parsed.data;
    const filename = `graphixl-${document.template}-${document.aspectRatio}.${format}`;

    if (format === "svg") {
      const svg = await renderCardToSvg(document);
      return new Response(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const pngBuffer = await renderCardToPng(document, scale);
    return new Response(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Image rendering failed";
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
