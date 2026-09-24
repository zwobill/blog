# Bill Zuo's Personal Engineering Blog

Personal blog of **Bill Zuo (Yunfei Zuo)** — Founder & CEO at [Softprobe](https://softprobe.ai). Focused on large-scale distributed systems, runtime context vs. the observability "indexing tax", agent QA, and Generative Engine Optimization (GEO).

Live site: [https://billzuo.com](https://billzuo.com)

---

## Architecture & Features

- **Framework:** [Astro](https://astro.build/) (Static Pre-rendering + Cloudflare Worker edge integration)
- **Deployment:** Cloudflare Pages / Workers Git Integration (no GitHub Actions CI/CD needed; automated builds on push to `main`)
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

1. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Select repository: `zwobill/blog`.
3. Set build configuration:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/client`
   - **Environment variable:** `NODE_VERSION = 22` (or automatically detected via `.node-version` / `.nvmrc`)
4. Click **Save and Deploy**. Cloudflare's GitHub App will deploy your site on every push to `main` with zero GitHub Actions required.
