<script setup lang="ts">
useSeoMeta({
  title: 'Cómo usar las firmas',
  description:
    'Aprende a configurar tu firma de correo electrónico en Thunderbird, Gmail y Webmail paso a paso.'
})

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
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/defc-no-icons.png'
  },
  {
    id: 'dge',
    name: 'DGE',
    fullName: 'Delegación General de Estudiantes',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/dge.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/dge-no-icons.png'
  },
  {
    id: 'amat',
    name: 'AMAT',
    fullName: 'Asociación de Estudiantes de Matemáticas y Estadística de la UGR',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/amat.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/amat-no-icons.png'
  },
  {
    id: 'creup',
    name: 'CREUP',
    fullName: 'Coordinadora de Representantes de Estudiantes de Universidades Públicas',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/creup.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/creup-no-icons.png'
  },
  {
    id: 'enem',
    name: 'ENEM',
    fullName: 'XXVI Encuentro Nacional de Estudiantes de Matemáticas',
    imageLoaded: 'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png',
    imageNoIcons:
      'https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem-no-icons.png'
  }
]
</script>

<template>
  <UPage>
    <UPageHeader
      title="Cómo usar las firmas"
      description="Guía para configurar tu firma de correo electrónico en los principales clientes de correo."
    />

    <UPageBody>
      <!-- Instrucciones por cliente -->
      <section aria-labelledby="instructions-title" class="mb-12">
        <h2 id="instructions-title" class="text-2xl font-bold mb-6">
          Instrucciones por cliente de correo
        </h2>

        <UAlert
          icon="i-tabler-alert-triangle"
          color="warning"
          title="Nota importante"
          description="Estas instrucciones se revisaron por última vez en febrero de 2025. Es posible que las interfaces hayan cambiado desde entonces."
          class="mb-6"
        />

        <UTabs
          v-model="selectedClient"
          :items="clientTabs"
          class="w-full"
          :ui="{ list: 'grid grid-cols-3' }"
        >
          <template #content="{ item }">
            <!-- Thunderbird -->
            <div v-if="item.value === 'thunderbird'" class="p-4 space-y-4">
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
                  class="rounded-lg ring ring-default mx-auto"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption class="text-sm text-muted mt-2">
                  Configuración de firma en Thunderbird
                </figcaption>
              </figure>
            </div>

            <!-- Gmail -->
            <div v-else-if="item.value === 'gmail'" class="p-4 space-y-4">
              <ol class="list-decimal list-inside space-y-3 text-default">
                <li>Abre el archivo HTML de la firma en tu navegador.</li>
                <li>
                  Selecciona todo el contenido con <UKbd>Ctrl</UKbd> + <UKbd>A</UKbd> y cópialo con
                  <UKbd>Ctrl</UKbd> + <UKbd>C</UKbd>.
                </li>
                <li>
                  En Gmail, ve a <strong>Ajustes</strong> → <strong>Ver todos los ajustes</strong>.
                </li>
                <li>
                  En la pestaña <strong>«General»</strong>, busca el apartado
                  <strong>«Firma»</strong>.
                </li>
                <li>
                  Crea una <strong>firma nueva</strong> y pega el contenido con <UKbd>Ctrl</UKbd> +
                  <UKbd>V</UKbd>.
                </li>
                <li>
                  Configura los <strong>«Valores predeterminados de firma»</strong> para que se use
                  automáticamente.
                </li>
                <li>Guarda los cambios con el botón del final de la página.</li>
              </ol>

              <figure>
                <img
                  src="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/gmail.png"
                  alt="Ajustes de Gmail mostrando la configuración de firma y valores predeterminados"
                  class="rounded-lg ring ring-default mx-auto"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption class="text-sm text-muted mt-2">
                  Configuración de firma en Gmail
                </figcaption>
              </figure>
            </div>

            <!-- Webmail -->
            <div v-else-if="item.value === 'webmail'" class="p-4 space-y-4">
              <ol class="list-decimal list-inside space-y-3 text-default">
                <li>Abre el archivo HTML de la firma con un editor de texto.</li>
                <li>
                  Copia <strong>únicamente</strong> el contenido dentro de
                  <UBadge color="neutral" variant="subtle"
                    ><code>&lt;div&gt;...&lt;/div&gt;</code></UBadge
                  >
                  (sin incluir el resto del HTML).
                </li>
                <li>
                  En Webmail, ve a <strong>Configuración</strong> → <strong>Identidades</strong>.
                </li>
                <li>
                  Pulsa el botón
                  <UBadge color="neutral" variant="subtle"><code>&lt; &gt;</code></UBadge>
                  para editar la firma como HTML.
                </li>
                <li>
                  Pega el código copiado, <strong>sustituyendo</strong> todo lo que hubiera antes.
                </li>
                <li>Guarda los cambios.</li>
              </ol>

              <UAlert
                icon="i-tabler-bulb"
                color="info"
                title="¿Por qué copiar solo el div?"
                description="Si pegas todo el contenido del archivo HTML, se añade un espacio en blanco al principio de la firma que es molesto eliminar manualmente."
              />

              <figure>
                <img
                  src="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/webmail.png"
                  alt="Ventana de configuración de identidades en Webmail con el editor HTML de firma"
                  class="rounded-lg ring ring-default mx-auto"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption class="text-sm text-muted mt-2">
                  Configuración de firma en Webmail
                </figcaption>
              </figure>
            </div>
          </template>
        </UTabs>
      </section>

      <!-- Compatibilidad -->
      <section aria-labelledby="compatibility-title" class="mb-12">
        <h2 id="compatibility-title" class="text-2xl font-bold mb-6">
          Compatibilidad con clientes de correo
        </h2>

        <p class="text-muted mb-4">
          Las firmas HTML pueden verse de forma diferente según el cliente de correo. Esta es la
          compatibilidad conocida:
        </p>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <UCard v-for="item in compatibility" :key="item.client" class="text-center">
            <div class="flex flex-col items-center gap-2">
              <UIcon
                :name="
                  item.status === 'success'
                    ? 'i-tabler-circle-check-filled'
                    : item.status === 'warning'
                      ? 'i-tabler-alert-circle-filled'
                      : 'i-tabler-circle-x-filled'
                "
                :class="[
                  'size-8',
                  item.status === 'success'
                    ? 'text-success'
                    : item.status === 'warning'
                      ? 'text-warning'
                      : 'text-error'
                ]"
              />
              <span class="font-medium">{{ item.client }}</span>
              <span class="text-sm text-muted">{{ item.label }}</span>
            </div>
          </UCard>
        </div>
      </section>

      <!-- Ejemplos de firmas -->
      <section aria-labelledby="examples-title">
        <h2 id="examples-title" class="text-2xl font-bold mb-6">Ejemplos de firmas</h2>

        <p class="text-muted mb-6">
          A continuación puedes ver cómo se deberían ver las firmas en distintas organizaciones.
          Cada firma se muestra con los iconos cargados y sin cargar, ya que algunos clientes de
          correo pueden no mostrar las imágenes.
        </p>

        <UAccordion
          :items="
            examples.map((ex) => ({
              label: `${ex.name} - ${ex.fullName}`,
              value: ex.id,
              content: ex.id
            }))
          "
        >
          <template #body="{ item }">
            <div class="grid gap-6 md:grid-cols-2 p-4">
              <figure>
                <figcaption class="text-sm font-medium mb-2 text-default">
                  <UIcon name="i-tabler-photo" class="size-4 inline" />
                  Con iconos cargados
                </figcaption>
                <img
                  :src="examples.find((e) => e.id === item.content)?.imageLoaded"
                  :alt="`Firma de ejemplo de ${examples.find((e) => e.id === item.content)?.fullName} con los iconos cargados correctamente`"
                  class="rounded-lg ring ring-default mx-auto"
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              <figure>
                <figcaption class="text-sm font-medium mb-2 text-default">
                  <UIcon name="i-tabler-photo-off" class="size-4 inline" />
                  Sin iconos (texto alternativo)
                </figcaption>
                <img
                  :src="examples.find((e) => e.id === item.content)?.imageNoIcons"
                  :alt="`Firma de ejemplo de ${examples.find((e) => e.id === item.content)?.fullName} mostrando el texto alternativo cuando los iconos no cargan`"
                  class="rounded-lg ring ring-default mx-auto"
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
