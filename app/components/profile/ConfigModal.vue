<script setup lang="ts">
import type { OrganizationConfig } from '~/types/signature'
import { OrganizationConfigSchema } from '~/types/signature'

const props = defineProps<{
  profile: OrganizationConfig | undefined
  existingProfileIds: string[]
}>()

const emit = defineEmits<{
  save: [profile: OrganizationConfig, originalId: string]
}>()

const isOpen = defineModel<boolean>('open', { required: true })

// ============================================
// Editable form state
// ============================================

// Deep clone the profile for editing
const editedProfile = ref<OrganizationConfig | null>(null)
const originalId = ref<string>('')
const validationErrors = ref<Record<string, string>>({})

// Unique ID counter for list items (needed for animations)
let itemIdCounter = 0
const linkIds = ref<number[]>([])
const sponsorIds = ref<number[]>([])
const supporterIds = ref<number[]>([])

function generateIds(count: number): number[] {
  return Array.from({ length: count }, () => ++itemIdCounter)
}

// Track if there are unsaved changes
const hasChanges = computed(() => {
  if (!props.profile || !editedProfile.value) return false
  return JSON.stringify(props.profile) !== JSON.stringify(editedProfile.value)
})

// Check if ID is duplicate (excluding current profile's original ID)
const isIdDuplicate = computed(() => {
  if (!editedProfile.value) return false
  const newId = editedProfile.value.id
  return newId !== originalId.value && props.existingProfileIds.some((id) => id === newId)
})

// Initialize edited profile when modal opens or profile changes
watch(
  () => [isOpen.value, props.profile],
  () => {
    if (isOpen.value && props.profile) {
      editedProfile.value = JSON.parse(JSON.stringify(props.profile))
      originalId.value = props.profile.id
      validationErrors.value = {}
      // Initialize unique IDs for list items
      linkIds.value = generateIds(props.profile.links?.length ?? 0)
      sponsorIds.value = generateIds(props.profile.sponsors?.length ?? 0)
      supporterIds.value = generateIds(props.profile.supporters?.length ?? 0)
    }
  },
  { immediate: true }
)

// ============================================
// Validation
// ============================================

function validateProfile(): boolean {
  if (!editedProfile.value) return false

  // Check for duplicate ID first
  if (isIdDuplicate.value) {
    validationErrors.value = { id: 'Ya existe un perfil con este ID' }
    return false
  }

  const result = OrganizationConfigSchema.safeParse(editedProfile.value)
  if (result.success) {
    validationErrors.value = {}
    return true
  }

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    errors[path] = issue.message
  }
  validationErrors.value = errors
  return false
}

// ============================================
// Actions
// ============================================

function handleSave() {
  if (!editedProfile.value) return
  if (!validateProfile()) return

  emit('save', editedProfile.value, originalId.value)
  isOpen.value = false
}

function handleDiscard() {
  if (props.profile) {
    editedProfile.value = JSON.parse(JSON.stringify(props.profile))
    validationErrors.value = {}
  }
}

function handleClose() {
  if (hasChanges.value) {
    handleDiscard()
  }
  isOpen.value = false
}

