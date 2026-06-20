// =============================================================================
// HOME PAGE CONTENT
// =============================================================================
// This array IS your home page. The gallery renders these blocks left-to-right
// in the exact order you list them here. To rearrange the page, reorder the
// items in this array. To add a panel, add a new object. No other code needs
// to change.
//
// Block types available (see components/blocks for how each renders):
//   - "intro"  : your name + subtitle (the landing panel)
//   - "image"  : a single painting / photo
//   - "text"   : one or more paragraphs of copy
//   - "links"  : a list of external links (social, email)
//
// Images live in /public/images. Reference them as "/images/your-file.jpg".
// =============================================================================

export type Block =
  | {
      type: "intro";
      name: string;
      subtitle: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      size?: "sm" | "md" | "lg" | "edge";
      caption?: string;
      hoverTitle?: string;
      hoverDescription?: string;
    }
  | {
      type: "text";
      paragraphs: string[];
    }
  | {
      type: "links";
      links: { label: string; href: string }[];
    };

export const homeBlocks: Block[] = [
  {
    type: "intro",
    name: "Gayathri Devi",
    subtitle: "Mixed Medium Artist based in Salem",
  },
  {
    type: "image",
    src: "/images/lily-pond.svg",
    alt: "Painting of a figure resting in a lily pond, framed in wood",
    width: 1146,
    height: 505,
    size: "lg",
    hoverTitle: "Lilly Pond and Vallam",
    hoverDescription: "Traditional Kerala Lilly Pond 3D installation art work made with texture, resin and sculpture.\nDimensions – 5.10 ft x 3ft\nTeakwood Frame\nRs. 45,000/-",
  },
  {
    type: "text",
    paragraphs: [
      "I've been a self-taught artist for over five years. It's a constant tug-of-war between my dreamer and my critic, yet art has become a process I've grown to love. Through it, art teaches me about the world—and about myself.",
    ],
  },
  {
    type: "image",
    src: "/images/flowers.svg",
    alt: "Floral mixed-medium painting in pinks and greens",
    width: 489,
    height: 686,
    size: "md",
    hoverTitle: "Floral",
    hoverDescription: "3D installation art work made with heavy impasto, texture paste, and sculpture techniques.\nDimensions – 3 ft x 4ft\nRs. 35,000/-",
  },
  {
    type: "text",
    paragraphs: [
      "My work explores the intersection of nature, texture, and symbolism. Drawing inspiration from the Earth and its elements, I strive to create art that feels organic, soulful, and deeply connected to the world around us.",
      "My practice centers around the use of sustainable materials, layering techniques, and a rich interplay of textures to offer viewers a tactile, immersive experience.",
    ],
  },
  {
    type: "image",
    src: "/images/green-texture.svg",
    alt: "Heavily textured painting in layered greens",
    width: 870,
    height: 546,
    size: "md",
    hoverTitle: "Emerald Topography",
    hoverDescription: "Abstract landscape art work created with a heavy texture medium, modeling compound, and impasto paint techniques\nDimensions – 5 ft x 3ft\nRs. 30,000/-",
  },
  {
    type: "image",
    src: "/images/lily-pad.svg",
    alt: "Painting of koi and water lilies on a blue pond",
    width: 469,
    height: 469,
    size: "sm",
  },
  {
    type: "links",
    links: [
      { label: "Instagram", href: "https://instagram.com/" },
      { label: "Tiktok", href: "https://tiktok.com/" },
      { label: "X", href: "https://x.com/" },
      { label: "Email", href: "mailto:hello@example.com" },
    ],
  },
  {
    type: "image",
    src: "/images/edge-strip.svg",
    alt: "Detail of leaf-like brushstrokes in warm tones",
    width: 853,
    height: 1024,
    size: "edge",
  },
];
