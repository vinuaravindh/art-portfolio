# Connecting Sanity CMS

The code for Sanity is already wired up. Until a Sanity project is connected,
the site renders from the local `content/home.ts` config. Once you complete the
steps below, the home page is driven by content edited in the Studio at
`/studio`, and Gayathri can update text, swap images, and drag panels to reorder
the gallery — no code required.

## 1. Create a Sanity project

1. Go to <https://www.sanity.io/manage> and sign in (free plan is fine).
2. Create a new project. Note the **Project ID**.
3. It comes with a `production` **dataset** by default.

## 2. Add your credentials

Copy the example env file and fill in your Project ID:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

## 3. Allow the Studio to talk to your project (CORS)

In <https://www.sanity.io/manage> → your project → **API → CORS origins**, add:

- `http://localhost:3000` (check "Allow credentials")
- your production URL later (e.g. `https://your-site.vercel.app`)

## 4. Run it

```bash
npm run dev
```

- The site is at <http://localhost:3000>
- The editing Studio is at <http://localhost:3000/studio>

Open the Studio, sign in, and you'll see **Home page**. Add your blocks
(intro, image, text, links) and drag them to set the gallery order, then
**Publish**. The site reflects published changes within ~60 seconds (the fetch
revalidates on an interval; see `sanity/lib/queries.ts`).

## How it fits together

| File | Role |
| --- | --- |
| `sanity/schemaTypes/` | Defines the block types and the Home singleton |
| `sanity.config.ts` | Studio config (mounted at `/studio`) |
| `sanity/lib/queries.ts` | Fetches Home blocks, maps them to the app's `Block` type, falls back to `content/home.ts` |
| `app/page.tsx` | Renders the gallery from `getHomeBlocks()` |
| `content/home.ts` | Local fallback content + the shared `Block` type |

## Seeding the first content

The Studio starts empty. Re-create the panels you see in `content/home.ts`
(intro, the images, the two text blocks, the links) inside the Home document,
upload the real paintings, and publish. From then on the Studio is the source
of truth; `content/home.ts` remains only as the safety-net fallback.
