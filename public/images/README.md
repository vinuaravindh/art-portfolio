# Image assets

**This is where you add the paintings / photos for the home page.**

Drop your image files into this folder (`public/images/`). Anything in
`public/` is served from the site root, so a file at
`public/images/lily-pond.jpg` is referenced in code as `/images/lily-pond.jpg`.

## How to swap in your own images

1. Copy your image file into this folder, e.g. `lily-pond.jpg`.
2. Open `content/home.ts` and update the matching block's `src` to point at it:

   ```ts
   {
     type: "image",
     src: "/images/lily-pond.jpg", // <- your file
     alt: "A short description of the painting",
     size: "lg",
   }
   ```

3. Save. The dev server hot-reloads.

The `.svg` files currently in this folder are just labeled placeholders so the
scaffold renders out of the box — replace them with your real artwork.

## Tips

- **Formats**: `.jpg` / `.webp` for photos of paintings, `.png` if you need
  transparency. `next/image` optimizes them automatically.
- **Naming**: lowercase, hyphenated, no spaces (e.g. `koi-pond-2024.jpg`).
- **Size**: ~2000px on the long edge is plenty for web. Huge originals just
  slow the page down.
- The `alt` text in `content/home.ts` is read by screen readers and search
  engines — describe each piece briefly.
