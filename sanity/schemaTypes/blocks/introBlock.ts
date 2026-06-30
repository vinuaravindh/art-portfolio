import { defineField, defineType } from "sanity";

export const introBlock = defineType({
  name: "introBlock",
  title: "Intro (name + subtitle)",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "subtitle" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Intro",
      subtitle: subtitle ? `Intro · ${subtitle}` : "Intro",
    }),
  },
});
