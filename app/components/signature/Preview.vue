<script setup lang="ts">
import type { OrganizationConfig, SignaturePreviewMode, UserSignatureData } from '~/types/signature'
import { generateSignatureHtml, extractSignatureDiv } from '~/composables/useSignatureTemplates'
import { getSignaturePreviewHtml } from '~/composables/useSignaturePreview'

const props = defineProps<{
  user: UserSignatureData
  profile: OrganizationConfig
  enabledOptionalFields?: Set<string>
  previewMode?: SignaturePreviewMode
}>()

// Generate the signature HTML and extract just the body content for preview
const signatureHtml = computed(() => {
  const fullHtml = generateSignatureHtml(props.user, props.profile, props.enabledOptionalFields)
  const extractedHtml = extractSignatureDiv(fullHtml)

  return getSignaturePreviewHtml(extractedHtml, props.previewMode ?? 'images')
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="preview-render-root inline-block min-w-full" v-html="signatureHtml" />
</template>