function handleExport() {
  if (!editedProfile.value) return

  const json = JSON.stringify(editedProfile.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${editedProfile.value.id}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ============================================
// List management helpers
// ============================================

function swapIds(ids: number[], indexA: number, indexB: number) {
  const temp = ids[indexA]!
  ids[indexA] = ids[indexB]!
  ids[indexB] = temp
}

function addLink() {
  if (!editedProfile.value) return
  if (!editedProfile.value.links) editedProfile.value.links = []
  editedProfile.value.links.push({ url: '', image: '', alt: '' })
  linkIds.value.push(++itemIdCounter)
}

function removeLink(index: number) {
  if (!editedProfile.value?.links) return
  editedProfile.value.links.splice(index, 1)
  linkIds.value.splice(index, 1)
  if (editedProfile.value.links.length === 0) {
    delete (editedProfile.value as Record<string, unknown>).links
  }
}

function moveLinkUp(index: number) {
  if (!editedProfile.value?.links || index <= 0) return
  const links = editedProfile.value.links
  const temp = links[index]!
  links[index] = links[index - 1]!
  links[index - 1] = temp
  swapIds(linkIds.value, index, index - 1)
}

function moveLinkDown(index: number) {
  if (!editedProfile.value?.links || index >= editedProfile.value.links.length - 1) return
  const links = editedProfile.value.links
  const temp = links[index]!
  links[index] = links[index + 1]!
  links[index + 1] = temp
  swapIds(linkIds.value, index, index + 1)
}

function addSponsor() {
  if (!editedProfile.value) return
  if (!editedProfile.value.sponsors) editedProfile.value.sponsors = []
  editedProfile.value.sponsors.push({ url: '', image: '', alt: '' })
  sponsorIds.value.push(++itemIdCounter)
}

function removeSponsor(index: number) {
  if (!editedProfile.value?.sponsors) return
  editedProfile.value.sponsors.splice(index, 1)
  sponsorIds.value.splice(index, 1)
  if (editedProfile.value.sponsors.length === 0) {
    delete (editedProfile.value as Record<string, unknown>).sponsors
  }
}

function moveSponsorUp(index: number) {
  if (!editedProfile.value?.sponsors || index <= 0) return
  const sponsors = editedProfile.value.sponsors
  const temp = sponsors[index]!
  sponsors[index] = sponsors[index - 1]!
  sponsors[index - 1] = temp
  swapIds(sponsorIds.value, index, index - 1)
}

function moveSponsorDown(index: number) {
  if (!editedProfile.value?.sponsors || index >= editedProfile.value.sponsors.length - 1) return
  const sponsors = editedProfile.value.sponsors
  const temp = sponsors[index]!
  sponsors[index] = sponsors[index + 1]!
  sponsors[index + 1] = temp
  swapIds(sponsorIds.value, index, index + 1)
}

function addSupporter() {
  if (!editedProfile.value) return
  if (!editedProfile.value.supporters) editedProfile.value.supporters = []
  editedProfile.value.supporters.push({ url: '', image: '', alt: '' })
  supporterIds.value.push(++itemIdCounter)
}

function removeSupporter(index: number) {
  if (!editedProfile.value?.supporters) return
  editedProfile.value.supporters.splice(index, 1)
  supporterIds.value.splice(index, 1)
  if (editedProfile.value.supporters.length === 0) {
    delete (editedProfile.value as Record<string, unknown>).supporters
  }
}

function moveSupporterUp(index: number) {
  if (!editedProfile.value?.supporters || index <= 0) return
  const supporters = editedProfile.value.supporters
  const temp = supporters[index]!
  supporters[index] = supporters[index - 1]!
  supporters[index - 1] = temp
  swapIds(supporterIds.value, index, index - 1)
}

function moveSupporterDown(index: number) {
  if (!editedProfile.value?.supporters || index >= editedProfile.value.supporters.length - 1) return
  const supporters = editedProfile.value.supporters
  const temp = supporters[index]!
  supporters[index] = supporters[index + 1]!
  supporters[index + 1] = temp
  swapIds(supporterIds.value, index, index + 1)
}

// ============================================
// Template options
// ============================================

const templateOptions = [
  { label: 'Original', value: 'original' },
  { label: 'Logo ancho', value: 'wide-logo' }
]
</script>

<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'sm:max-w-2xl' }">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 id="modal-title" class="font-semibold text-lg">Configuración del perfil</h3>
            <UTooltip text="Cerrar">
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-tabler-x"
                aria-label="Cerrar modal de configuración"
                @click="handleClose"
              />
            </UTooltip>
          </div>
        </template>

        <div
          v-if="editedProfile"
          class="space-y-6 max-h-[60vh] overflow-y-auto px-4"
          role="form"
          aria-labelledby="modal-title"
        >
          <!-- Basic Information -->
          <fieldset class="space-y-4">
            <legend class="text-sm font-semibold text-muted mb-2">Información básica</legend>

            <UFormField
              label="ID"
              required
              class="w-full"
              :error="
                validationErrors['id'] ||
                (isIdDuplicate ? 'Ya existe un perfil con este ID' : undefined)
              "
            >
              <UInput
                v-model="editedProfile.id"
                placeholder="mi-perfil"
                icon="i-tabler-id"
                class="w-full"
                aria-describedby="id-help"
              />
              <template #hint>
                <span id="id-help" class="text-xs">Identificador único del perfil</span>
              </template>
            </UFormField>

            <UFormField
              label="Plantilla"
              required
              class="w-full"
              :error="validationErrors['template']"
            >
              <USelect
                v-model="editedProfile.template"
                :items="templateOptions"
                placeholder="Seleccionar plantilla"
                class="w-full"
                aria-label="Seleccionar plantilla de firma"
              />
            </UFormField>

            <UFormField
              label="Organización"
              required
              class="w-full"
              :error="validationErrors['organization']"
            >
              <UInput
                v-model="editedProfile.organization"
                placeholder="Nombre de la organización"
                icon="i-tabler-building"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Organización extra"
              class="w-full"
              :error="validationErrors['organization_extra']"
            >
              <UInput
                v-model="editedProfile.organization_extra"
                placeholder="Departamento, facultad, etc."
                icon="i-tabler-building-community"
                class="w-full"
              />
            </UFormField>
          </fieldset>

          <!-- Appearance -->
          <fieldset class="space-y-4">
            <legend class="text-sm font-semibold text-muted mb-2">Apariencia</legend>

            <UFormField
              label="Fuente principal"
              required
              class="w-full"
              :error="validationErrors['main_font']"
            >
              <UInput
                v-model="editedProfile.main_font"
                placeholder="Arial, sans-serif"
                icon="i-tabler-typography"
                class="w-full"
              />
              <template #hint>
                <span class="text-xs">Solo se aplicará si el destinatario la tiene</span>
              </template>
            </UFormField>

            <UFormField
              label="Fuente nombre"
              required
              class="w-full"
              :error="validationErrors['name_font']"
            >
              <UInput
                v-model="editedProfile.name_font"
                placeholder="Georgia, serif"
                icon="i-tabler-letter-case"
                class="w-full"
              />
              <template #hint>
                <span class="text-xs">Solo se aplicará si el destinatario la tiene</span>
              </template>
            </UFormField>

            <UFormField
              label="Color principal"
              required
              class="w-full"
              :error="validationErrors['color']"
            >
              <div class="flex gap-2 w-full">
                <UInput
                  v-model="editedProfile.color"
                  placeholder="#000000"
                  icon="i-tabler-palette"
                  class="flex-1"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  aria-describedby="color-format"
                />
                <label class="sr-only" for="color-picker">Selector de color</label>
                <input
                  id="color-picker"
                  v-model="editedProfile.color"
                  type="color"
                  class="w-10 h-10 rounded-lg border border-default cursor-pointer"
                />
              </div>
              <template #hint>
                <span id="color-format" class="text-xs">Formato: #RRGGBB</span>
              </template>
            </UFormField>

            <UFormField
              label="Ancho máximo (px)"
              class="w-full"
              :error="validationErrors['max_width']"
            >
              <UInput
                v-model.number="editedProfile.max_width"
                type="number"
                placeholder="600"
                icon="i-tabler-arrows-horizontal"
                class="w-full"
                min="200"
                max="1200"
              />
            </UFormField>

            <!-- Name Image (object with image, alt, description, url) -->
            <div class="p-4 border border-default rounded-lg space-y-3 bg-elevated/30">
              <span class="text-xs font-medium text-muted">Imagen del nombre</span>
              <UFormField
                label="URL de la imagen"
                required
                class="w-full"
                :error="validationErrors['name_image.image']"
              >
                <UInput
                  v-model="editedProfile.name_image.image"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  icon="i-tabler-photo"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Alt (texto alternativo)"
                class="w-full"
                :error="validationErrors['name_image.alt']"
              >
                <UInput
                  v-model="editedProfile.name_image.alt"
                  placeholder="👤"
                  icon="i-tabler-alt"
                  class="w-full"
                />
                <template #hint>
                  <span class="text-xs">Emoji o texto breve para accesibilidad</span>
                </template>
              </UFormField>
              <UFormField
                label="Descripción"
                class="w-full"
                :error="validationErrors['name_image.description']"
              >
                <UInput
                  v-model="editedProfile.name_image.description"
                  placeholder="Logo de la organización"
                  icon="i-tabler-info-circle"
                  class="w-full"
                />
                <template #hint>
                  <span class="text-xs">Se usa para title y aria-label</span>
                </template>
              </UFormField>
              <UFormField
                label="Enlace (URL)"
                class="w-full"
                :error="validationErrors['name_image.url']"
              >
                <UInput
                  v-model="editedProfile.name_image.url"
                  type="url"
                  placeholder="https://example.com"
                  icon="i-tabler-link"
                  class="w-full"
                />
                <template #hint>
                  <span class="text-xs">URL al hacer clic en la imagen</span>
                </template>
              </UFormField>
            </div>
          </fieldset>

          <!-- Contact -->
          <fieldset class="space-y-4">
            <legend class="text-sm font-semibold text-muted mb-2">Contacto</legend>

            <UFormField
              label="Código país"
              class="w-full"
              :error="validationErrors['phone_country_code']"
            >
              <UInput
                v-model="editedProfile.phone_country_code"
                placeholder="+34"
                icon="i-tabler-world"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Teléfono" class="w-full" :error="validationErrors['phone']">
              <UInput
                v-model="editedProfile.phone"
                type="tel"
                placeholder="612 345 678"
                icon="i-tabler-phone"
                class="w-full"
                autocomplete="tel"
              />
            </UFormField>

            <UFormField
              label="Extensión"
              class="w-full"
              :error="validationErrors['internal_phone']"
            >
              <UInput
                v-model="editedProfile.internal_phone"
                placeholder="1234"
                icon="i-tabler-phone-plus"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Email adicional"
              class="w-full"
              :error="validationErrors['opt_mail']"
            >
              <UInput
                v-model="editedProfile.opt_mail"
                type="email"
                placeholder="contacto@ejemplo.com"
                icon="i-tabler-mail"
                class="w-full"
                autocomplete="email"
              />
            </UFormField>
          </fieldset>

          <!-- Social Links -->
          <fieldset class="space-y-4">
            <div class="flex items-center justify-between">
              <legend class="text-sm font-semibold text-muted">Redes sociales</legend>
              <UButton
                size="xs"
                variant="soft"
                icon="i-tabler-plus"
                aria-label="Añadir red social"
                @click="addLink"
              >
                Añadir
              </UButton>
            </div>

            <div v-auto-animate class="space-y-3">
              <div
                v-for="(link, index) in editedProfile.links"
                :key="linkIds[index]"
                class="p-4 border border-default rounded-lg space-y-3 bg-elevated/30"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-muted">Enlace {{ index + 1 }}</span>
                  <div class="flex items-center gap-1">
                    <UTooltip text="Subir">
                      <UButton
                        size="xs"
                        color="info"
                        variant="ghost"
                        icon="i-tabler-chevron-up"
                        :disabled="index === 0"
                        aria-label="Mover enlace arriba"
                        @click="moveLinkUp(index)"
                      />
                    </UTooltip>
                    <UTooltip text="Bajar">
                      <UButton
                        size="xs"
                        color="info"
                        variant="ghost"
                        icon="i-tabler-chevron-down"
                        :disabled="index === (editedProfile.links?.length ?? 0) - 1"
                        aria-label="Mover enlace abajo"
                        @click="moveLinkDown(index)"
                      />
                    </UTooltip>
                    <UTooltip text="Eliminar">
                      <UButton
                        size="xs"
                        color="error"
                        variant="ghost"
                        icon="i-tabler-trash"
                        aria-label="Eliminar enlace"
                        @click="removeLink(index)"
                      />
                    </UTooltip>
                  </div>
                </div>
                <div class="space-y-3">
                  <UFormField
                    label="URL"
                    class="w-full"
                    :error="validationErrors[`links.${index}.url`]"
                  >
                    <UInput
                      v-model="link.url"
                      type="url"
                      placeholder="https://..."
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Imagen"
                    class="w-full"
                    :error="validationErrors[`links.${index}.image`]"
                  >
                    <UInput
                      v-model="link.image"
                      type="url"
                      placeholder="https://.../icon.png"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Alt"
                    class="w-full"
                    :error="validationErrors[`links.${index}.alt`]"
                  >
                    <UInput v-model="link.alt" placeholder="🌐" size="sm" class="w-full" />
                  </UFormField>
                  <UFormField
                    label="Descripción"
                    class="w-full"
                    :error="validationErrors[`links.${index}.description`]"
                  >
                    <UInput
                      v-model="link.description"
                      placeholder="Descripción del enlace"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                </div>
              </div>
            </div>

            <p
              v-if="!editedProfile.links?.length"
              class="text-sm text-muted text-center py-4 border border-dashed border-default rounded-lg"
            >
              No hay redes sociales configuradas
            </p>
          </fieldset>

          <!-- Sponsors -->
          <fieldset class="space-y-4">
            <div class="flex items-center justify-between">
              <legend class="text-sm font-semibold text-muted">Patrocinadores</legend>
              <UButton
                size="xs"
                variant="soft"
                icon="i-tabler-plus"
                aria-label="Añadir patrocinador"
                @click="addSponsor"
              >
                Añadir
              </UButton>
            </div>

            <UFormField
              label="Texto patrocinadores"
              class="w-full"
              :error="validationErrors['sponsor_text']"
            >
              <UInput
                v-model="editedProfile.sponsor_text"
                placeholder="Patrocinado por:"
                icon="i-tabler-tag"
                class="w-full"
              />
            </UFormField>

            <div v-auto-animate class="space-y-3">
              <div
                v-for="(sponsor, index) in editedProfile.sponsors"
                :key="sponsorIds[index]"
                class="p-4 border border-default rounded-lg space-y-3 bg-elevated/30"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-muted">Patrocinador {{ index + 1 }}</span>
                  <div class="flex items-center gap-1">
                    <UTooltip text="Subir">
                      <UButton
                        size="xs"
                        variant="ghost"
                        icon="i-tabler-chevron-up"
                        :disabled="index === 0"
                        aria-label="Mover patrocinador arriba"
                        @click="moveSponsorUp(index)"
                      />
                    </UTooltip>
                    <UTooltip text="Bajar">
                      <UButton
                        size="xs"
                        variant="ghost"
                        icon="i-tabler-chevron-down"
                        :disabled="index === (editedProfile.sponsors?.length ?? 0) - 1"
                        aria-label="Mover patrocinador abajo"
                        @click="moveSponsorDown(index)"
                      />
                    </UTooltip>
                    <UTooltip text="Eliminar">
                      <UButton
                        size="xs"
                        color="error"
                        variant="ghost"
                        icon="i-tabler-trash"
                        aria-label="Eliminar patrocinador"
                        @click="removeSponsor(index)"
                      />
                    </UTooltip>
                  </div>
                </div>
                <div class="space-y-3">
                  <UFormField
                    label="URL"
                    class="w-full"
                    :error="validationErrors[`sponsors.${index}.url`]"
                  >
                    <UInput
                      v-model="sponsor.url"
                      type="url"
                      placeholder="https://..."
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Imagen"
                    class="w-full"
                    :error="validationErrors[`sponsors.${index}.image`]"
                  >
                    <UInput
                      v-model="sponsor.image"
                      type="url"
                      placeholder="https://.../logo.png"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Alt"
                    class="w-full"
                    :error="validationErrors[`sponsors.${index}.alt`]"
                  >
                    <UInput
                      v-model="sponsor.alt"
                      placeholder="Nombre del patrocinador"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Descripción"
                    class="w-full"
                    :error="validationErrors[`sponsors.${index}.description`]"
                  >
                    <UInput
                      v-model="sponsor.description"
                      placeholder="Descripción del patrocinador"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Ancho (px)"
                    class="w-full"
                    :error="validationErrors[`sponsors.${index}.width`]"
                  >
                    <UInput
                      v-model.number="sponsor.width"
                      type="number"
                      placeholder="100"
                      size="sm"
                      class="w-full"
                      min="1"
                    />
                  </UFormField>
                  <UFormField
                    label="Alto (px)"
                    class="w-full"
                    :error="validationErrors[`sponsors.${index}.height`]"
                  >
                    <UInput
                      v-model.number="sponsor.height"
                      type="number"
                      placeholder="50"
                      size="sm"
                      class="w-full"
                      min="1"
                    />
                  </UFormField>
                </div>
              </div>
            </div>

            <p
              v-if="!editedProfile.sponsors?.length"
              class="text-sm text-muted text-center py-4 border border-dashed border-default rounded-lg"
            >
              No hay patrocinadores configurados
            </p>
          </fieldset>

          <!-- Supporters -->
          <fieldset class="space-y-4">
            <div class="flex items-center justify-between">
              <legend class="text-sm font-semibold text-muted">Colaboradores</legend>
              <UButton
                size="xs"
                variant="soft"
                icon="i-tabler-plus"
                aria-label="Añadir colaborador"
                @click="addSupporter"
              >
                Añadir
              </UButton>
            </div>

            <UFormField
              label="Texto colaboradores"
              class="w-full"
              :error="validationErrors['supporter_text']"
            >
              <UInput
                v-model="editedProfile.supporter_text"
                placeholder="En colaboración con:"
                icon="i-tabler-users"
                class="w-full"
              />
            </UFormField>

            <div v-auto-animate class="space-y-3">
              <div
                v-for="(supporter, index) in editedProfile.supporters"
                :key="supporterIds[index]"
                class="p-4 border border-default rounded-lg space-y-3 bg-elevated/30"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-muted">Colaborador {{ index + 1 }}</span>
                  <div class="flex items-center gap-1">
                    <UTooltip text="Subir">
                      <UButton
                        size="xs"
                        variant="ghost"
                        icon="i-tabler-chevron-up"
                        :disabled="index === 0"
                        aria-label="Mover colaborador arriba"
                        @click="moveSupporterUp(index)"
                      />
                    </UTooltip>
                    <UTooltip text="Bajar">
                      <UButton
                        size="xs"
                        variant="ghost"
                        icon="i-tabler-chevron-down"
                        :disabled="index === (editedProfile.supporters?.length ?? 0) - 1"
                        aria-label="Mover colaborador abajo"
                        @click="moveSupporterDown(index)"
                      />
                    </UTooltip>
                    <UTooltip text="Eliminar">
                      <UButton
                        size="xs"
                        color="error"
                        variant="ghost"
                        icon="i-tabler-trash"
                        aria-label="Eliminar colaborador"
                        @click="removeSupporter(index)"
                      />
                    </UTooltip>
                  </div>
                </div>
                <div class="space-y-3">
                  <UFormField
                    label="URL"
                    class="w-full"
                    :error="validationErrors[`supporters.${index}.url`]"
                  >
                    <UInput
                      v-model="supporter.url"
                      type="url"
                      placeholder="https://..."
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Imagen"
                    class="w-full"
                    :error="validationErrors[`supporters.${index}.image`]"
                  >
                    <UInput
                      v-model="supporter.image"
                      type="url"
                      placeholder="https://.../logo.png"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Alt"
                    class="w-full"
                    :error="validationErrors[`supporters.${index}.alt`]"
                  >
                    <UInput
                      v-model="supporter.alt"
                      placeholder="Nombre del colaborador"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Descripción"
                    class="w-full"
                    :error="validationErrors[`supporters.${index}.description`]"
                  >
                    <UInput
                      v-model="supporter.description"
                      placeholder="Descripción del colaborador"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField
                    label="Ancho (px)"
                    class="w-full"
                    :error="validationErrors[`supporters.${index}.width`]"
                  >
                    <UInput
                      v-model.number="supporter.width"
                      type="number"
                      placeholder="100"
                      size="sm"
                      class="w-full"
                      min="1"
                    />
                  </UFormField>
                  <UFormField
                    label="Alto (px)"
                    class="w-full"
                    :error="validationErrors[`supporters.${index}.height`]"
                  >
                    <UInput
                      v-model.number="supporter.height"
                      type="number"
                      placeholder="50"
                      size="sm"
                      class="w-full"
                      min="1"
                    />
                  </UFormField>
                </div>
              </div>
            </div>

            <p
              v-if="!editedProfile.supporters?.length"
              class="text-sm text-muted text-center py-4 border border-dashed border-default rounded-lg"
            >
              No hay colaboradores configurados
            </p>
          </fieldset>

          <!-- Footer -->
          <fieldset class="space-y-4">
            <legend class="text-sm font-semibold text-muted mb-2">Pie de firma</legend>

            <UFormField
              label="Dirección"
              class="w-full"
              :error="validationErrors['footer_address']"
            >
              <UTextarea
                v-model="editedProfile.footer_address"
                placeholder="Calle Ejemplo, 123..."
                :rows="2"
                class="w-full"
                autoresize
              />
            </UFormField>

            <UFormField label="Texto legal" class="w-full" :error="validationErrors['footer_text']">
              <UTextarea
                v-model="editedProfile.footer_text"
                placeholder="Texto legal o aviso de confidencialidad..."
                :rows="4"
                class="w-full"
                autoresize
              />
            </UFormField>
          </fieldset>
        </div>

        <template #footer>
          <div v-auto-animate class="flex flex-col gap-3">
            <!-- Action buttons when there are changes -->
            <div v-if="hasChanges" class="flex gap-2">
              <UButton
                color="primary"
                icon="i-tabler-check"
                class="flex-1 justify-center"
                :disabled="isIdDuplicate"
                @click="handleSave"
              >
                Guardar cambios
              </UButton>
              <UButton
                color="neutral"
                variant="soft"
                icon="i-tabler-x"
                class="flex-1 justify-center"
                @click="handleDiscard"
              >
                Descartar
              </UButton>
            </div>

            <!-- Export/Duplicate buttons -->
            <div class="flex gap-2">
              <UButton
                color="neutral"
                variant="soft"
                icon="i-tabler-copy"
                class="flex-1 justify-center"
                aria-label="Crear nuevo perfil basado en este"
                disabled
              >
                Duplicar perfil
              </UButton>
              <UButton
                color="neutral"
                variant="soft"
                icon="i-tabler-download"
                class="flex-1 justify-center"
                aria-label="Exportar perfil a archivo JSON"
                @click="handleExport"
              >
                Exportar
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
