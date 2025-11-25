<script setup lang="ts">
import { es } from '@nuxt/ui/locale'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#10b981' },
    { name: 'author', content: 'Iván Salido Cobo' }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'es'
  }
})

useSeoMeta({
  titleTemplate: '%s | Generador de firmas de correo',
  keywords: 'firmas de correo, generador de firmas, email signatures, firma HTML, firma profesional'
})
</script>

<template>
  <UApp :locale="es">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
      Saltar al contenido principal
    </a>

    <NuxtLoadingIndicator aria-label="Cargando página" />
    <NuxtRouteAnnouncer />

    <AppHeader />

    <UMain id="main-content" role="main">
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>

    <AppFooter />
  </UApp>
</template>
