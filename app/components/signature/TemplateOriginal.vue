<script setup lang="ts">
import type { OrganizationConfig, UserSignatureData } from '~/types/signature'

const props = defineProps<{
  user: UserSignatureData
  profile: OrganizationConfig
}>()

// Computed values that merge user data with profile defaults
const displayName = computed(() => props.user.name || 'Nombre')
const displayPosition = computed(() => props.user.position || 'Puesto')
const displayMail = computed(() => props.user.mail || 'email@ejemplo.com')
const displayPhone = computed(() => props.user.phone || props.profile.phone)
const displayPhoneCountryCode = computed(
  () => props.user.phone_country_code || props.profile.phone_country_code
)
const displayInternalPhone = computed(
  () => props.user.internal_phone || props.profile.internal_phone
)
const displayOptMail = computed(() => props.user.opt_mail || props.profile.opt_mail)
const displayOrganizationExtra = computed(
  () => props.user.organization_extra || props.profile.organization_extra
)
const displayNameImage = computed(() => props.user.name_image || props.profile.name_image)
const displayMainFont = computed(() => props.user.main_font || props.profile.main_font)
const displayNameFont = computed(() => props.user.name_font || props.profile.name_font)
const displayMaxWidth = computed(() => props.user.max_width || props.profile.max_width)

// Phone link with country code
const phoneHref = computed(() => {
  if (!displayPhoneCountryCode.value || !displayPhone.value) return undefined
  return `tel:${displayPhoneCountryCode.value}${displayPhone.value.replace(/\s/g, '')}`
})

// Generate unique ID for images based on profile and source
const getImageId = (prefix: string, src: string) => {
  return `${prefix}-${props.profile.id}-${src.split('/').pop()}`
}
</script>

<template>
  <div
    :style="{
      fontFamily: `'${displayMainFont}', sans-serif`,
      fontSize: '10pt',
      marginTop: '10px',
      colorScheme: 'light',
      color: '#000000',
      backgroundColor: '#ffffff'
    }"
  >
    <div :style="{ width: displayMaxWidth ? `${displayMaxWidth}px` : 'fit-content' }">
      <!-- Header with avatar and name -->
      <div
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 16pt;
          margin-bottom: 10px;
        "
      >
        <img
          :id="getImageId('avatar', displayNameImage)"
          alt="👤"
          :src="displayNameImage"
          style="
            min-width: 55px;
            min-height: 55px;
            max-width: 55px;
            max-height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            overflow: hidden;
            border-radius: 50%;
            margin-right: 10px;
          "
          height="55"
          width="55"
        />
        <p
          :style="{
            margin: 'auto',
            marginLeft: '0',
            fontFamily: `'${displayNameFont}', sans-serif`
          }"
        >
          <b>{{ displayName }}</b>
        </p>
      </div>

      <!-- Color bar (decorative) -->
      <div
        aria-hidden="true"
        role="presentation"
        :style="{
          marginBottom: '10px',
          height: '4px',
          backgroundColor: profile.color,
          borderRadius: '10px'
        }"
      />

      <!-- Info section -->
      <div style="margin-bottom: 20px">
        <p style="margin: 0">
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
        </template>

        <!-- Contact: Just email -->
        <template v-else>
          <br />
          <a style="color: inherit; text-decoration: none" :href="`mailto:${displayMail}`">{{
            displayMail
          }}</a>
        </template>

        <!-- Organization extra -->
        <template v-if="displayOrganizationExtra">
          <br />
          <p style="margin: 0">
            <i>{{ displayOrganizationExtra }}</i>
          </p>
        </template>
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

    <!-- Sponsor text -->
    <div v-if="profile.sponsor_text" style="margin-bottom: 10px">
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

    <!-- Supporter text -->
    <div v-if="profile.supporter_text" style="margin-bottom: 10px">
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
