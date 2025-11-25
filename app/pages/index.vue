<script setup lang="ts">
useSeoMeta({
  title: 'Inicio',
  description:
    'Crea firmas de correo electrónico profesionales y personalizadas. Elige entre varios diseños y personaliza con los datos de tu organización.'
})

const links = [
  {
    label: 'Empezar a generar',
    to: '/generador'
  },
  {
    label: 'Cómo usarlas',
    to: '/como-usar',
    color: 'neutral' as const,
    variant: 'subtle' as const,
    trailingIcon: 'i-tabler-arrow-narrow-right'
  }
]

const signatures = [
  {
    name: 'DEFC',
    src: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/defc.png'
  },
  {
    name: 'DGE',
    src: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/dge.png'
  },
  {
    name: 'AMAT',
    src: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/amat.png'
  },
  {
    name: 'CREUP',
    src: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/creup.png'
  },
  {
    name: 'ENEM',
    src: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png'
  }
]
</script>

<template>
  <UPageHero
    title="Generador de firmas para el correo"
    description="Esta página permite generar las firmas HTML para el correo electrónico para distintas organizaciones, pudiendo personalizarlas con los datos de cada usuario y elegir entre varios diseños."
    :links="links"
  >
    <div
      class="relative overflow-hidden py-4"
      role="region"
      aria-label="Galería de ejemplos de firmas de correo"
    >
      <!-- Gradientes para difuminar los bordes -->
      <div
        class="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-default to-transparent z-10 pointer-events-none"
      />
      <div
        class="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-default to-transparent z-10 pointer-events-none"
      />

      <!-- Contenedor animado -->
      <div class="flex animate-marquee gap-6 w-max">
        <div v-for="n in 2" :key="n" class="flex gap-6 shrink-0">
          <figure v-for="signature in signatures" :key="`${n}-${signature.name}`" class="shrink-0">
            <img
              :src="signature.src"
              :alt="`Ejemplo de firma de correo para ${signature.name}`"
              class="h-56 w-auto rounded-lg shadow-xl ring ring-default"
              loading="lazy"
              decoding="async"
            />
            <figcaption class="sr-only">
              Firma de correo electrónico de {{ signature.name }}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </UPageHero>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 0.75rem));
  }
}

.animate-marquee {
  animation: marquee 15s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
