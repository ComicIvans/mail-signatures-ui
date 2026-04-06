import tailwindcss from '@tailwindcss/vite'
import { siteDescription, siteName, siteUrl } from './shared/constants/site'

const isDev = process.env.NODE_ENV !== 'production'
const enableDevtools = process.env.NUXT_DEVTOOLS === 'true'

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxtjs/seo', '@nuxt/eslint'],

  devtools: {
    enabled: enableDevtools
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@unhead/schema-org/vue',
        '@formkit/auto-animate/vue',
        'zod/v4'
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', sizes: 'any' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  site: {
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    defaultLocale: 'es',
    trailingSlash: false,
    env: isDev ? 'development' : 'production',
    indexable: !isDev
  },

  icon: {
    collections: ['lucide', 'tabler', 'simple-icons']
  },

  colorMode: {
    preference: 'system',
    fallback: 'light'
  },

  ogImage: {
    defaults: {
      width: 1200,
      height: 630
    },
    enabled: true,
    zeroRuntime: true
  },

  sitemap: {
    autoLastmod: true,
    xsl: false,
    zeroRuntime: true
  },

  robots: {
    allow: ['/']
  },

  linkChecker: {
    enabled: false
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false,
      failOnError: false
    }
  },

  compatibilityDate: '2025-07-15'
})
