<template>
  <UFooter role="contentinfo">
    <template #left>
      <div class="text-center sm:text-left">
        <p class="text-muted text-sm">
          <span aria-label="Copyright">©</span> {{ new Date().getFullYear() }} Generador de firmas
        </p>
        <p class="text-muted text-sm">
          Desarrollado por Iván Salido Cobo · Distribuido bajo licencia
          <ULink
            to="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Licencia GPL-3.0 (se abre en nueva pestaña)"
          >
            GPL-3.0 <span class="sr-only">(se abre en nueva pestaña)</span> </ULink
          >.
        </p>
      </div>
    </template>

    <template #right>
      <nav class="flex items-center gap-2" aria-label="Enlaces a redes sociales del autor">
        <UTooltip text="LinkedIn">
          <UButton
            to="https://www.linkedin.com/in/ivansalidocobo"
            target="_blank"
            rel="noopener noreferrer"
            icon="i-lucide-linkedin"
            variant="ghost"
            color="neutral"
            aria-label="LinkedIn"
          />
        </UTooltip>
        <UTooltip text="Instagram">
          <UButton
            to="https://instagram.com/ivansalidocobo"
            target="_blank"
            rel="noopener noreferrer"
            icon="i-lucide-instagram"
            variant="ghost"
            color="neutral"
            aria-label="Instagram"
          />
        </UTooltip>
        <UTooltip text="GitHub">
          <UButton
            to="https://github.com/ComicIvans"
            target="_blank"
            rel="noopener noreferrer"
            icon="i-lucide-github"
            variant="ghost"
            color="neutral"
            aria-label="GitHub"
          />
        </UTooltip>
      </nav>
    </template>
  </UFooter>
</template>
