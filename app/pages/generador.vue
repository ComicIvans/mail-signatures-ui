<script setup lang="ts">
import type { AcceptableValue, SelectItem, TabsItem } from '@nuxt/ui'
import { z } from 'zod/v4'
import {
  type OrganizationConfig,
  type SignatureField,
  type UserSignatureData,
  OrganizationConfigSchema,
  SignatureFieldSchema,
  UserSignatureDataSchema
} from '~/types/signature'
import { useSignatureGenerator } from '~/composables/useSignatureGenerator'

// Import JSON data
import profilesData from '~/data/profiles.json'
import fieldsData from '~/data/fields.json'

useSeoMeta({
  title: 'Generador de firmas',
  description:
    'Genera tu firma de correo electrónico personalizada. Elige el perfil de organización y completa tus datos personales.'
})

// Validate and parse JSON data
const profiles = z.array(OrganizationConfigSchema).parse(profilesData)
const requiredFields = z.array(SignatureFieldSchema).parse(fieldsData.required)
const optionalFields = z.array(SignatureFieldSchema).parse(fieldsData.optional)

// Composable for signature generation
const { generateHtml, copyToClipboard, downloadHtml } = useSignatureGenerator()

// ============================================
// State
// ============================================

// Profile selection
interface ProfileOption {
  id: string
  organization: string
  label: string
  value: string
}

const profileOptions = computed<ProfileOption[]>(() =>
  profiles.map((p) => ({
    id: p.id,
    organization: p.organization,
    label: `${p.id} - ${p.organization}`,
    value: p.id
  }))
)
const selectedProfileId = ref(profiles[0]?.id || '')
const selectedProfile = computed<OrganizationConfig | undefined>(() =>
  profiles.find((p) => p.id === selectedProfileId.value)
)

// Modal for profile configuration
const isProfileModalOpen = ref(false)

// Mode tabs (multiple mode disabled for now)
const modeTabs: TabsItem[] = [
  {
    label: 'Individual',
    description: 'Genera una única firma',
    value: 'individual',
    icon: 'i-lucide-user'
  },
  {
    label: 'Múltiple',
    description: 'Genera múltiples firmas a la vez',
    value: 'multiple',
    icon: 'i-lucide-users',
    disabled: true
  }
]
const selectedMode = ref('individual')

// ============================================
// Form data
// ============================================

// Create initial user data with empty values
function createEmptyUserData(): UserSignatureData {
  return {
    name: '',
    position: '',
    mail: '',
    output: '',
    phone: '',
    phone_country_code: '',
    internal_phone: '',
    opt_mail: '',
    organization_extra: '',
    main_font: '',
    name_font: '',
    max_width: undefined,
    name_image: ''
  }
}

const userData = reactive<UserSignatureData>(createEmptyUserData())

// Helper functions for dynamic field access
function getFieldValue(fieldId: string): string {
  return ((userData as Record<string, unknown>)[fieldId] as string) || ''
}

function setFieldValue(fieldId: string, value: string): void {
  ;(userData as Record<string, unknown>)[fieldId] = value
}

// Track which optional fields are enabled
const enabledOptionalFields = ref<Set<string>>(new Set())

// Available optional fields (not yet enabled)
const availableOptionalFields = computed<SelectItem[]>(() =>
  optionalFields
    .filter((f) => !enabledOptionalFields.value.has(f.id))
    .map((f) => ({
      label: f.label,
      value: f.id,
      icon: f.icon
    }))
)

const selectedOptionalFieldToAdd = ref<string | undefined>(undefined)

function addOptionalField(fieldId: AcceptableValue | undefined) {
  if (!fieldId || typeof fieldId !== 'string') return
  enabledOptionalFields.value.add(fieldId)

  // Set default value from profile if available
  const field = optionalFields.find((f) => f.id === fieldId)
  if (field?.defaultFromProfile && selectedProfile.value) {
    const profileValue = selectedProfile.value[field.defaultFromProfile as keyof OrganizationConfig]
    if (profileValue !== undefined) {
      ;(userData as Record<string, unknown>)[fieldId] = profileValue
    }
  }

  // Clear selection after adding - use nextTick to ensure UI updates
  nextTick(() => {
    selectedOptionalFieldToAdd.value = undefined
  })
}

function removeOptionalField(fieldId: string) {
  enabledOptionalFields.value.delete(fieldId)
  ;(userData as Record<string, unknown>)[fieldId] = ''
}

// Get enabled optional fields as SignatureField array
const enabledOptionalFieldsList = computed<SignatureField[]>(() =>
  optionalFields.filter((f) => enabledOptionalFields.value.has(f.id))
)

// ============================================
// Validation
// ============================================

const validationErrors = ref<Record<string, string>>({})

