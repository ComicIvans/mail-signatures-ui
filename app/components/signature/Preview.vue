<script setup lang="ts">
import type { OrganizationConfig, UserSignatureData } from '~/types/signature'
import { generateSignatureHtml, extractSignatureDiv } from '~/composables/useSignatureTemplates'

const props = defineProps<{
  user: UserSignatureData
  profile: OrganizationConfig
  enabledOptionalFields?: Set<string>
}>()

// Generate the signature HTML and extract just the body content for preview
const signatureHtml = computed(() => {
  const fullHtml = generateSignatureHtml(props.user, props.profile, props.enabledOptionalFields)
  return extractSignatureDiv(fullHtml)
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="signatureHtml" />
</template>
