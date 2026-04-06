<script setup lang="ts">
import type { AcceptableValue, SelectItem } from '@nuxt/ui'
import {
  type OrganizationConfig,
  type SignatureField,
  type SignaturePreviewMode,
  type UserSignatureData,
  UserSignatureDataSchema
} from '~/types/signature'
import {
  createEmptyUserSignatureData,
  useSignatureCatalog
} from '~/composables/useSignatureCatalog'
import { useSignatureGenerator } from '~/composables/useSignatureGenerator'

usePageSeo(
  'Generador',
  'Genera tu firma de correo personalizada, selecciona el perfil de organización y exporta el HTML listo para usar.'
)

const { profiles, requiredFields, optionalFields } = useSignatureCatalog()
const { generateHtml, copyToClipboard, downloadHtml, downloadPreviewJpg } = useSignatureGenerator()

interface ProfileOption {
  id: string
  organization: string
  label: string
  value: string
}

interface PersistedGeneratorState {
  version: 1
  selectedProfileId: string
  selectedPreviewMode: SignaturePreviewMode
  enabledOptionalFields: string[]
  userData: UserSignatureData
}

const GENERATOR_STORAGE_KEY = 'mail-signatures:generator-state:v1'
const PERSIST_DEBOUNCE_MS = 250

const profileOptions = computed<ProfileOption[]>(() =>
  profiles.value.map((profile) => ({
    id: profile.id,
    organization: profile.organization,
    label: `${profile.id} - ${profile.organization}`,
    value: profile.id
  }))
)

const selectedProfileId = ref(profiles.value[0]?.id || '')
const selectedProfile = computed<OrganizationConfig | undefined>(() =>
  profiles.value.find((profile) => profile.id === selectedProfileId.value)
)

const isProfileModalOpen = ref(false)
const existingProfileIds = computed(() => profiles.value.map((profile) => profile.id))

function handleProfileSave(updatedProfile: OrganizationConfig, originalId: string) {
  const index = profiles.value.findIndex((profile) => profile.id === originalId)

  if (index === -1) return

  profiles.value[index] = updatedProfile

  if (selectedProfileId.value === originalId && originalId !== updatedProfile.id) {
    selectedProfileId.value = updatedProfile.id
  }
}

const selectedPreviewMode = ref<SignaturePreviewMode>('images')
const userData = reactive<UserSignatureData>(createEmptyUserSignatureData())

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function restoreGeneratorState(): void {
  if (!import.meta.client) {
    return
  }

  const rawState = window.sessionStorage.getItem(GENERATOR_STORAGE_KEY)

  if (!rawState) {
    return
  }

  try {
    const parsed = JSON.parse(rawState) as PersistedGeneratorState

    if (!parsed || parsed.version !== 1) {
      return
    }

    if (typeof parsed.selectedProfileId === 'string') {
      const hasProfile = profiles.value.some((profile) => profile.id === parsed.selectedProfileId)

      if (hasProfile) {
        selectedProfileId.value = parsed.selectedProfileId
      }
    }

    if (parsed.selectedPreviewMode === 'images' || parsed.selectedPreviewMode === 'alt') {
      selectedPreviewMode.value = parsed.selectedPreviewMode
    }

    const optionalFieldIds = new Set(optionalFields.map((field) => field.id))

    if (Array.isArray(parsed.enabledOptionalFields)) {
      enabledOptionalFields.value = new Set(
        parsed.enabledOptionalFields.filter((fieldId) => optionalFieldIds.has(fieldId))
      )
    }

    const fallbackUserData = createEmptyUserSignatureData()
    const restoredUserData: Record<string, unknown> = isRecord(parsed.userData)
      ? parsed.userData
      : {}
    const mergedUserData: UserSignatureData = {
      ...fallbackUserData,
      ...(restoredUserData as Partial<UserSignatureData>)
    }

    const restoredNameImage = isRecord(restoredUserData.name_image)
      ? restoredUserData.name_image
      : {}

    mergedUserData.name_image = {
      ...fallbackUserData.name_image,
      ...(restoredNameImage as NonNullable<UserSignatureData['name_image']>)
    }

    Object.assign(userData, mergedUserData)
  } catch {
    window.sessionStorage.removeItem(GENERATOR_STORAGE_KEY)
  }
}

