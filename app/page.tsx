import { Gallery } from "@/components/Gallery";
import { getHomeBlocks } from "@/sanity/lib/queries";

export default async function HomePage() {
  // Pulls from Sanity when configured, otherwise falls back to content/home.ts.
  const blocks = await getHomeBlocks();
  return <Gallery blocks={blocks} />;
}
