<template>
  <div class="layout-surface flex min-h-screen flex-col">
    <a
      href="#main-content"
      class="sr-only rounded-lg bg-primary px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
    >
      Saltar al contenido principal
    </a>

    <div class="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
      <AppHeader />
    </div>

    <main id="main-content" class="grow" role="main">
      <div class="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10">
        <slot />
      </div>
    </main>

    <AppFooter />
  </div>
</template>
