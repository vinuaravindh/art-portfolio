// Embedded Sanity Studio route. Visiting /studio renders the full editing UI.
// All Studio routing is handled client-side by the catch-all segment.

import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
