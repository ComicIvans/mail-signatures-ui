<script setup lang="ts">
import { useSignatureCatalog } from '~/composables/useSignatureCatalog'

usePageSeo(
  'Inicio',
  'Crea firmas de correo electrónico profesionales y personalizadas. Elige un perfil, completa tus datos y exporta el HTML listo para usar.'
)

const { profiles, optionalFields } = useSignatureCatalog()

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

const marqueeImageWidth = 808
const marqueeImageHeight = 664
const firstSignatureName = signatures[0]?.name ?? ''

const marqueeTrack = ref<HTMLElement | null>(null)

const marqueeDeceleration = 0.24
const marqueeAcceleration = 0.18
const marqueeStopThreshold = 0.06

let marqueeAnimation: Animation | null = null
let marqueeFrame = 0
let currentPlaybackRate = 1
let targetPlaybackRate = 1
let reduceMotionQuery: MediaQueryList | null = null

const summary = computed(() => [
  {
    title: 'Perfiles disponibles',
    value: String(profiles.value.length),
    description: 'Organizaciones listas para usar desde el primer momento.'
  },
  {
    title: 'Plantillas',
    value: String(new Set(profiles.value.map((profile) => profile.template)).size),
    description: 'Variantes de firma ya preparadas para distintos estilos.'
  },
  {
    title: 'Campos opcionales',
    value: String(optionalFields.length),
    description: 'Datos adicionales que puedes activar solo cuando aportan valor.'
  }
])

function cancelMarqueeFrame() {
  if (!marqueeFrame) {
    return
  }

  cancelAnimationFrame(marqueeFrame)
  marqueeFrame = 0
}

function setMarqueePlaybackRate(nextPlaybackRate: number) {
  if (!marqueeAnimation) {
    return
  }

  if (targetPlaybackRate === 0 && nextPlaybackRate <= marqueeStopThreshold) {
    currentPlaybackRate = 0
    marqueeAnimation.pause()
    return
  }

  if (marqueeAnimation.playState === 'paused') {
    marqueeAnimation.play()
  }

  currentPlaybackRate = nextPlaybackRate
  marqueeAnimation.playbackRate = nextPlaybackRate
}

function updateMarqueePlaybackRate() {
  if (!marqueeAnimation) {
    marqueeFrame = 0
    return
  }

  const easing =
    targetPlaybackRate < currentPlaybackRate ? marqueeDeceleration : marqueeAcceleration
  const nextPlaybackRate = currentPlaybackRate + (targetPlaybackRate - currentPlaybackRate) * easing

  if (Math.abs(targetPlaybackRate - nextPlaybackRate) <= 0.01) {
    if (targetPlaybackRate === 0) {
      currentPlaybackRate = 0
      marqueeAnimation.pause()
    } else {
      if (marqueeAnimation.playState === 'paused') {
        marqueeAnimation.play()
      }

      currentPlaybackRate = targetPlaybackRate
      marqueeAnimation.playbackRate = targetPlaybackRate
    }

    marqueeFrame = 0
    return
  }

  setMarqueePlaybackRate(nextPlaybackRate)
  marqueeFrame = requestAnimationFrame(updateMarqueePlaybackRate)
}

function transitionMarqueePlaybackRate(nextPlaybackRate: number) {
  targetPlaybackRate = nextPlaybackRate

  if (!marqueeAnimation) {
    return
  }

  if (nextPlaybackRate > 0 && marqueeAnimation.playState === 'paused') {
    marqueeAnimation.play()
    marqueeAnimation.playbackRate = Math.max(currentPlaybackRate, marqueeStopThreshold)
  }

  if (!marqueeFrame) {
    marqueeFrame = requestAnimationFrame(updateMarqueePlaybackRate)
  }
}

function resolveMarqueeAnimation() {
  if (!marqueeTrack.value || reduceMotionQuery?.matches) {
    marqueeAnimation = null
    return
  }

  marqueeAnimation =
    marqueeTrack.value.getAnimations().find((animation) => animation instanceof CSSAnimation) ??
    null

  if (!marqueeAnimation) {
    requestAnimationFrame(resolveMarqueeAnimation)
    return
  }

  currentPlaybackRate = 1
  targetPlaybackRate = 1
  marqueeAnimation.playbackRate = 1
}

function handleMarqueePointerEnter() {
  transitionMarqueePlaybackRate(0)
}

function handleMarqueePointerLeave() {
  transitionMarqueePlaybackRate(1)
}

function handleReducedMotionChange(event: MediaQueryListEvent) {
  cancelMarqueeFrame()

  if (event.matches) {
    marqueeAnimation = null
    currentPlaybackRate = 1
    targetPlaybackRate = 1
    return
  }

  requestAnimationFrame(resolveMarqueeAnimation)
}

onMounted(() => {
  reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotionQuery.addEventListener('change', handleReducedMotionChange)

  if (reduceMotionQuery.matches) {
    return
  }

  requestAnimationFrame(resolveMarqueeAnimation)
})

onBeforeUnmount(() => {
  cancelMarqueeFrame()
  reduceMotionQuery?.removeEventListener('change', handleReducedMotionChange)
})
</script>

<template>
  <section class="py-8">
    <UPageHero
      title="Generador de firmas para el correo"
      description="Genera firmas HTML para distintas organizaciones, personaliza los datos de cada usuario y exporta el resultado para copiarlo o descargarlo."
      :links="links"
      class="page-section-strong px-2"
    >
      <div
        class="relative overflow-hidden py-4"
        role="region"
        aria-label="Galería de ejemplos de firmas de correo"
        @pointerenter="handleMarqueePointerEnter"
        @pointerleave="handleMarqueePointerLeave"
      >
        <div
          class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-default to-transparent"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-default to-transparent"
        />

        <div ref="marqueeTrack" class="flex animate-marquee w-max gap-6">
          <div v-for="n in 2" :key="n" class="flex shrink-0 gap-6">
            <figure
              v-for="signature in signatures"
              :key="`${n}-${signature.name}`"
              class="shrink-0"
            >
              <img
                :src="signature.src"
                :alt="`Ejemplo de firma de correo para ${signature.name}`"
                :loading="n === 1 && signature.name === firstSignatureName ? 'eager' : 'lazy'"
                :fetchpriority="n === 1 && signature.name === firstSignatureName ? 'high' : 'auto'"
                :width="marqueeImageWidth"
                :height="marqueeImageHeight"
                class="h-56 w-auto rounded-lg shadow-xl ring ring-default"
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

    <div class="mt-8 grid gap-4 md:grid-cols-3">
      <UCard v-for="item in summary" :key="item.title">
        <p class="text-sm text-muted">{{ item.title }}</p>
        <p class="mt-2 text-3xl font-semibold text-highlighted">{{ item.value }}</p>
        <p class="mt-2 text-sm text-muted">
          {{ item.description }}
        </p>
      </UCard>
    </div>
  </section>
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
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
</style>
