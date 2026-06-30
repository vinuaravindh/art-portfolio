import { defineArrayMember, defineField, defineType } from "sanity";

// The home page is a single document holding an ordered list of blocks.
// Editors drag blocks to reorder the gallery — the order here is the order on
// the page, exactly like the `homeBlocks` array in content/home.ts.
export const homeType = defineType({
  name: "home",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "blocks",
      title: "Gallery blocks",
      description:
        "The panels of the horizontal gallery, left to right. Drag to reorder.",
      type: "array",
      of: [
        defineArrayMember({ type: "introBlock" }),
        defineArrayMember({ type: "imageBlock" }),
        defineArrayMember({ type: "textBlock" }),
        defineArrayMember({ type: "linksBlock" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home page" }),
  },
});
