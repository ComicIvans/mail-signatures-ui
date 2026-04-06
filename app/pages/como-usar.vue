<script setup lang="ts">
usePageSeo(
  'Cómo usar las firmas',
  'Aprende a configurar tu firma de correo electrónico en Thunderbird, Gmail y Webmail paso a paso.'
)

const selectedClient = ref('thunderbird')

const clientTabs = [
  { label: 'Thunderbird', value: 'thunderbird', icon: 'i-simple-icons-thunderbird' },
  { label: 'Gmail', value: 'gmail', icon: 'i-simple-icons-gmail' },
  { label: 'Webmail', value: 'webmail', icon: 'i-tabler-world' }
]

const compatibility = [
  { client: 'Webmail', status: 'success', label: 'Funciona correctamente' },
  { client: 'Thunderbird', status: 'success', label: 'Funciona correctamente' },
  { client: 'Thunderbird móvil', status: 'success', label: 'Funciona correctamente' },
  { client: 'Outlook web', status: 'warning', label: 'Funciona con pequeños fallos' },
  { client: 'Outlook móvil', status: 'warning', label: 'Funciona con pequeños fallos' },
  { client: 'Gmail web', status: 'warning', label: 'Funciona con pequeños fallos' },
  { client: 'Gmail móvil', status: 'warning', label: 'Funciona con pequeños fallos' },
  { client: 'Canary Mail', status: 'error', label: 'No funciona correctamente' }
]

const examples = [
  {
    id: 'defc',
    name: 'DEFC',
    fullName: 'Delegación de Estudiantes de la Facultad de Ciencias',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/defc.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/defc-no-icons.png',
    imageLoadedWidth: 520,
    imageLoadedHeight: 380,
    imageNoIconsWidth: 520,
    imageNoIconsHeight: 380
  },
  {
    id: 'dge',
    name: 'DGE',
    fullName: 'Delegación General de Estudiantes',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/dge.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/dge-no-icons.png',
    imageLoadedWidth: 500,
    imageLoadedHeight: 420,
    imageNoIconsWidth: 500,
    imageNoIconsHeight: 380
  },
  {
    id: 'amat',
    name: 'AMAT',
    fullName: 'Asociación de Estudiantes de Matemáticas y Estadística de la UGR',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/amat.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/amat-no-icons.png',
    imageLoadedWidth: 500,
    imageLoadedHeight: 380,
    imageNoIconsWidth: 500,
    imageNoIconsHeight: 380
  },
  {
    id: 'creup',
    name: 'CREUP',
    fullName: 'Coordinadora de Representantes de Estudiantes de Universidades Públicas',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/creup.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/creup-no-icons.png',
    imageLoadedWidth: 500,
    imageLoadedHeight: 380,
    imageNoIconsWidth: 500,
    imageNoIconsHeight: 380
  },
  {
    id: 'enem',
    name: 'ENEM',
    fullName: 'XXVI Encuentro Nacional de Estudiantes de Matemáticas',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem-no-icons.png',
    imageLoadedWidth: 500,
    imageLoadedHeight: 380,
    imageNoIconsWidth: 500,
    imageNoIconsHeight: 380
  }
]

const exampleAccordionItems = computed(() =>
  examples.map((example) => ({
    label: `${example.name} - ${example.fullName}`,
    value: example.id,
    fullName: example.fullName,
    imageLoaded: example.imageLoaded,
    imageNoIcons: example.imageNoIcons,
    imageLoadedWidth: example.imageLoadedWidth,
    imageLoadedHeight: example.imageLoadedHeight,
    imageNoIconsWidth: example.imageNoIconsWidth,
    imageNoIconsHeight: example.imageNoIconsHeight
  }))
)
</script>

