# Bill Zuo's Personal Engineering Blog

Personal blog of **Bill Zuo (Yunfei Zuo)** — Founder & CEO at [Softprobe](https://softprobe.ai). Focused on large-scale distributed systems, runtime context vs. the observability "indexing tax", agent QA, and Generative Engine Optimization (GEO).

Live site: [https://billzuo.com](https://billzuo.com)

---

## Architecture & Features

- **Framework:** [Astro](https://astro.build/) (Static Pre-rendering + Cloudflare Worker edge integration)
- **Deployment:** Cloudflare Worker `blog` on the Softprobe account, bound to `billzuo.com`. See the deploy section below.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/typography`
- **Content:** Git-managed Markdown (`.md`) and MDX (`.mdx`) with type-safe Astro Content Collections
- **Rich Media MDX Components:**
  - `<KeyTakeaways />` — Executive summary / TL;DR blocks optimized for AI Answer Engines
  - `<Figure />` & `<Image />` — WebP/AVIF optimized images with 0 Cumulative Layout Shift (0 CLS)
  - `<YouTube />` — Zero-JS high-performance facade embed (preserves 100/100 Lighthouse score)
  - `<Video />` — Accessible self-hosted HTML5 video player
  - `<Callout />` — Tip, Note, Warning, Danger, and Info admonitions
  - `<FAQ />` — Interactive accordion with automatic Schema.org `FAQPage` JSON-LD microdata injection
  - `<CodeBlock />` — Syntax-highlighted code blocks with language badge and one-click copy button
- **SEO & GEO (Generative Engine Optimization):**
  - Schema.org microdata (`BlogPosting`, `Person` with E-E-A-T credentials, `FAQPage`, `speakable`)
  - AI bot permissions in `robots.txt` (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`)
  - Machine-readable AI standards: `/llms.txt` and `/llms-full.txt`
  - Dynamic RSS 2.0 Feed (`/rss.xml`) & XML Sitemap (`/sitemap-index.xml`)
  - Raw Markdown endpoints for AI crawlers: `/blog/[slug].md`
- **Cloudflare Edge Features:**
  - `public/_headers`: Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), Permissions-Policy, X-Content-Type-Options, immutable asset caching
  - `public/_redirects`: Clean canonical URL handling

---

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Cloudflare Deployment Setup

Production is a **Cloudflare Worker** named `blog` (not a Pages project) on the Softprobe account, with a custom domain on `billzuo.com`. `wrangler.jsonc` uses that same script name so deploys update the live Worker instead of creating a new one.

Merges to `main` are deployed by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) once these repository secrets exist:

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/), open the **Softprobe** account.
2. Go to **Manage Account → Account API Tokens → Create Token**.
3. Use the **Edit Cloudflare Workers** template (Workers Scripts Edit, plus Account Settings Read). Do not paste the token into chat or into this repository.
4. In this GitHub repo, go to **Settings → Secrets and variables → Actions** and add:
   - `CLOUDFLARE_API_TOKEN` — the token from step 3
   - `CLOUDFLARE_ACCOUNT_ID` — the Softprobe account ID
5. After the secrets are in place, merging a pull request to `main` builds the site and runs `wrangler deploy`. Pull requests themselves only run a build; they do not deploy.

Until those secrets are set, deploy manually from a trusted machine:

```bash
npm ci
npm run build
npx wrangler deploy
```

The Wrangler command must target the Softprobe account and the Worker named `blog`.
