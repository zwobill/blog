export interface NavItem {
  name: string;
  href: string;
}

export const SITE = {
  url: 'https://billzuo.com',
  name: 'Bill Zuo',
  legalName: 'Yunfei Zuo',
  title: 'Bill Zuo | Distributed Systems, AI Context & Agent QA',
  description:
    'Personal blog of Bill Zuo (Yunfei Zuo), Founder & CEO at Softprobe. Insights on eliminating observability indexing tax, agent QA, DuckLake telemetry, and generative engine optimization.',
  defaultOgImage: '/og-image.svg',
  locale: 'en_US',
  lang: 'en',
  author: {
    name: 'Bill Zuo',
    legalName: 'Yunfei Zuo',
    role: 'Founder & CEO at Softprobe',
    company: 'Softprobe',
    companyUrl: 'https://softprobe.ai',
    bio: 'Dynamic tech executive with 20+ years architecting scalable AI-driven systems, context-first observability, and agent QA infrastructure.',
    avatar: '/bill-zuo.jpg',
    location: 'Los Altos, California, United States',
    social: {
      github: 'https://github.com/zwobill',
      githubHandle: 'zwobill',
      linkedin: 'https://linkedin.com/in/yunfeizuo',
      twitter: 'https://x.com/billzwo',
      twitterHandle: '@billzwo',
      medium: 'https://medium.com/@yunfeizuo',
    },
    knowsAbout: [
      'Distributed Systems',
      'AI Observability',
      'Agent QA',
      'DuckLake Telemetry',
      'Runtime Context',
      'OpenTelemetry',
      'Cloud Architecture',
      'Generative Engine Optimization (GEO)',
    ],
  },
  nav: [
    { name: 'Home', href: '/' },
    { name: 'Articles', href: '/blog' },
    { name: 'Topics', href: '/tags' },
    { name: 'About', href: '/about' },
  ] as NavItem[],
  topics: [
    { slug: 'agent-qa', name: 'Agent QA', description: 'Testing and validating autonomous AI agents and coding tools.' },
    { slug: 'observability', name: 'Observability', description: 'Session graphs, runtime context, and escaping the indexing tax.' },
    { slug: 'distributed-systems', name: 'Distributed Systems', description: 'High-throughput telemetry, storage engines, and consensus.' },
    { slug: 'ai-infrastructure', name: 'AI Infrastructure', description: 'Architecting backends and data pipelines for autonomous agents.' },
    { slug: 'geo', name: 'GEO & SEO', description: 'Generative Engine Optimization for AI search engines.' },
  ],
};