<template>
  <UPage class="py-8">
    <UPageHeader
      title="Cómo usar las firmas"
      description="Guía para configurar la firma en los principales clientes de correo y revisar la compatibilidad conocida."
    />

    <UPageBody class="space-y-8">
      <UAlert
        icon="i-tabler-alert-triangle"
        color="warning"
        title="Nota importante"
        description="Estas instrucciones se revisaron por última vez en febrero de 2025. Algunas interfaces pueden haber cambiado ligeramente."
      />

      <section aria-labelledby="instructions-title" class="space-y-4">
        <div>
          <h2 id="instructions-title" class="text-2xl font-semibold text-highlighted">
            Instrucciones por cliente
          </h2>
          <p class="mt-2 text-muted">
            Selecciona el cliente de correo y sigue los pasos concretos para importar la firma.
          </p>
        </div>

        <UCard>
          <UTabs
            v-model="selectedClient"
            :items="clientTabs"
            class="w-full"
            :ui="{ list: 'grid grid-cols-3' }"
          >
            <template #content="{ item }">
              <div v-if="item.value === 'thunderbird'" class="space-y-4 p-4">
                <ol class="list-decimal list-inside space-y-3 text-default">
                  <li>Abre Thunderbird y ve a la <strong>configuración de la cuenta</strong>.</li>
                  <li>Marca la casilla <strong>«Utilizar un archivo como firma»</strong>.</li>
                  <li>Selecciona el <strong>archivo de firma descargado</strong> (.html).</li>
                  <li>Guarda los cambios.</li>
                </ol>

                <figure>
                  <img
                    src="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/thunderbird.png"
                    alt="Ventana de configuración de cuenta en Thunderbird mostrando la opción de firma con archivo HTML"
                    width="770"
                    height="754"
                    loading="eager"
                    fetchpriority="high"
                    class="mx-auto rounded-lg ring ring-default"
                    decoding="async"
                  />
                  <figcaption class="mt-2 text-sm text-muted">
                    Configuración de firma en Thunderbird
                  </figcaption>
                </figure>
              </div>

              <div v-else-if="item.value === 'gmail'" class="space-y-4 p-4">
                <ol class="list-decimal list-inside space-y-3 text-default">
                  <li>Abre el archivo HTML de la firma en tu navegador.</li>
                  <li>
                    Selecciona todo el contenido con <UKbd>Ctrl</UKbd> + <UKbd>A</UKbd> y cópialo
                    con <UKbd>Ctrl</UKbd> + <UKbd>C</UKbd>.
                  </li>
                  <li>
                    En Gmail, ve a <strong>Ajustes</strong> →
                    <strong>Ver todos los ajustes</strong>.
                  </li>
                  <li>
                    En la pestaña <strong>«General»</strong>, busca el apartado
                    <strong>«Firma»</strong>.
                  </li>
                  <li>
                    Crea una <strong>firma nueva</strong> y pega el contenido con
                    <UKbd>Ctrl</UKbd> + <UKbd>V</UKbd>.
                  </li>
                  <li>Asigna esa firma como predeterminada para nuevos mensajes y respuestas.</li>
                  <li>Guarda los cambios desde el final de la página.</li>
                </ol>

                <figure>
                  <img
                    src="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/gmail.png"
                    alt="Ajustes de Gmail mostrando la configuración de firma y valores predeterminados"
                    width="1786"
                    height="786"
                    class="mx-auto rounded-lg ring ring-default"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption class="mt-2 text-sm text-muted">
                    Configuración de firma en Gmail
                  </figcaption>
                </figure>
              </div>

              <div v-else-if="item.value === 'webmail'" class="space-y-4 p-4">
                <ol class="list-decimal list-inside space-y-3 text-default">
                  <li>Abre el archivo HTML de la firma con un editor de texto.</li>
                  <li>
                    Copia solo el contenido dentro de
                    <UBadge color="neutral" variant="subtle">
                      <code>&lt;div&gt;...&lt;/div&gt;</code>
                    </UBadge>
                    sin incluir el resto del documento.
                  </li>
                  <li>
                    En Webmail, ve a <strong>Configuración</strong> → <strong>Identidades</strong>.
                  </li>
                  <li>
                    Pulsa el botón
                    <UBadge color="neutral" variant="subtle"><code>&lt; &gt;</code></UBadge>
                    para editar la firma como HTML.
                  </li>
                  <li>Pega el código sustituyendo el contenido anterior y guarda los cambios.</li>
                </ol>

                <UAlert
                  icon="i-tabler-bulb"
                  color="info"
                  variant="soft"
                  title="Por qué copiar solo el div"
                  description="Si pegas el documento HTML completo, algunos webmail añaden un espacio inicial difícil de corregir después."
                />

                <figure>
                  <img
                    src="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/webmail.png"
                    alt="Ventana de configuración de identidades en Webmail con el editor HTML de firma"
                    width="1916"
                    height="959"
                    class="mx-auto rounded-lg ring ring-default"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption class="mt-2 text-sm text-muted">
                    Configuración de firma en Webmail
                  </figcaption>
                </figure>
              </div>
            </template>
          </UTabs>
        </UCard>
      </section>

      <section aria-labelledby="compatibility-title" class="space-y-4">
        <div>
          <h2 id="compatibility-title" class="text-2xl font-semibold text-highlighted">
            Compatibilidad conocida
          </h2>
          <p class="mt-2 text-muted">
            Las firmas HTML pueden verse de forma distinta según el cliente de correo.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <UCard v-for="item in compatibility" :key="item.client">
            <div class="flex items-start gap-3">
              <UIcon
                :name="
                  item.status === 'success'
                    ? 'i-tabler-circle-check-filled'
                    : item.status === 'warning'
                      ? 'i-tabler-alert-circle-filled'
                      : 'i-tabler-circle-x-filled'
                "
                :class="[
                  'mt-0.5 size-5 shrink-0',
                  item.status === 'success'
                    ? 'text-success'
                    : item.status === 'warning'
                      ? 'text-warning'
                      : 'text-error'
                ]"
              />
              <div>
                <p class="font-medium text-default">{{ item.client }}</p>
                <p class="text-sm text-muted">{{ item.label }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </section>

      <section aria-labelledby="examples-title" class="space-y-4">
        <div>
          <h2 id="examples-title" class="text-2xl font-semibold text-highlighted">
            Ejemplos de firmas
          </h2>
          <p class="mt-2 text-muted">
            Cada ejemplo se muestra con iconos cargados y sin cargar para anticipar ambos
            escenarios.
          </p>
        </div>

        <UAccordion :items="exampleAccordionItems">
          <template #body="{ item }">
            <div class="grid gap-6 p-4 md:grid-cols-2">
              <figure>
                <figcaption class="mb-2 text-sm font-medium text-default">
                  <UIcon name="i-tabler-photo" class="inline size-4" />
                  Con iconos cargados
                </figcaption>
                <img
                  :src="item.imageLoaded"
                  :alt="`Firma de ejemplo de ${item.fullName} con los iconos cargados correctamente`"
                  :width="item.imageLoadedWidth"
                  :height="item.imageLoadedHeight"
                  class="mx-auto rounded-lg ring ring-default"
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              <figure>
                <figcaption class="mb-2 text-sm font-medium text-default">
                  <UIcon name="i-tabler-photo-off" class="inline size-4" />
                  Sin iconos (texto alternativo)
                </figcaption>
                <img
                  :src="item.imageNoIcons"
                  :alt="`Firma de ejemplo de ${item.fullName} mostrando el texto alternativo cuando los iconos no cargan`"
                  :width="item.imageNoIconsWidth"
                  :height="item.imageNoIconsHeight"
                  class="mx-auto rounded-lg ring ring-default"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </template>
        </UAccordion>
      </section>
    </UPageBody>
  </UPage>
</template>
