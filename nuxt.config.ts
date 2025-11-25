// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/seo'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://firmas.wupp.dev',
    name: 'Generador de Firmas de Correo Electrónico',
    description:
      'Genera firmas de correo electrónico profesionales para organizaciones. Personaliza los datos y copia la firma en tu cliente de correo favorito.',
    defaultLocale: 'es'
  },

  compatibilityDate: '2025-01-15'
})
