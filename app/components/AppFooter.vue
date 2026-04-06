<script setup lang="ts">
import { authorSocialProfiles, siteRepositoryUrl, siteShortName } from '~~/shared/constants/site'

const footerLinks = [
  {
    label: 'Repositorio',
    to: siteRepositoryUrl,
    icon: 'i-lucide-folder-git-2'
  },
  {
    label: 'LinkedIn',
    to: authorSocialProfiles.linkedin,
    icon: 'i-lucide-linkedin'
  },
  {
    label: 'Instagram',
    to: authorSocialProfiles.instagram,
    icon: 'i-lucide-instagram'
  },
  {
    label: 'GitHub',
    to: authorSocialProfiles.github,
    icon: 'i-lucide-github'
  }
]
</script>

<template>
  <footer class="border-default border-t bg-default/72 backdrop-blur-sm" role="contentinfo">
    <div
      class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left"
    >
      <div class="space-y-1 text-sm text-muted">
        <p>
          <span aria-label="Copyright">©</span> {{ new Date().getFullYear() }} {{ siteShortName }}.
        </p>
        <p>
          Desarrollado por Iván Salido Cobo · Código disponible en
          <ULink
            :to="siteRepositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-link"
          >
            GitHub
          </ULink>
          bajo licencia GPL-3.0.
        </p>
      </div>

      <nav
        class="flex flex-wrap items-center justify-center gap-2 md:justify-end"
        aria-label="Enlaces útiles del proyecto y del autor"
      >
        <UButton
          v-for="link in footerLinks"
          :key="link.label"
          :to="link.to"
          target="_blank"
          rel="noopener noreferrer"
          :icon="link.icon"
          variant="ghost"
          color="neutral"
          class="social-icon"
          :aria-label="link.label"
        >
          <span class="hidden sm:inline">{{ link.label }}</span>
        </UButton>
      </nav>
    </div>
  </footer>
</template>
