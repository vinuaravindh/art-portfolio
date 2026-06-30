import { defineField, defineType } from "sanity";

export const linksBlock = defineType({
  name: "linksBlock",
  title: "Links",
  type: "object",
  fields: [
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineField({
          name: "link",
          title: "Link",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "URL",
              description: "e.g. https://instagram.com/you or mailto:you@mail.com",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { links: "links" },
    prepare: ({ links }) => ({
      title: "Links",
      subtitle: links?.map((l: { label?: string }) => l.label).join(" · "),
    }),
  },
});
