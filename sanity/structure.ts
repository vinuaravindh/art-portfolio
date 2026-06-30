import type { StructureResolver } from "sanity/structure";

// Custom Studio sidebar: surface the Home page as a single fixed document
// (a singleton) rather than a list you can add/delete documents in.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home page")
        .id("home")
        .child(S.document().schemaType("home").documentId("home")),
    ]);
