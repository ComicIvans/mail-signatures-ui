<script setup lang="ts">
import type { OrganizationConfig, UserSignatureData } from '~/types/signature'

const props = defineProps<{
  user: UserSignatureData
  profile: OrganizationConfig
  enabledOptionalFields?: Set<string>
}>()

// Helper to check if an optional field is enabled (user explicitly added it)
const isFieldEnabled = (fieldId: string) => props.enabledOptionalFields?.has(fieldId) ?? false

// Helper to get field value with smart fallback:
// - If field is enabled by user, use user value (even if empty, to allow override)
// - If field is not enabled, fall back to profile value
const getOptionalValue = (fieldId: string, userValue?: string, profileValue?: string) => {
  if (isFieldEnabled(fieldId)) {
    return userValue || undefined
  }
  return userValue || profileValue
}

// Computed values that merge user data with profile defaults
const displayName = computed(() => props.user.name || 'Nombre')
const displayPosition = computed(() => props.user.position || 'Puesto')
const displayMail = computed(() => props.user.mail || 'email@ejemplo.com')
const displayPhone = computed(() =>
  getOptionalValue('phone', props.user.phone, props.profile.phone)
)
const displayPhoneCountryCode = computed(() =>
  getOptionalValue(
    'phone_country_code',
    props.user.phone_country_code,
    props.profile.phone_country_code
  )
)
const displayInternalPhone = computed(() =>
  getOptionalValue('internal_phone', props.user.internal_phone, props.profile.internal_phone)
)
const displayOptMail = computed(() =>
  getOptionalValue('opt_mail', props.user.opt_mail, props.profile.opt_mail)
)
const displayOrganizationExtra = computed(() =>
  getOptionalValue(
    'organization_extra',
    props.user.organization_extra,
    props.profile.organization_extra
  )
)
const displayNameImage = computed(() =>
  getOptionalValue('name_image', props.user.name_image, props.profile.name_image)
)
const displayMainFont = computed(() =>
  getOptionalValue('main_font', props.user.main_font, props.profile.main_font)
)
const displayNameFont = computed(() =>
  getOptionalValue('name_font', props.user.name_font, props.profile.name_font)
)
const displayMaxWidth = computed(
  () => props.user.max_width || (isFieldEnabled('max_width') ? undefined : props.profile.max_width)
)

// Phone link with country code
const phoneHref = computed(() => {
  if (!displayPhoneCountryCode.value || !displayPhone.value) return undefined
  return `tel:${displayPhoneCountryCode.value}${displayPhone.value.replace(/\s/g, '')}`
})

// Generate unique ID for images based on profile and source
const getImageId = (prefix: string, src?: string) => {
  if (!src) return `${prefix}-${props.profile.id}-default`
  return `${prefix}-${props.profile.id}-${src.split('/').pop()}`
}
</script>

