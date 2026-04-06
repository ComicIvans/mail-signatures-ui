type SeoValue = string | (() => string | null | undefined)
type SeoOgType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_status'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other'

interface UsePageSeoOptions {
  canonicalPath?: SeoValue
  keywords?: SeoValue
  ogImage?: SeoValue
  ogType?: SeoOgType | (() => SeoOgType | null | undefined)
  robots?: SeoValue
}

function resolveSeoValue(value: SeoValue | undefined): string | undefined {
  if (typeof value === 'function') {
    return value() ?? undefined
  }

  return value
}

function toCanonicalUrl(path: string, siteUrl: string): string | undefined {
  const normalizedSiteUrl = siteUrl.trim()

  if (!normalizedSiteUrl) {
    return undefined
  }

  try {
    return new URL(path, `${normalizedSiteUrl.replace(/\/$/, '')}/`).toString()
  } catch {
    return undefined
  }
}

export function usePageSeo(
  titleValue: SeoValue,
  descriptionValue: SeoValue,
  options: UsePageSeoOptions = {}
) {
  const route = useRoute()
  const siteConfig = useSiteConfig()

  const title = () => resolveSeoValue(titleValue)
  const description = () => resolveSeoValue(descriptionValue)
  const keywords = () => resolveSeoValue(options.keywords)
  const ogImage = () => resolveSeoValue(options.ogImage)
  const ogType = () => {
    if (typeof options.ogType === 'function') {
      return options.ogType() ?? 'website'
    }

    return options.ogType ?? 'website'
  }
  const robots = () => resolveSeoValue(options.robots) ?? 'index, follow'

  const canonicalUrl = computed(() => {
    const canonicalPath = resolveSeoValue(options.canonicalPath) ?? route.path
    return toCanonicalUrl(canonicalPath, String(siteConfig.url ?? ''))
  })

  useSeoMeta({
    title,
    description,
    keywords,
    robots,
    ogType,
    ogTitle: title,
    ogDescription: description,
    ogUrl: () => canonicalUrl.value,
    ogImage,
    twitterCard: () => (ogImage() ? 'summary_large_image' : 'summary'),
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage
  })

  useHead(() => ({
    link: canonicalUrl.value ? [{ rel: 'canonical', href: canonicalUrl.value }] : []
  }))

  useSchemaOrg([
    defineWebPage({
      '@id': () => (canonicalUrl.value ? `${canonicalUrl.value}#webpage` : undefined),
      name: title,
      description,
      url: () => canonicalUrl.value
    })
  ])
}
