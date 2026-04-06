<script setup lang="ts">
import { es } from '@nuxt/ui/locale'
import {
  authorSocialProfiles,
  siteAuthor,
  siteCategory,
  siteDescription,
  siteKeywords,
  siteLocale,
  siteName,
  siteRepositoryUrl,
  siteThemeColor,
  siteUrl
} from '~~/shared/constants/site'

useHead({
  meta: [
    { name: 'theme-color', content: siteThemeColor },
    { name: 'author', content: siteAuthor }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

useSeoMeta({
  titleTemplate: `%s | ${siteName}`,
  description: siteDescription,
  applicationName: siteName,
  keywords: siteKeywords.join(', '),
  themeColor: siteThemeColor,
  author: siteAuthor,
  ogSiteName: siteName,
  ogLocale: siteLocale,
  twitterCard: 'summary_large_image'
})

defineOgImage('NuxtSeoSatori', {
  title: siteName,
  description: siteDescription,
  siteLogo: '/favicon.svg',
  theme: siteThemeColor,
  colorMode: 'light'
})

useSchemaOrg([
  defineWebSite({
    '@id': `${siteUrl}#website`,
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    inLanguage: ['es']
  }),
  defineSoftwareApp({
    '@id': `${siteUrl}#app`,
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    applicationCategory: siteCategory,
    operatingSystem: 'Web',
    author: {
      '@type': 'Person',
      name: siteAuthor,
      sameAs: [
        authorSocialProfiles.github,
        authorSocialProfiles.linkedin,
        authorSocialProfiles.instagram
      ]
    },
    isAccessibleForFree: true,
    keywords: siteKeywords.join(', '),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR'
    },
    sameAs: [siteRepositoryUrl]
  })
])
</script>

<template>
  <UApp :locale="es">
    <NuxtLoadingIndicator :color="siteThemeColor" aria-label="Cargando página" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
