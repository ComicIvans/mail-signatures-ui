<script setup lang="ts">
import type { OrganizationConfig, UserSignatureData } from '~/types/signature'

const props = defineProps<{
  user: UserSignatureData
  profile: OrganizationConfig
  enabledOptionalFields?: Set<string>
}>()

// Dynamic component based on profile template
const templateComponent = computed(() => {
  switch (props.profile.template) {
    case 'wide-logo':
      return resolveComponent('SignatureTemplateWideLogo')
    case 'original':
    default:
      return resolveComponent('SignatureTemplateOriginal')
  }
})
</script>

<template>
  <component
    :is="templateComponent"
    :user="user"
    :profile="profile"
    :enabled-optional-fields="enabledOptionalFields"
  />
</template>
