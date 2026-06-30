# Art Portfolio

A horizontally-scrolling art portfolio for Gayathri Devi, mixed medium artist.
Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

The home page is a sideways-scrolling gallery: text and image panels laid out
left-to-right with CSS scroll-snap. The entire page is driven by a single
config file, so it can be rearranged without touching component code.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata
  page.tsx          Home page — renders the gallery from content/home.ts
  globals.css       Tailwind import + a little global styling
components/
  Gallery.tsx       Maps the config array to block components (scroll-snap row)
  blocks/
    IntroBlock.tsx  Artist name + subtitle (the landing panel)
    ImageBlock.tsx  A single painting / photo
    TextBlock.tsx   One or more paragraphs
    LinksBlock.tsx  Social / email links
content/
  home.ts           ⭐ THE PAGE CONTENT — edit this to change/reorder the page
public/
  images/           ⭐ Put your painting images here (see images/README.md)
```

## Editing the page

Everything you see on the home page comes from the `homeBlocks` array in
[`content/home.ts`](content/home.ts).

- **Reorder the page**: move items up/down in the array.
- **Add a panel**: add a new object (`intro`, `image`, `text`, or `links`).
- **Remove a panel**: delete its object.
- **Change an image**: drop the file in `public/images/` and update its `src`.

No other files need to change — `Gallery.tsx` renders whatever the array
contains, and TypeScript will warn you if a block is missing a required field.

## Adding images

See [`public/images/README.md`](public/images/README.md). Short version: put
files in `public/images/` and reference them as `/images/your-file.jpg` in
`content/home.ts`.

## Roadmap

This scaffold is **Step 1** (the portfolio home page). Planned next steps:

1. ✅ Horizontal scroll-snap gallery driven by a config file (this scaffold).
2. Move content into a headless CMS (Sanity) for drag-to-reorder editing.
3. `/store` grid of paintings + individual `/store/[slug]` purchase pages.
4. Stripe Checkout for buying originals.
