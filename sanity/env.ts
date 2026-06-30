// Centralised Sanity environment configuration.
//
// These are read from environment variables so the same code runs locally and
// in production. Copy `.env.local.example` to `.env.local` and fill in the
// values from your Sanity project (https://www.sanity.io/manage) before the
// Studio or live content will work.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// True only once a real project id is supplied. The site falls back to the
// local `content/home.ts` config until this is configured, so everything keeps
// working out of the box.
export const isSanityConfigured = projectId.length > 0;
