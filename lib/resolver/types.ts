import { z } from "zod";

export const ResolveRequestSchema = z.object({
  url: z.string().min(1).max(2048),
});

export type ResolveRequest = z.infer<typeof ResolveRequestSchema>;

export interface NormalizedMetadata {
  url: string;
  siteName: string;
  title: string;
  description: string;
  imageUrl: string | null;
  faviconUrl: string | null;
  provider: "generic" | "github";
  extra?: {
    owner?: string;
    repo?: string;
    stars?: number;
    forks?: number;
    language?: string;
    author?: string;
    publishedDate?: string;
    readTime?: string;
    [key: string]: unknown;
  };
}

export type ResolveResponse =
  | {
      success: true;
      metadata: NormalizedMetadata;
    }
  | {
      success: false;
      error: string;
      code?: string;
    };
