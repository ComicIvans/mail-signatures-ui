<script setup lang="ts">
import { es } from '@nuxt/ui/locale'
import type { NuxtError } from '#app'
import { siteThemeColor } from '~~/shared/constants/site'

const props = defineProps<{
  error: NuxtError
}>()

useHead({
  meta: [{ name: 'theme-color', content: siteThemeColor }],
  htmlAttrs: {
    lang: 'es'
  }
})

const errorMessages: Record<number, { title: string; description: string }> = {
  404: {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o ha sido movida.'
  },
  500: {
    title: 'Error del servidor',
    description: 'Ha ocurrido un error interno. Por favor, inténtalo de nuevo más tarde.'
  },
  403: {
    title: 'Acceso denegado',
    description: 'No tienes permiso para acceder a esta página.'
  }
}

const defaultError = {
  title: 'Error',
  description: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.'
}

const currentError =
  props.error.statusCode !== undefined
    ? (errorMessages[props.error.statusCode] ?? defaultError)
    : defaultError

useSeoMeta({
  titleTemplate: '%s | Generador de firmas de correo',
  title: `${props.error.statusCode} - ${currentError.title}`,
  description: currentError.description,
  robots: 'noindex, nofollow',
  ogTitle: currentError.title,
  ogDescription: currentError.description,
  themeColor: siteThemeColor
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <UApp :locale="es">
    <NuxtRouteAnnouncer />
    <LayoutShell>
      <div class="py-12">
        <UError
          :error="{
            ...error,
            message: currentError.description,
            statusMessage: currentError.title
          }"
          :clear="{ label: 'Volver al inicio', icon: 'i-tabler-home', onClick: handleError }"
        />
      </div>
    </LayoutShell>
  </UApp>
</template>
