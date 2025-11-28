<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const colorMode = useColorMode()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Inicio',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Generador',
    to: '/generador',
    active: route.path.startsWith('/generador')
  },
  {
    label: 'Cómo usar las firmas',
    to: '/como-usar',
    active: route.path.startsWith('/como-usar')
  }
])
</script>

<template>
  <UHeader role="banner">
    <template #title>
      <NuxtLink to="/" class="flex items-center gap-2" aria-label="Ir a la página de inicio">
        <UIcon name="i-tabler-signature" class="size-6 text-primary" />
        <span>Generador de firmas</span>
      </NuxtLink>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" aria-label="Navegación principal" />
    </template>

    <UNavigationMenu :items="items" aria-label="Navegación principal" class="hidden sm:flex" />

    <template #right>
      <UTooltip
        :text="colorMode.value === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <UColorModeButton aria-label="Cambiar modo de color" />
      </UTooltip>

      <UTooltip text="Ver repositorio en GitHub">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/ComicIvans/mail-signatures-ui"
          target="_blank"
          rel="noopener noreferrer"
          icon="i-tabler-brand-github"
          aria-label="Abrir repositorio de la página en GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>