function persistGeneratorState(): void {
  if (!import.meta.client) {
    return
  }

  const payload: PersistedGeneratorState = {
    version: 1,
    selectedProfileId: selectedProfileId.value,
    selectedPreviewMode: selectedPreviewMode.value,
    enabledOptionalFields: Array.from(enabledOptionalFields.value),
    userData: {
      ...userData,
      name_image: {
        image: userData.name_image?.image ?? '',
        alt: userData.name_image?.alt ?? '',
        description: userData.name_image?.description ?? '',
        url: userData.name_image?.url ?? ''
      }
    }
  }

  window.sessionStorage.setItem(GENERATOR_STORAGE_KEY, JSON.stringify(payload))
}

let persistTimeoutId: number | undefined

function schedulePersistGeneratorState(): void {
  if (!import.meta.client) {
    return
  }

  if (persistTimeoutId !== undefined) {
    window.clearTimeout(persistTimeoutId)
  }

  persistTimeoutId = window.setTimeout(() => {
    persistGeneratorState()
    persistTimeoutId = undefined
  }, PERSIST_DEBOUNCE_MS)
}

function flushPersistGeneratorState(): void {
  if (!import.meta.client) {
    return
  }

  if (persistTimeoutId !== undefined) {
    window.clearTimeout(persistTimeoutId)
    persistTimeoutId = undefined
  }

  persistGeneratorState()
}

function getFieldValue(fieldId: string): string {
  const value = (userData as Record<string, unknown>)[fieldId]

  if (typeof value === 'number') {
    return String(value)
  }

  return (value as string) || ''
}

function setFieldValue(fieldId: string, value: string): void {
  if (fieldId === 'max_width') {
    ;(userData as Record<string, unknown>)[fieldId] = value ? Number(value) : undefined
    return
  }

  ;(userData as Record<string, unknown>)[fieldId] = value
}

const enabledOptionalFields = ref<Set<string>>(new Set())

const availableOptionalFields = computed<SelectItem[]>(() =>
  optionalFields
    .filter((field) => !enabledOptionalFields.value.has(field.id))
    .map((field) => ({
      label: field.label,
      value: field.id,
      icon: field.icon
    }))
)

const selectedOptionalFieldToAdd = ref<string | undefined>(undefined)

function addOptionalField(fieldId: AcceptableValue | undefined) {
  if (!fieldId || typeof fieldId !== 'string') return

  enabledOptionalFields.value.add(fieldId)

  const field = optionalFields.find((item) => item.id === fieldId)
  if (field?.defaultFromProfile && selectedProfile.value) {
    const profileValue = selectedProfile.value[field.defaultFromProfile as keyof OrganizationConfig]

    if (profileValue !== undefined) {
      if (fieldId === 'name_image' && typeof profileValue === 'object') {
        const profileNameImage = profileValue as {
          image: string
          alt?: string
          description?: string
          url?: string
        }

        userData.name_image = {
          image: profileNameImage.image,
          alt: profileNameImage.alt || '',
          description: profileNameImage.description || '',
          url: profileNameImage.url || ''
        }
      } else {
        ;(userData as Record<string, unknown>)[fieldId] = profileValue
      }
    }
  }

  nextTick(() => {
    selectedOptionalFieldToAdd.value = undefined
  })
}

function removeOptionalField(fieldId: string) {
  enabledOptionalFields.value.delete(fieldId)

  if (fieldId === 'name_image') {
    userData.name_image = {
      image: '',
      alt: '',
      description: '',
      url: ''
    }
    return
  }

  if (fieldId === 'max_width') {
    ;(userData as Record<string, unknown>)[fieldId] = undefined
    return
  }

  ;(userData as Record<string, unknown>)[fieldId] = ''
}

const enabledOptionalFieldsList = computed<SignatureField[]>(() =>
  optionalFields.filter((field) => enabledOptionalFields.value.has(field.id))
)

