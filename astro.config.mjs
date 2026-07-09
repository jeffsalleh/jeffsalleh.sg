import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  // ← replace with your domain
  site: 'https://yourdomain.com',

  integrations: [mdx()],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  output: "hybrid",
  adapter: cloudflare()
});