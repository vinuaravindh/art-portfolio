"use client";

// Configuration for the embedded Sanity Studio, served at /studio.
// This file is imported by app/studio/[[...tool]]/page.tsx.

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  // A placeholder keeps the Studio from throwing before a real project id is
  // set. Add NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local to go live.
  projectId: projectId || "placeholder",
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
