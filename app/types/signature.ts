import { z } from 'zod/v4'

// ============================================
// Zod Schemas for validation
// ============================================

// Social link schema
export const SocialLinkSchema = z.object({
  url: z.url(),
  image: z.url(),
  alt: z.string()
})

// Sponsor/Supporter schema
export const SponsorSchema = z.object({
  url: z.url(),
  image: z.url(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional()
})

// Organization/Profile configuration schema
export const OrganizationConfigSchema = z.object({
  id: z.string(),
  template: z.enum(['original', 'wide-logo']),
  main_font: z.string(),
  name_font: z.string(),
  name_image: z.url(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  organization: z.string(),
  organization_extra: z.string().optional(),
  phone: z.string().optional(),
  phone_country_code: z.string().optional(),
  internal_phone: z.string().optional(),
  opt_mail: z.email().optional(),
  max_width: z.number().optional(),
  links: z.array(SocialLinkSchema).optional().default([]),
  sponsor_text: z.string().optional(),
  sponsors: z.array(SponsorSchema).optional(),
  supporter_text: z.string().optional(),
  supporters: z.array(SponsorSchema).optional(),
  footer_address: z.string().optional(),
  footer_text: z.string().optional()
})

// Signature field definition schema
export const SignatureFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'tel', 'url']),
  placeholder: z.string().optional(),
  icon: z.string().optional(),
  required: z.boolean().default(false),
  defaultFromProfile: z.string().optional() // Profile field to use as default
})

// User signature data schema (for form validation)
export const UserSignatureDataSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  position: z.string().min(1, 'El puesto es obligatorio'),
  mail: z.email('Email inválido'),
  output: z.string().optional(),
  phone: z.string().optional(),
  phone_country_code: z.string().optional(),
  internal_phone: z.string().optional(),
  opt_mail: z.email().optional().or(z.literal('')),
  organization_extra: z.string().optional(),
  main_font: z.string().optional(),
  name_font: z.string().optional(),
  max_width: z.number().optional(),
  name_image: z.url().optional().or(z.literal(''))
})

// ============================================
// TypeScript types (inferred from schemas)
// ============================================

export type SocialLink = z.infer<typeof SocialLinkSchema>
export type Sponsor = z.infer<typeof SponsorSchema>
export type OrganizationConfig = z.infer<typeof OrganizationConfigSchema>
export type SignatureField = z.infer<typeof SignatureFieldSchema>
export type UserSignatureData = z.infer<typeof UserSignatureDataSchema>

// ============================================
// Helper types
// ============================================

// Complete signature data (user data + profile config)
export interface SignatureContext {
  user: UserSignatureData
  profile: OrganizationConfig
}

// Validation result
export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: z.ZodError
}
