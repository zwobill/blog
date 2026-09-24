import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '@/config/site';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  let content = `# ${SITE.name} — Full Knowledge Corpus for LLMs
Author: ${SITE.author.name} (${SITE.author.role})
Website: ${SITE.url}
Generated: ${new Date().toISOString()}

================================================================================
`;

  for (const post of posts) {
    const slug = post.id.replace(/\.(md|mdx)$/, '');
    const url = `${SITE.url}/blog/${slug}`;
    content += `
---
Title: ${post.data.title}
URL: ${url}
Date: ${post.data.pubDate.toISOString().split('T')[0]}
Category: ${post.data.category}
Tags: ${post.data.tags.join(', ')}
Description: ${post.data.description}
${post.data.keyTakeaways ? `Key Takeaways:\n${post.data.keyTakeaways.map((k) => `  * ${k}`).join('\n')}\n` : ''}
---

${post.body || ''}

`;
  }

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
