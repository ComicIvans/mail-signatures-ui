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
        <UButton
          to="https://www.linkedin.com/in/ivansalidocobo"
          target="_blank"
          rel="noopener noreferrer"
          icon="i-tabler-brand-linkedin"
          variant="ghost"
          color="neutral"
          aria-label="Perfil de LinkedIn de Iván Salido Cobo (se abre en nueva pestaña)"
        />
        <UButton
          to="https://instagram.com/ivansalidocobo"
          target="_blank"
          rel="noopener noreferrer"
          icon="i-tabler-brand-instagram"
          variant="ghost"
          color="neutral"
          aria-label="Perfil de Instagram de Iván Salido Cobo (se abre en nueva pestaña)"
        />
        <UButton
          to="https://github.com/ComicIvans"
          target="_blank"
          rel="noopener noreferrer"
          icon="i-tabler-brand-github"
          variant="ghost"
          color="neutral"
          aria-label="Perfil de GitHub de Iván Salido Cobo (se abre en nueva pestaña)"
        />
      </nav>
    </template>
  </UFooter>
</template>
