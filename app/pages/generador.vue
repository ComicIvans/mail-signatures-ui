<script setup lang="ts">
import type { AcceptableValue, SelectItem, TabsItem } from '@nuxt/ui'
import { z } from 'zod/v4'
import {
  type Format,
  type OrganizationConfig,
  type SignatureField,
  type UserSignatureData,
  OrganizationConfigSchema,
  FormatSchema,
  SignatureFieldSchema,
  UserSignatureDataSchema
} from '~/types/signature'
import { useSignatureGenerator } from '~/composables/useSignatureGenerator'

// Import JSON data
import formatsData from '~/data/formats.json'
import profilesData from '~/data/profiles.json'
import fieldsData from '~/data/fields.json'

useSeoMeta({
  title: 'Generador de firmas',
  description:
    'Genera tu firma de correo electrónico personalizada. Elige el formato, organización y completa tus datos personales.'
})

// Validate and parse JSON data
const formats = z.array(FormatSchema).parse(formatsData)
const profiles = z.array(OrganizationConfigSchema).parse(profilesData)
const requiredFields = z.array(SignatureFieldSchema).parse(fieldsData.required)
const optionalFields = z.array(SignatureFieldSchema).parse(fieldsData.optional)

// Composable for signature generation
const { generateHtml, copyToClipboard, downloadHtml } = useSignatureGenerator()

// ============================================
// State
// ============================================

// Format selection
const formatOptions = computed<SelectItem[]>(() =>
  formats.map((f) => ({
    label: f.label,
    value: f.id
  }))
)
const selectedFormatId = ref(formats[0]?.id || 'original')
const selectedFormat = computed<Format | undefined>(() =>
  formats.find((f) => f.id === selectedFormatId.value)
)

// Profile selection
const profileOptions = computed<SelectItem[]>(() =>
  profiles.map((p) => ({
    label: p.id,
    value: p.id
  }))
)
const selectedProfileId = ref(profiles[0]?.id || '')
const selectedProfile = computed<OrganizationConfig | undefined>(() =>
  profiles.find((p) => p.id === selectedProfileId.value)
)

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

const selectedOptionalFieldToAdd = ref<string>()

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

  selectedOptionalFieldToAdd.value = undefined
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
  return false
}

// ============================================
// Actions
// ============================================

function handleCopyHtml() {
  if (!selectedProfile.value) return
  if (!validateUserData(userData)) return

  const html = generateHtml(userData, selectedProfile.value, selectedFormatId.value)
  copyToClipboard(html)
}

function handleDownload() {
  if (!selectedProfile.value) return
  if (!validateUserData(userData)) return

  const html = generateHtml(userData, selectedProfile.value, selectedFormatId.value)
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Format Card -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Formato</h3>
        </template>
        <UFormField label="Estilo del diseño">
          <USelect v-model="selectedFormatId" :items="formatOptions" class="w-full" />
        </UFormField>
        <p v-if="selectedFormat?.description" class="text-sm text-muted mt-2">
          {{ selectedFormat.description }}
        </p>
      </UCard>

      <!-- Profile Card -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Perfil</h3>
        </template>
        <UFormField label="Organización">
          <USelect v-model="selectedProfileId" :items="profileOptions" class="w-full" />
        </UFormField>
        <p v-if="selectedProfile" class="text-sm text-muted mt-2">
          {{ selectedProfile.organization }}
        </p>
      </UCard>

      <!-- Mode Card -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Modo</h3>
        </template>
        <UTabs v-model="selectedMode" :items="modeTabs" :content="false" class="w-full" />
        <p
          v-if="modeTabs.find((t) => t.value === selectedMode)?.description"
          class="text-sm text-muted mt-2"
        >
          {{ modeTabs.find((t) => t.value === selectedMode)?.description }}
        </p>
      </UCard>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
      <!-- Form Section -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">Información personal</h3>
        </template>

        <div class="space-y-4">
          <!-- Required fields -->
          <UFormField
            v-for="field in requiredFields"
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
                  color="neutral"
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
            <p class="text-sm text-muted">Así se verá tu firma en los correos electrónicos</p>
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
            :format="selectedFormatId"
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