const previewCaptureContainer = ref<HTMLElement | null>(null)

const validationErrors = ref<Record<string, string>>({})

function getValidationErrors(data: UserSignatureData): Record<string, string> {
  const result = UserSignatureDataSchema.safeParse(data)

  if (result.success) {
    return {}
  }

  const errors: Record<string, string> = {}

  for (const issue of result.error.issues) {
    errors[issue.path.join('.')] = issue.message
  }

  return errors
}

function validateUserData(data: UserSignatureData): boolean {
  const result = UserSignatureDataSchema.safeParse(data)

  if (result.success) {
    validationErrors.value = {}
    return true
  }

  const errors: Record<string, string> = {}

  for (const issue of result.error.issues) {
    errors[issue.path.join('.')] = issue.message
  }

  validationErrors.value = errors

  const firstErrorField = result.error.issues[0]?.path[0]
  if (firstErrorField) {
    nextTick(() => {
      const element = document.getElementById(`field-${String(firstErrorField)}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const input = element?.querySelector('input')
      input?.focus()
    })
  }

  return false
}

watch(
  userData,
  () => {
    if (Object.keys(validationErrors.value).length === 0) {
      return
    }

    validationErrors.value = getValidationErrors(userData)
  },
  { deep: true }
)

watch(userData, schedulePersistGeneratorState, { deep: true })

watch([selectedProfileId, selectedPreviewMode], schedulePersistGeneratorState)

watch(() => Array.from(enabledOptionalFields.value), schedulePersistGeneratorState, { deep: false })

function handleCopyHtml() {
  if (!selectedProfile.value || !validateUserData(userData)) return

  const html = generateHtml(userData, selectedProfile.value, enabledOptionalFields.value)
  copyToClipboard(html)
}

function handleDownload() {
  if (!selectedProfile.value || !validateUserData(userData)) return

  const html = generateHtml(userData, selectedProfile.value, enabledOptionalFields.value)
  downloadHtml(html, selectedProfile.value.id, userData.name, userData.output)
}

async function handleDownloadPreviewJpg() {
  if (!selectedProfile.value || !validateUserData(userData)) return

  await nextTick()
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  })

  const previewElement = previewCaptureContainer.value?.querySelector(
    '.preview-render-root'
  ) as HTMLElement | null

  await downloadPreviewJpg(
    previewElement,
    selectedProfile.value.id,
    userData.name,
    selectedPreviewMode.value,
    userData.output
  )
}

const previewDownloadItems = computed(() => [
  [
    {
      label: 'Descargar JPG',
      icon: 'i-tabler-photo-down',
      disabled: !selectedProfile.value,
      onSelect: () => handleDownloadPreviewJpg()
    }
  ]
])

const previewShowsImages = computed({
  get: () => selectedPreviewMode.value === 'images',
  set: (value: boolean) => {
    selectedPreviewMode.value = value ? 'images' : 'alt'
  }
})

watch(selectedProfileId, () => {
  for (const fieldId of enabledOptionalFields.value) {
    const field = optionalFields.find((item) => item.id === fieldId)

    if (!field?.defaultFromProfile || !selectedProfile.value) {
      continue
    }

    const profileValue = selectedProfile.value[field.defaultFromProfile as keyof OrganizationConfig]
    if (profileValue !== undefined && !(userData as Record<string, unknown>)[fieldId]) {
      ;(userData as Record<string, unknown>)[fieldId] = profileValue
    }
  }
})

onMounted(() => {
  restoreGeneratorState()
})

onBeforeUnmount(() => {
  flushPersistGeneratorState()
})
</script>

<template>
  <UPage class="py-8">
    <UPageHeader
      title="Generador de firmas"
      description="Selecciona un perfil, completa los datos imprescindibles y exporta el HTML listo para usar."
    />

    <UPageBody class="space-y-6">
      <ProfileConfigModal
        v-model:open="isProfileModalOpen"
        :profile="selectedProfile"
        :existing-profile-ids="existingProfileIds"
        @save="handleProfileSave"
      />

      <div
        class="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(26rem,1.16fr)_minmax(0,0.84fr)]"
      >
        <section aria-labelledby="generator-config-heading" class="space-y-6">
          <UCard class="page-section">
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <h2 id="generator-config-heading" class="font-semibold text-highlighted">
                  Configuración
                </h2>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="i-tabler-settings"
                  class="shrink-0"
                  aria-label="Editar perfil seleccionado"
                  :disabled="!selectedProfile"
                  @click="isProfileModalOpen = true"
                >
                  <span class="sm:hidden">Editar</span>
                  <span class="hidden sm:inline">Editar perfil</span>
                </UButton>
              </div>
            </template>

            <div class="space-y-5">
              <UFormField label="Perfil">
                <USelectMenu
                  v-model="selectedProfileId"
                  :items="profileOptions"
                  aria-label="Seleccionar perfil de firma"
                  class="w-full"
                  value-key="value"
                >
                  <template #item="{ item }">
                    <div class="py-1">
                      <span class="font-semibold">{{ (item as ProfileOption).id }}</span>
                      <p class="whitespace-normal text-sm text-muted">
                        {{ (item as ProfileOption).organization }}
                      </p>
                    </div>
                  </template>
                </USelectMenu>
              </UFormField>

              <div class="space-y-4">
                <UFormField
                  v-for="field in requiredFields"
                  :id="`field-${field.id}`"
                  :key="field.id"
                  :label="field.label"
                  :required="field.required"
                  :error="validationErrors[field.id]"
                >
                  <UInput
                    :model-value="getFieldValue(field.id)"
                    :type="field.type"
                    :placeholder="field.placeholder"
                    :icon="field.icon"
                    class="w-full"
                    @update:model-value="setFieldValue(field.id, $event as string)"
                  />
                </UFormField>

                <template v-for="field in enabledOptionalFieldsList" :key="field.id">
                  <div
                    v-if="field.id === 'name_image'"
                    :id="`field-${field.id}`"
                    class="space-y-3 rounded-xl border border-default bg-elevated/30 p-4"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-medium text-muted">{{ field.label }}</span>
                      <UButton
                        color="error"
                        variant="ghost"
                        size="xs"
                        icon="i-tabler-x"
                        :aria-label="`Eliminar campo opcional ${field.label}`"
                        @click="removeOptionalField(field.id)"
                      />
                    </div>

                    <UFormField
                      label="URL de la imagen"
                      :error="validationErrors['name_image.image']"
                    >
                      <UInput
                        v-model="userData.name_image!.image"
                        type="url"
                        placeholder="https://example.com/logo.png"
                        icon="i-tabler-photo"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField
                      label="Alt (texto alternativo)"
                      :error="validationErrors['name_image.alt']"
                    >
                      <UInput
                        v-model="userData.name_image!.alt"
                        placeholder="👤"
                        icon="i-tabler-alt"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField
                      label="Descripción"
                      :error="validationErrors['name_image.description']"
                    >
                      <UInput
                        v-model="userData.name_image!.description"
                        placeholder="Logo de la organización"
                        icon="i-tabler-info-circle"
                        class="w-full"
                      />
                    </UFormField>

                    <UFormField label="Enlace (URL)" :error="validationErrors['name_image.url']">
                      <UInput
                        v-model="userData.name_image!.url"
                        type="url"
                        placeholder="https://example.com"
                        icon="i-tabler-link"
                        class="w-full"
                      />
                    </UFormField>
                  </div>

                  <UFormField
                    v-else
                    :id="`field-${field.id}`"
                    :label="field.label"
                    :error="validationErrors[field.id]"
                  >
                    <UInput
                      :model-value="getFieldValue(field.id)"
                      :type="field.type"
                      :placeholder="field.placeholder"
                      :icon="field.icon"
                      class="w-full"
                      :ui="{ trailing: 'pe-1' }"
                      @update:model-value="setFieldValue(field.id, $event as string)"
                    >
                      <template #trailing>
                        <UButton
                          color="error"
                          variant="ghost"
                          size="xs"
                          icon="i-tabler-x"
                          :aria-label="`Eliminar campo opcional ${field.label}`"
                          @click="removeOptionalField(field.id)"
                        />
                      </template>
                    </UInput>

                    <template v-if="field.id === 'main_font' || field.id === 'name_font'" #hint>
                      <span class="text-xs"
                        >Solo se aplicará si el destinatario la tiene instalada.</span
                      >
                    </template>
                  </UFormField>
                </template>

                <USelect
                  v-if="availableOptionalFields.length > 0"
                  v-model="selectedOptionalFieldToAdd"
                  icon="i-tabler-plus"
                  :items="availableOptionalFields"
                  placeholder="Añadir campo opcional"
                  class="w-full"
                  @update:model-value="addOptionalField"
                />
              </div>
            </div>
          </UCard>
        </section>

        <section aria-labelledby="preview-heading" class="space-y-4 xl:sticky xl:top-6">
          <UCard class="page-section-strong overflow-hidden">
            <template #header>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <h2 id="preview-heading" class="font-semibold text-highlighted">Vista previa</h2>
                  <div
                    class="flex items-center justify-between gap-4 rounded-full border border-default bg-elevated/35 px-4 py-2 lg:min-w-60"
                  >
                    <span class="text-sm text-toned">Cargar imágenes</span>
                    <USwitch
                      v-model="previewShowsImages"
                      aria-label="Mostrar imágenes cargadas en la vista previa"
                    />
                  </div>
                </div>
              </div>
            </template>

            <div
              ref="previewCaptureContainer"
              aria-describedby="preview-description"
              aria-labelledby="preview-heading"
              role="region"
              tabindex="0"
              class="preview-shell min-h-64 max-h-112 overflow-auto rounded-[1.75rem] p-5 text-black sm:min-h-68 sm:p-6 xl:max-h-128"
            >
              <SignaturePreview
                v-if="selectedProfile"
                :user="userData"
                :profile="selectedProfile"
                :enabled-optional-fields="enabledOptionalFields"
                :preview-mode="selectedPreviewMode"
              />
              <p v-else class="text-sm text-neutral-600">
                No hay ningún perfil disponible para generar la firma.
              </p>
            </div>

            <template #footer>
              <div class="flex flex-col gap-3">
                <p class="text-sm text-muted">
                  Copia el HTML si lo vas a pegar en el editor del cliente de correo. Descarga el
                  archivo si tu cliente acepta firmas HTML desde fichero.
                </p>

                <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                    <UButton
                      color="primary"
                      icon="i-tabler-copy"
                      class="w-full justify-center sm:min-w-44 sm:w-auto"
                      :disabled="!selectedProfile"
                      @click="handleCopyHtml"
                    >
                      Copiar HTML
                    </UButton>
                    <UButton
                      color="neutral"
                      variant="outline"
                      icon="i-tabler-download"
                      class="w-full justify-center sm:min-w-48 sm:w-auto"
                      :disabled="!selectedProfile"
                      @click="handleDownload"
                    >
                      Descargar HTML
                    </UButton>
                  </div>

                  <div class="sm:ml-auto">
                    <UDropdownMenu :items="previewDownloadItems">
                      <div class="flex w-full sm:w-auto sm:justify-end">
                        <UButton
                          color="neutral"
                          variant="soft"
                          size="sm"
                          trailing-icon="i-tabler-chevron-down"
                          class="w-full justify-center sm:hidden"
                          :disabled="!selectedProfile"
                        >
                          Más opciones
                        </UButton>

                        <UTooltip text="Más opciones">
                          <UButton
                            color="neutral"
                            variant="ghost"
                            size="sm"
                            icon="i-tabler-dots"
                            class="hidden size-10 justify-center rounded-full sm:inline-flex"
                            aria-label="Más opciones"
                            :disabled="!selectedProfile"
                          />
                        </UTooltip>
                      </div>
                    </UDropdownMenu>
                  </div>
                </div>
              </div>
            </template>
          </UCard>
        </section>
      </div>
    </UPageBody>
  </UPage>
</template>