<template>
  <div
    :style="{
      fontFamily: `'${displayMainFont}', sans-serif`,
      fontSize: '10pt',
      colorScheme: 'light',
      color: '#000000',
      backgroundColor: '#ffffff'
    }"
  >
    <div :style="{ width: displayMaxWidth ? `${displayMaxWidth}px` : 'fit-content' }">
      <!-- Wide logo on top -->
      <img
        :id="getImageId('logo', displayNameImage)"
        alt="👤"
        :src="displayNameImage"
        :style="{
          minWidth: '120px',
          minHeight: '65px',
          maxWidth: displayMaxWidth ? `${displayMaxWidth}px` : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          overflow: 'hidden'
        }"
        width="120"
      />

      <!-- Content with vertical color bar -->
      <div style="display: flex; flex-direction: row; margin-top: 10px; margin-bottom: 20px">
        <!-- Vertical color bar (decorative) -->
        <div
          aria-hidden="true"
          role="presentation"
          :style="{
            marginRight: '10px',
            width: '4px',
            minHeight: 'max-content',
            backgroundColor: profile.color,
            borderRadius: '10px'
          }"
        />

        <!-- Info section -->
        <div>
          <p
            :style="{
              margin: 'auto',
              marginLeft: '0',
              fontFamily: `'${displayNameFont}', sans-serif`,
              fontSize: '16pt'
            }"
          >
            <b>{{ displayName }}</b>
          </p>
          <p style="margin: 0; font-size: 12pt">
            <b>{{ displayPosition }}</b>
          </p>
          <p style="margin: 0">{{ profile.organization }}</p>

          <!-- Contact: Phone + Mail -->
          <template v-if="displayPhone">
            <br />
            <p style="margin: 0">
              <template v-if="displayPhoneCountryCode">
                <a style="color: inherit; text-decoration: none" :href="phoneHref">{{
                  displayPhone
                }}</a>
              </template>
              <template v-else>
                {{ displayPhone }}
              </template>
              <template v-if="displayInternalPhone"> &nbsp;({{ displayInternalPhone }}) </template>
              <b>&nbsp;&nbsp;·&nbsp;&nbsp;</b>
              <a style="color: inherit; text-decoration: none" :href="`mailto:${displayMail}`">{{
                displayMail
              }}</a>
            </p>
          </template>

          <!-- Contact: Two emails -->
          <template v-else-if="displayOptMail">
            <br />
            <a style="color: inherit; text-decoration: none" :href="`mailto:${displayMail}`">{{
              displayMail
            }}</a>
            <b>&nbsp;&nbsp;·&nbsp;&nbsp;</b>
            <a style="color: inherit; text-decoration: none" :href="`mailto:${displayOptMail}`">{{
              displayOptMail
            }}</a>
            <br />
          </template>

          <!-- Contact: Just email -->
          <template v-else>
            <br />
            <a style="color: inherit; text-decoration: none" :href="`mailto:${displayMail}`">{{
              displayMail
            }}</a>
            <br />
          </template>

          <!-- Organization extra -->
          <template v-if="displayOrganizationExtra">
            <br />
            <p style="margin: 0">
              <i>{{ displayOrganizationExtra }}</i>
            </p>
          </template>
        </div>
      </div>

      <!-- Social links -->
      <nav
        v-if="profile.links && profile.links.length > 0"
        aria-label="Redes sociales"
        style="display: flex; align-items: center; margin-bottom: 20px"
      >
        <a
          v-for="link in profile.links"
          :key="link.url"
          :href="link.url"
          :aria-label="link.alt"
          style="
            border-radius: 50%;
            color: inherit;
            text-decoration: none;
            margin-right: 5px;
            min-width: 35px;
            min-height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            font-weight: bold;
            font-size: 14pt;
          "
        >
          <img
            :id="getImageId('link', link.image)"
            :alt="link.alt"
            :src="link.image"
            style="
              font-size: 16pt;
              max-width: 35px;
              max-height: 35px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
            height="35"
            width="35"
          />
        </a>
      </nav>
    </div>

    <!-- Sponsor text with color bar -->
    <div
      v-if="profile.sponsor_text"
      style="display: flex; flex-direction: row; margin-bottom: 10px"
    >
      <div
        aria-hidden="true"
        role="presentation"
        :style="{
          marginRight: '10px',
          width: '4px',
          minHeight: 'max-content',
          backgroundColor: profile.color,
          borderRadius: '10px'
        }"
      />
      <p style="margin: 0; font-size: 12pt">{{ profile.sponsor_text }}</p>
    </div>

    <!-- Sponsors -->
    <section
      v-if="profile.sponsors && profile.sponsors.length > 0"
      aria-label="Patrocinadores"
      style="display: flex; flex-direction: row; gap: 5px; flex-wrap: wrap; margin-bottom: 20px"
    >
      <template v-for="sponsor in profile.sponsors" :key="sponsor.url">
        <a
          :href="sponsor.url"
          :aria-label="sponsor.alt"
          style="color: inherit; text-decoration: none"
        >
          <img
            :id="getImageId('sponsor', sponsor.image)"
            :alt="sponsor.alt"
            :src="sponsor.image"
            :style="{
              maxWidth: displayMaxWidth ? `${displayMaxWidth}px` : 'none',
              width: sponsor.width ? `${sponsor.width}px` : 'auto',
              height: sponsor.height ? `${sponsor.height}px` : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }"
            :width="sponsor.width"
            :height="sponsor.height"
          /> </a
        >&nbsp;
      </template>
    </section>

    <!-- Supporter text with color bar -->
    <div
      v-if="profile.supporter_text"
      style="display: flex; flex-direction: row; margin-bottom: 10px"
    >
      <div
        aria-hidden="true"
        role="presentation"
        :style="{
          marginRight: '10px',
          width: '4px',
          minHeight: 'max-content',
          backgroundColor: profile.color,
          borderRadius: '10px'
        }"
      />
      <p style="margin: 0; font-size: 12pt">{{ profile.supporter_text }}</p>
    </div>

    <!-- Supporters -->
    <section
      v-if="profile.supporters && profile.supporters.length > 0"
      aria-label="Colaboradores"
      style="display: flex; flex-direction: row; gap: 5px; flex-wrap: wrap; margin-bottom: 20px"
    >
      <template v-for="supporter in profile.supporters" :key="supporter.url">
        <a
          :href="supporter.url"
          :aria-label="supporter.alt"
          style="color: inherit; text-decoration: none"
        >
          <img
            :id="getImageId('supporter', supporter.image)"
            :alt="supporter.alt"
            :src="supporter.image"
            :style="{
              maxWidth: displayMaxWidth ? `${displayMaxWidth}px` : 'none',
              width: supporter.width ? `${supporter.width}px` : 'auto',
              height: supporter.height ? `${supporter.height}px` : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }"
            :width="supporter.width"
            :height="supporter.height"
          /> </a
        >&nbsp;
      </template>
    </section>

    <!-- Footer -->
    <footer v-if="profile.footer_address || profile.footer_text" style="font-size: 8pt">
      <b v-if="profile.footer_address" :style="{ color: profile.color }">
        {{ profile.footer_address }}
      </b>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="profile.footer_text" style="color: dimgray" v-html="profile.footer_text" />
    </footer>
  </div>
</template>