function validateUserData(data: UserSignatureData): boolean {
  const result = UserSignatureDataSchema.safeParse(data)
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

  // Scroll to first field with error
  const firstErrorField = result.error.issues[0]?.path[0]
  if (firstErrorField) {
    nextTick(() => {
      const element = document.getElementById(`field-${String(firstErrorField)}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Focus the input inside the field
      const input = element?.querySelector('input')
      input?.focus()
    })
  }

  return false
}

// ============================================
// Actions
// ============================================

function handleCopyHtml() {
  if (!selectedProfile.value) return
  if (!validateUserData(userData)) return

  const html = generateHtml(userData, selectedProfile.value)
  copyToClipboard(html)
}

function handleDownload() {
  if (!selectedProfile.value) return
  if (!validateUserData(userData)) return

  const html = generateHtml(userData, selectedProfile.value)
  downloadHtml(html, selectedProfile.value.id, userData.name, userData.output)
}

// Update defaults for enabled optional fields when profile changes
watch(selectedProfileId, () => {
  for (const fieldId of enabledOptionalFields.value) {
    const field = optionalFields.find((f) => f.id === fieldId)
    if (field?.defaultFromProfile && selectedProfile.value) {
      const profileValue =
        selectedProfile.value[field.defaultFromProfile as keyof OrganizationConfig]
      if (profileValue !== undefined && !(userData as Record<string, unknown>)[fieldId]) {
        ;(userData as Record<string, unknown>)[fieldId] = profileValue
      }
    }
  }
})
</script>

<template>
  <UContainer class="py-8">
    <!-- Configuration Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Profile Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">Perfil</h3>
            <UButton
              v-if="selectedProfile"
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-lucide-settings"
              @click="isProfileModalOpen = true"
            />
          </div>
        </template>
        <USelectMenu
          v-model="selectedProfileId"
          :items="profileOptions"
          class="w-full"
          value-key="value"
        >
          <template #item="{ item }">
            <div class="py-1">
              <span class="font-semibold">{{ (item as ProfileOption).id }}</span>
              <p class="text-sm text-muted whitespace-normal">
                {{ (item as ProfileOption).organization }}
              </p>
            </div>
          </template>
        </USelectMenu>
      </UCard>

      <!-- Mode Card -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Modo</h3>
        </template>
        <UTabs v-model="selectedMode" :items="modeTabs" :content="false" class="w-full" />
      </UCard>
    </div>

    <!-- Profile Configuration Modal -->
    <UModal v-model:open="isProfileModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Configuración del perfil</h3>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-x"
                @click="isProfileModalOpen = false"
              />
            </div>
          </template>
          <div v-if="selectedProfile" class="space-y-3 text-sm max-h-96 overflow-y-auto">
            <div class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">ID:</span>
              <span>{{ selectedProfile.id }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Plantilla:</span>
              <span>{{ selectedProfile.template }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Organización:</span>
              <span>{{ selectedProfile.organization }}</span>
            </div>
            <div v-if="selectedProfile.organization_extra" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Org. extra:</span>
              <span>{{ selectedProfile.organization_extra }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Color:</span>
              <span class="flex items-center gap-2">
                <span
                  class="w-4 h-4 rounded-full border"
                  :style="{ backgroundColor: selectedProfile.color }"
                />
                {{ selectedProfile.color }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Fuente principal:</span>
              <span>{{ selectedProfile.main_font }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Fuente nombre:</span>
              <span>{{ selectedProfile.name_font }}</span>
            </div>
            <div v-if="selectedProfile.phone" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Teléfono:</span>
              <span>{{ selectedProfile.phone_country_code }} {{ selectedProfile.phone }}</span>
            </div>
            <div v-if="selectedProfile.internal_phone" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Extensión:</span>
              <span>{{ selectedProfile.internal_phone }}</span>
            </div>
            <div v-if="selectedProfile.opt_mail" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Email opcional:</span>
              <span>{{ selectedProfile.opt_mail }}</span>
            </div>
            <div v-if="selectedProfile.max_width" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Ancho máximo:</span>
              <span>{{ selectedProfile.max_width }}px</span>
            </div>
            <div v-if="selectedProfile.links?.length" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Enlaces:</span>
              <span>{{ selectedProfile.links.length }} redes sociales</span>
            </div>
            <div v-if="selectedProfile.sponsors?.length" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Patrocinadores:</span>
              <span>{{ selectedProfile.sponsors.length }}</span>
            </div>
            <div v-if="selectedProfile.supporters?.length" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Colaboradores:</span>
              <span>{{ selectedProfile.supporters.length }}</span>
            </div>
            <div v-if="selectedProfile.footer_address" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Dirección:</span>
              <span class="text-xs">{{ selectedProfile.footer_address }}</span>
            </div>
            <div v-if="selectedProfile.footer_text" class="grid grid-cols-2 gap-2">
              <span class="font-medium text-muted">Pie de página:</span>
              <span class="text-xs text-muted">Texto legal configurado</span>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
      <!-- Form Section -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Campos de la firma</h3>
        </template>

        <div class="space-y-4">
          <!-- Required fields -->
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

          <!-- Enabled optional fields -->
          <UFormField
            v-for="field in enabledOptionalFieldsList"
            :id="`field-${field.id}`"
            :key="field.id"
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
                  icon="i-lucide-x"
                  @click="removeOptionalField(field.id)"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Add optional field selector -->
          <USelect
            v-if="availableOptionalFields.length > 0"
            v-model="selectedOptionalFieldToAdd"
            :items="availableOptionalFields"
            placeholder="Añadir campo opcional"
            class="w-full"
            @update:model-value="addOptionalField"
          />
        </div>
      </UCard>

      <!-- Preview Section -->
      <UCard>
        <template #header>
          <div>
            <h3 class="font-semibold">Vista previa</h3>
          </div>
        </template>

        <!-- Signature Preview -->
        <div
          class="bg-white text-black rounded-lg p-6 min-h-48 overflow-auto"
          style="color-scheme: light"
        >
          <SignaturePreview
            v-if="selectedProfile"
            :user="userData"
            :profile="selectedProfile"
            :enabled-optional-fields="enabledOptionalFields"
          />
        </div>

        <!-- Action Buttons -->
        <template #footer>
          <div class="flex flex-col sm:flex-row gap-3">
            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-copy"
              class="flex-1 justify-center"
              @click="handleCopyHtml"
            >
              Copiar HTML
            </UButton>
            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-download"
              class="flex-1 justify-center"
              @click="handleDownload"
            >
              Descargar
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
