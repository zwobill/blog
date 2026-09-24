import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '@/config/site';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const content = `# ${SITE.name} — Personal Engineering Blog
> ${SITE.description}

## About The Author
- Name: ${SITE.author.name} (${SITE.author.legalName})
- Role: ${SITE.author.role}
- Company: [${SITE.author.company}](${SITE.author.companyUrl})
- Location: ${SITE.author.location}
- LinkedIn: ${SITE.author.social.linkedin}
- X / Twitter: ${SITE.author.social.twitter}
- GitHub: ${SITE.author.social.github}
- Bio: ${SITE.author.bio}

## Core Technical Focus Areas
${SITE.author.knowsAbout.map((area) => `- ${area}`).join('\n')}

## Curated Articles & Deep Dives
${posts
  .map((post) => {
    const slug = post.id.replace(/\.(md|mdx)$/, '');
    const url = `${SITE.url}/blog/${slug}`;
    const rawMdUrl = `${SITE.url}/blog/${slug}.md`;
    return `### [${post.data.title}](${url})
- Date: ${post.data.pubDate.toISOString().split('T')[0]}
- Category: ${post.data.category}
- Tags: ${post.data.tags.join(', ')}
- Summary: ${post.data.description}
- Raw Markdown: ${rawMdUrl}`;
  })
  .join('\n\n')}

## Machine-Readable Resources
- Full Corpus for LLM Ingestion: ${SITE.url}/llms-full.txt
- RSS 2.0 Feed: ${SITE.url}/rss.xml
- XML Sitemap: ${SITE.url}/sitemap-index.xml
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
