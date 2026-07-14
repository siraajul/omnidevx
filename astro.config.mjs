// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import partytown from '@astrojs/partytown';
import sentry from '@sentry/astro';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://omnidevx-iota.vercel.app',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    react(),
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sentry({
      dsn: process.env.SENTRY_DSN,
      sourceMapsUploadOptions: {
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    sitemap(),
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'your-project-id',
      dataset: process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['gsap']
    }
  },

  adapter: vercel(),
  output: 'server'
});