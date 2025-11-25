<script setup lang="ts">
import type { OrganizationConfig, UserSignatureData } from '~/types/signature'

const props = defineProps<{
  user: UserSignatureData
  profile: OrganizationConfig
  format: string
}>()

// Dynamic component based on format
const templateComponent = computed(() => {
  switch (props.format) {
    case 'wide-logo':
      return resolveComponent('SignatureTemplateWideLogo')
    case 'original':
    default:
      return resolveComponent('SignatureTemplateOriginal')
  }
})
</script>

<template>
  <component :is="templateComponent" :user="user" :profile="profile" />
</template>
