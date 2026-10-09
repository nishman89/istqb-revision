// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// GitHub Pages serves a project site from /<repo-name>/.
// SITE_URL and BASE_PATH are set by the deploy workflow; the defaults suit local development.
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  integrations: [mdx()],
});
