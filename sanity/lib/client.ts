import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

// Read-only client used by the Next.js app to fetch published content.
// A placeholder projectId keeps `createClient` from throwing at build time when
// no project is configured yet; we never actually query unless
// `isSanityConfigured` is true (see sanity/lib/queries.ts).
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true, // served from Sanity's edge cache; fine for published content
});
