import { z } from 'zod/v4'
import profilesData from '~/data/profiles.json'
import fieldsData from '~/data/fields.json'
import {
  type OrganizationConfig,
  type SignatureField,
  type UserSignatureData,
  OrganizationConfigSchema,
  SignatureFieldSchema
} from '~/types/signature'

const signatureFieldsCatalogSchema = z.object({
  required: z.array(SignatureFieldSchema),
  optional: z.array(SignatureFieldSchema)
})

const profileCatalog = z.array(OrganizationConfigSchema).parse(profilesData)
const fieldCatalog = signatureFieldsCatalogSchema.parse(fieldsData)

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const signatureTemplateLabels = {
  original: 'Original',
  'wide-logo': 'Logo ancho'
} as const

export function createEmptyUserSignatureData(): UserSignatureData {
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
    name_image: {
      image: '',
      alt: '',
      description: '',
      url: ''
    }
  }
}

export function useSignatureCatalog() {
  const profiles = ref<OrganizationConfig[]>(cloneJson(profileCatalog))

  return {
    profiles,
    requiredFields: fieldCatalog.required as SignatureField[],
    optionalFields: fieldCatalog.optional as SignatureField[]
  }
}
