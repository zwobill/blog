import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, '') },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as any;
  const slug = post.id.replace(/\.(md|mdx)$/, '');

  const frontmatter = `---
title: "${post.data.title}"
description: "${post.data.description}"
pubDate: ${post.data.pubDate.toISOString()}
author: "${post.data.author}"
category: "${post.data.category}"
tags: [${post.data.tags.map((t: string) => `"${t}"`).join(', ')}]
canonicalUrl: "https://billzuo.com/blog/${slug}"
---

`;

  const fullMarkdown = frontmatter + (post.body || '');

  return new Response(fullMarkdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
