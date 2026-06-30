import { groq } from "next-sanity";

import type { Block } from "@/content/home";
import { homeBlocks as localHomeBlocks } from "@/content/home";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";

// Fetch the single `home` document and its ordered blocks.
const HOME_QUERY = groq`*[_type == "home"][0]{
  blocks[]{
    _type,
    _key,
    // intro
    name,
    subtitle,
    // image
    image,
    alt,
    size,
    caption,
    // text
    paragraphs,
    // links
    links[]{ label, href }
  }
}`;

// Shape of a raw block coming back from Sanity (loosely typed; we narrow on
// `_type` in the mapper below).
type RawBlock = {
  _type: string;
  _key: string;
  name?: string;
  subtitle?: string;
  image?: Parameters<typeof urlForImage>[0];
  alt?: string;
  size?: "sm" | "md" | "lg";
  caption?: string;
  paragraphs?: string[];
  links?: { label: string; href: string }[];
};

function mapBlock(raw: RawBlock): Block | null {
  switch (raw._type) {
    case "introBlock":
      return {
        type: "intro",
        name: raw.name ?? "",
        subtitle: raw.subtitle ?? "",
      };
    case "imageBlock":
      if (!raw.image) return null;
      return {
        type: "image",
        src: urlForImage(raw.image).width(1040).fit("max").url(),
        alt: raw.alt ?? "",
        size: raw.size,
        caption: raw.caption,
      };
    case "textBlock":
      return { type: "text", paragraphs: raw.paragraphs ?? [] };
    case "linksBlock":
      return { type: "links", links: raw.links ?? [] };
    default:
      return null;
  }
}

/**
 * Returns the home page blocks. Pulls from Sanity when a project is configured
 * and the `home` document has content; otherwise falls back to the local
 * `content/home.ts` config so the site always renders.
 */
export async function getHomeBlocks(): Promise<Block[]> {
  if (!isSanityConfigured) return localHomeBlocks;

  const data = await client.fetch<{ blocks?: RawBlock[] } | null>(
    HOME_QUERY,
    {},
    { next: { revalidate: 60 } },
  );

  const blocks = (data?.blocks ?? [])
    .map(mapBlock)
    .filter((b): b is Block => b !== null);

  return blocks.length > 0 ? blocks : localHomeBlocks;
}
