# CLAUDE.md

Project guidance for Claude when working in this repository.

## Project

Art portfolio for Gayathri Devi (mixed medium artist). Next.js (App Router) +
TypeScript + Tailwind CSS. The home page is a horizontal scroll-snap gallery
driven entirely by the config array in `content/home.ts`. Planned: Sanity CMS
for content editing, then a `/store` (grid + per-painting purchase pages) with
Stripe Checkout.

## Team

- **Sole developer.** Vinu is the only developer on this project.

## Git workflow

We follow a disciplined workflow using short-lived feature branches and
Conventional Commits.

### Branches

- **Always create a branch before writing code** for a new feature or fix.
  Branch off the up-to-date main line.
- Use **kebab-case** with one of these prefixes:
  - `feat/` — a new feature
  - `fix/` — a bug fix
  - `chore/` — tooling, deps, config, housekeeping
  - `refactor/` — code change that neither fixes a bug nor adds a feature
  - `docs/` — documentation only
- Example: `feat/landing-page-layout`

### Commits

- Follow **Conventional Commits**: `<type>(<scope>): <short imperative description>`
  - `type`: `feat`, `fix`, `chore`, `refactor`, `docs` (matching the branch prefix)
  - `scope`: the area touched, e.g. `homepage`, `gallery`, `store`
  - description: imperative mood, lower-case, no trailing period
- Example: `feat(homepage): add elegant typography and split-screen layout`
- Keep commits focused and discrete.

### Claude's responsibilities

1. **Before** writing code for a new feature/fix, remind Vinu to check out a new
   branch, and propose the branch name.
2. **After** finishing a discrete task, provide the exact git commands to add,
   commit, and prepare to merge (e.g. `git add … && git commit -m "…"`,
   then the push command).
3. Always provide the **exact** Conventional Commit message for the changes.
