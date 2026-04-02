import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: process.env.SITE_URL || 'https://ddan-hood-cleaning.pages.dev',
  integrations: [
    tailwind(),
  ],
  output: 'static',
});
