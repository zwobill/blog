import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@/config/site';

export async function GET(context: { site: URL }) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE.name} — Engineering Blog`,
    description: SITE.description,
    site: context.site || SITE.url,
    items: posts.map((post) => {
      const slug = post.id.replace(/\.(md|mdx)$/, '');
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        categories: post.data.tags,
        author: `${SITE.author.name} (${SITE.author.social.twitterHandle})`,
        link: `/blog/${slug}/`,
      };
    }),
    customData: `
      <language>en-us</language>
      <copyright>Copyright ${new Date().getFullYear()} ${SITE.author.name}</copyright>
    `,
  });
}
