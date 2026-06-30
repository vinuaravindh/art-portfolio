import { defineField, defineType } from "sanity";

export const textBlock = defineType({
  name: "textBlock",
  title: "Text",
  type: "object",
  fields: [
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      description: "Each entry renders as its own paragraph.",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { paragraphs: "paragraphs" },
    prepare: ({ paragraphs }) => ({
      title: paragraphs?.[0] || "Text",
      subtitle: "Text",
    }),
  },
});
