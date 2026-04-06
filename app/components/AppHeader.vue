<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { siteRepositoryUrl, siteShortName } from '~~/shared/constants/site'

const route = useRoute()
const colorMode = useColorMode()
const isMobileMenuOpen = ref(false)

function normalizePath(path: string) {
  return path === '/' ? '/' : path.replace(/\/+$/, '')
}

function isActivePath(targetPath: string) {
  const currentPath = normalizePath(route.path)
  const normalizedTargetPath = normalizePath(targetPath)

  return (
    currentPath === normalizedTargetPath ||
    (normalizedTargetPath !== '/' && currentPath.startsWith(`${normalizedTargetPath}/`))
  )
}

const navigationItems = computed<
  Array<NavigationMenuItem & { icon: string; description: string; active: boolean }>
>(() => [
  {
    label: 'Inicio',
    to: '/',
    icon: 'i-tabler-home',
    description: 'Resumen del generador y ejemplos',
    active: isActivePath('/')
  },
  {
    label: 'Generador',
    to: '/generador',
    icon: 'i-tabler-wand',
    description: 'Configura y exporta la firma',
    active: isActivePath('/generador')
  },
  {
    label: 'Cómo usar las firmas',
    to: '/como-usar',
    icon: 'i-tabler-help-circle',
    description: 'Guía para clientes de correo',
    active: isActivePath('/como-usar')
  }
])

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
  }
)
</script>

<template>
  <header
    role="banner"
    class="page-section border-default bg-default/80 px-4 py-3 shadow-sm backdrop-blur-xl"
  >
    <div class="flex items-center justify-between gap-3">
      <NuxtLink to="/" class="flex min-w-0 items-center gap-3" aria-label="Generador de firmas">
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary"
          aria-hidden="true"
        >
          <UIcon name="i-tabler-signature" class="size-5" />
        </div>
        <span class="truncate font-semibold">{{ siteShortName }}</span>
      </NuxtLink>

      <UNavigationMenu
        :items="navigationItems"
        aria-label="Navegación principal"
        class="hidden min-w-0 flex-1 justify-center lg:flex"
      />

      <div class="flex shrink-0 items-center gap-1 sm:gap-2">
        <UTooltip
          :text="colorMode.value === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <UColorModeButton aria-label="Cambiar modo de color" />
        </UTooltip>

        <UTooltip text="Ver repositorio en GitHub">
          <UButton
            color="neutral"
            variant="ghost"
            :to="siteRepositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            icon="i-tabler-brand-github"
            aria-label="Abrir repositorio de la página en GitHub"
            class="hidden sm:inline-flex"
          />
        </UTooltip>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-tabler-menu-2"
          aria-label="Abrir menú de navegación"
          class="lg:hidden"
          @click="isMobileMenuOpen = true"
        />
      </div>
    </div>

    <UDrawer v-model:open="isMobileMenuOpen" direction="right">
      <template #content>
        <div class="flex h-full flex-col gap-4 p-4">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate font-semibold text-highlighted">{{ siteShortName }}</p>
              <p class="text-sm text-muted">Navegación</p>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              icon="i-tabler-x"
              aria-label="Cerrar menú"
              @click="isMobileMenuOpen = false"
            />
          </div>

          <nav class="grid gap-2" aria-label="Navegación móvil">
            <UButton
              v-for="item in navigationItems"
              :key="item.label"
              :to="item.to"
              :icon="item.icon"
              :color="item.active ? 'primary' : 'neutral'"
              :variant="item.active ? 'soft' : 'ghost'"
              class="justify-start"
              @click="isMobileMenuOpen = false"
            >
              <span class="truncate">{{ item.label }}</span>
            </UButton>
          </nav>

          <div class="mt-auto space-y-2">
            <UButton
              color="neutral"
              variant="outline"
              :to="siteRepositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
              icon="i-tabler-brand-github"
              block
            >
              Ver repositorio
            </UButton>
          </div>
        </div>
      </template>
    </UDrawer>
  </header>
</template>
