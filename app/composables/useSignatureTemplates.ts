import type {
  OrganizationConfig,
  UserSignatureData,
  LinkItem,
  SponsorItem
} from '~/types/signature'

// =============================================================================
// Types for template data
// =============================================================================

export interface TemplateData {
  name: string
  position: string
  mail: string
  phone?: string
  phoneCountryCode?: string
  internalPhone?: string
  optMail?: string
  organizationExtra?: string
  nameImage: string
  nameImageAlt?: string
  nameImageDescription?: string
  nameImageUrl?: string
  mainFont: string
  nameFont: string
  color: string
  organization: string
  maxWidth?: number
  date: string
  links?: LinkItem[]
  sponsors?: SponsorItem[]
  supporters?: SponsorItem[]
  sponsorText?: string
  supporterText?: string
  footerAddress?: string
  footerText?: string
}

// =============================================================================
// Build template data from user input and profile config
// =============================================================================

export function buildTemplateData(
  user: UserSignatureData,
  profile: OrganizationConfig,
  enabledOptionalFields?: Set<string>
): TemplateData {
  // Helper to get field value with smart fallback
  const getOptionalValue = (
    fieldId: string,
    userValue?: string,
    profileValue?: string
  ): string | undefined => {
    if (enabledOptionalFields?.has(fieldId)) {
      return userValue || undefined
    }
    return userValue || profileValue
  }

  // Extract name_image fields from profile (always an object)
  const profileNameImage = profile.name_image
  const profileNameImageUrl = profileNameImage.image
  const profileNameImageAlt = profileNameImage.alt
  const profileNameImageDescription = profileNameImage.description
  const profileNameImageLinkUrl = profileNameImage.url

  // Get final name image value (user can override URL only)
  const nameImageUrl =
    getOptionalValue('name_image', user.name_image, profileNameImageUrl) || profileNameImageUrl

  return {
    name: user.name || 'Nombre',
    position: user.position || 'Puesto',
    mail: user.mail || 'email@ejemplo.com',
    phone: getOptionalValue('phone', user.phone, profile.phone),
    phoneCountryCode: getOptionalValue(
      'phone_country_code',
      user.phone_country_code,
      profile.phone_country_code
    ),
    internalPhone: getOptionalValue('internal_phone', user.internal_phone, profile.internal_phone),
    optMail: getOptionalValue('opt_mail', user.opt_mail, profile.opt_mail),
    organizationExtra: getOptionalValue(
      'organization_extra',
      user.organization_extra,
      profile.organization_extra
    ),
    nameImage: nameImageUrl,
    nameImageAlt: profileNameImageAlt,
    nameImageDescription: profileNameImageDescription,
    nameImageUrl: profileNameImageLinkUrl,
    mainFont: getOptionalValue('main_font', user.main_font, profile.main_font) || 'Arial',
    nameFont: getOptionalValue('name_font', user.name_font, profile.name_font) || 'Arial',
    color: profile.color,
    organization: profile.organization,
    maxWidth:
      user.max_width || (enabledOptionalFields?.has('max_width') ? undefined : profile.max_width),
    date: (() => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    })(),
    links: profile.links,
    sponsors: profile.sponsors,
    supporters: profile.supporters,
    sponsorText: profile.sponsor_text,
    supporterText: profile.supporter_text,
    footerAddress: profile.footer_address,
    footerText: profile.footer_text
  }
}

// =============================================================================
// Reusable HTML generation functions (matching Jinja2 macros exactly)
// =============================================================================

/**
 * Generates a social link element (matches social_link macro)
 */
function generateSocialLink(link: LinkItem, size: number = 35): string {
  const hasAlt = link.alt !== undefined && link.alt !== ''
  const hasDesc = link.description !== undefined && link.description !== ''

  const titleAttr = hasDesc ? ` title="${link.description}"` : ''
  const ariaLabelAttr = hasDesc ? ` aria-label="${link.description}"` : ''
  const altAttr = hasAlt ? ` alt="${link.alt}"` : ''

  return `<a href="${link.url}"${titleAttr}${ariaLabelAttr} style="border-radius: 50%; color: inherit; text-decoration: none; margin-right: 5px; min-width: ${size}px; min-height: ${size}px; display: inline-block; text-align: center; vertical-align: middle; background-color: white; font-weight: bold; font-size: 14pt"><img${altAttr} aria-hidden="true" moz-do-not-send="true" style="font-size: 16pt; max-width: ${size}px; max-height: ${size}px; display: block" height="${size}" width="${size}" src="${link.image}" /></a>`
}

/**
 * Generates social links bar (matches social_links_bar macro)
 */
function generateSocialLinksBar(links?: LinkItem[], _maxWidth?: number): string {
  if (!links || links.length === 0) return ''

  // All links on separate lines with proper indentation (20 spaces for link content)
  const linksHtml = links.map((link) => generateSocialLink(link)).join('\n                    ')

  // 18 spaces before <div> to match the </table> indentation on same line
  return `\n                  <div style="margin-bottom: 20px">
                    ${linksHtml}
                  </div>`
}

/**
 * Generates a sponsor/supporter image (matches sponsor_image macro)
 */
function generateSponsorImage(item: SponsorItem, maxWidth?: number): string {
  const hasAlt = item.alt !== undefined && item.alt !== ''
  const hasDesc = item.description !== undefined && item.description !== ''

  const altAttr = hasAlt ? ` alt="${item.alt}"` : ''
  const titleAttr = hasDesc ? ` title="${item.description}"` : ''
  const ariaLabelAttr = hasDesc ? ` aria-label="${item.description}"` : ''

  const maxWidthCss = maxWidth ? `${maxWidth}px` : 'none'
  const widthCss = item.width ? `${item.width}px` : 'auto'
  const heightCss = item.height ? `${item.height}px` : 'auto'
  const widthAttr = item.width ? ` width="${item.width}"` : ''
  const heightAttr = item.height ? ` height="${item.height}"` : ''

  const imgStyle = `max-width: ${maxWidthCss}; width: ${widthCss}; height: ${heightCss}; display: block`

  if (item.url) {
    return `<a href="${item.url}"${titleAttr}${ariaLabelAttr} style="color: inherit; text-decoration: none; display: inline-block; margin-right: 5px; margin-bottom: 5px"><img${altAttr} aria-hidden="true" moz-do-not-send="true" style="${imgStyle}"${widthAttr}${heightAttr} src="${item.image}" /></a>`
  } else {
    return `<span style="display: inline-block; margin-right: 5px; margin-bottom: 5px"><img${altAttr} aria-hidden="true" moz-do-not-send="true" style="${imgStyle}"${widthAttr}${heightAttr} src="${item.image}" /></span>`
  }
}

/**
 * Generates sponsors/supporters section (matches sponsors_section macro)
 */
function generateSponsorsSection(
  text?: string,
  items?: SponsorItem[],
  color?: string,
  maxWidth?: number,
  withBar: boolean = false
): string {
  if (!items || items.length === 0) return ''

  let html = ''

  if (text) {
    if (withBar) {
      html += `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px">
                    <tr>
                      <td style="width: 4px; background-color: ${color?.toLowerCase()}; border-radius: 10px"></td>
                      <td style="width: 10px"></td>
                      <td><p style="margin: 0; font-size: 12pt">${text}</p></td>
                    </tr>
                  </table>`
    } else {
      html += `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px">
                    <tr>
                      <td><p style="margin: 0; font-size: 12pt">${text}</p></td>
                    </tr>
                  </table>`
    }
  }

  const maxWidthStyle = maxWidth ? `; max-width: ${maxWidth}px` : ''
  html += `
                  <div style="margin-bottom: 20px${maxWidthStyle}">
${items.map((item) => `                    ${generateSponsorImage(item, maxWidth)}`).join('\n')}
                  </div>`

  return html
}

/**
 * Generates footer section (matches footer macro)
 */
function generateFooter(
  footerAddress?: string,
  footerText?: string,
  color?: string,
  _maxWidth?: number
): string {
  if (!footerAddress && !footerText) return ''

  let html = `            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-size: 8pt">`

  if (footerAddress) {
    html += `
              <tr>
                <td><strong style="color: ${color?.toLowerCase()}">${footerAddress}</strong></td>
              </tr>`
  }

  if (footerText) {
    html += `
              <tr>
                <td>
                  <p style="color: dimgray; margin: 5px 0 0 0">${footerText}</p>
                </td>
              </tr>`
  }

  html += `
            </table>`

  return html
}

/**
 * Generates contact info (matches contact_info macro)
 */
function generateContactInfo(
  phone?: string,
  phoneCountryCode?: string,
  internalPhone?: string,
  mail?: string,
  optMail?: string
): string {
  if (phone) {
    const phoneLink = `<a style="color: inherit; text-decoration: none" href="tel:${phoneCountryCode}${phone.replace(/\s/g, '')}">${phone}</a>`
    const internalPhoneHtml = internalPhone ? `&nbsp;(${internalPhone})` : ''
    return `<p style="margin: 0">${phoneLink}${internalPhoneHtml}<strong>&nbsp;&nbsp;·&nbsp;&nbsp;</strong><a style="color: inherit; text-decoration: none" href="mailto:${mail}">${mail}</a></p>`
  } else if (optMail) {
    return `<p style="margin: 0"><a style="color: inherit; text-decoration: none" href="mailto:${mail}">${mail}</a><strong>&nbsp;&nbsp;·&nbsp;&nbsp;</strong><a style="color: inherit; text-decoration: none" href="mailto:${optMail}">${optMail}</a></p>`
  } else {
    return `<p style="margin: 0"><a style="color: inherit; text-decoration: none" href="mailto:${mail}">${mail}</a></p>`
  }
}

/**
 * Generates name image block (matches name_image_block macro)
 */
function generateNameImageBlock(
  nameImage: string,
  _organization: string,
  size: number = 55,
  rounded: boolean = true,
  wide: boolean = false,
  alt?: string,
  description?: string,
  url?: string
): string {
  // alt from profile or emoji fallback, description is for aria-label accessibility
  const imgAlt = alt || '👤'
  const ariaLabelAttr = description ? ` aria-label="${description}"` : ''

  let imgStyle: string
  let imgWidth: number
  let imgHeight: number

  if (wide) {
    imgStyle = 'min-width: 120px; min-height: 65px; display: block'
    imgWidth = 120
    imgHeight = 65
  } else {
    imgStyle = `width: ${size}px; height: ${size}px; display: block${rounded ? '; border-radius: 50%' : ''}`
    imgWidth = size
    imgHeight = size
  }

  const imgHtml = `<img alt="${imgAlt}"${ariaLabelAttr} role="img" moz-do-not-send="true" style="${imgStyle}" height="${imgHeight}" width="${imgWidth}" src="${nameImage}" />`

  // Wrap in link if URL is provided
  if (url) {
    return `<a href="${url}"${ariaLabelAttr} style="color: inherit; text-decoration: none">${imgHtml}</a>`
  }

  return imgHtml
}

// =============================================================================
// Full HTML document generation (matches _base.html.j2 structure)
// =============================================================================

function generateHtmlHead(date: string): string {
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="author" content="Iván Salido Cobo" />
    <meta name="github" content="https://github.com/ComicIvans/mail-signatures" />
    <meta name="last-modified" content="${date}" />
    <meta name="icons-source" content="https://tabler-icons.io/" />
    <title></title>
  </head>
  <body style="margin: 8px; padding: 0">`
}

function generateHtmlFooter(): string {
  return `
  </body>
</html>`
}

// =============================================================================
// Template: Original (matches original.html.j2)
// =============================================================================

export function generateOriginalTemplate(data: TemplateData): string {
  const maxWidthStyle = data.maxWidth ? `; max-width: ${data.maxWidth}px` : ''

  // Header block
  const headerHtml = `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px">
                    <tr>
                      <td style="vertical-align: middle; padding-right: 10px">
                        ${generateNameImageBlock(data.nameImage, data.organization, 55, true, false, data.nameImageAlt, data.nameImageDescription, data.nameImageUrl)}
                      </td>
                      <td style="vertical-align: middle; font-size: 16pt; font-family: '${data.nameFont}', sans-serif">
                        <strong>${data.name}</strong>
                      </td>
                    </tr>
                  </table>
                  <div style="height: 4px; background-color: ${data.color.toLowerCase()}; border-radius: 10px; margin-bottom: 10px" aria-hidden="true"></div>`

  // Content block
  const organizationExtraHtml = data.organizationExtra
    ? `
                        <br />
                        <p style="margin: 0"><em>${data.organizationExtra}</em></p>`
    : ''

  const contentHtml = `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px">
                    <tr>
                      <td>
                        <p style="margin: 0"><strong>${data.position}</strong></p>
                        <p style="margin: 0">${data.organization}</p>
                        <br />
                        ${generateContactInfo(data.phone, data.phoneCountryCode, data.internalPhone, data.mail, data.optMail)}${organizationExtraHtml}
                      </td>
                    </tr>
                  </table>`

  // Links
  const linksHtml = data.links?.length ? generateSocialLinksBar(data.links, data.maxWidth) : ''

  // Footer
  const footerHtml = generateFooter(data.footerAddress, data.footerText, data.color, data.maxWidth)

  return `${generateHtmlHead(data.date)}
    <div>
      <!--[if mso]>
        <style type="text/css">
          table {
            border-collapse: collapse;
          }
          td {
            padding: 0;
          }
        </style>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family: '${data.mainFont}', sans-serif; font-size: 10pt${maxWidthStyle}; margin-top: 10px">
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: fit-content${maxWidthStyle}">
              <tr>
                <td>${headerHtml}${contentHtml}${linksHtml}
                </td>
              </tr>
            </table>
${footerHtml}
          </td>
        </tr>
      </table>
    </div>${generateHtmlFooter()}`
}

// =============================================================================
// Template: Wide Logo (matches wide-logo.html.j2)
// =============================================================================

export function generateWideLogoTemplate(data: TemplateData): string {
  const maxWidthStyle = data.maxWidth ? `; max-width: ${data.maxWidth}px` : ''

  // Header block
  const headerHtml = `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px">
                    <tr>
                      <td>
                        ${generateNameImageBlock(data.nameImage, data.organization, 55, false, true, data.nameImageAlt, data.nameImageDescription, data.nameImageUrl)}
                      </td>
                    </tr>
                  </table>`

  // Content block with vertical bar
  const organizationExtraHtml = data.organizationExtra
    ? `
                        <br />
                        <p style="margin: 0"><em>${data.organizationExtra}</em></p>`
    : ''

  const contentHtml = `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px">
                    <tr>
                      <td style="width: 4px; background-color: ${data.color.toLowerCase()}; border-radius: 10px" aria-hidden="true"></td>
                      <td style="width: 10px"></td>
                      <td style="vertical-align: top">
                        <p style="margin: 0; font-family: '${data.nameFont}', sans-serif; font-size: 16pt"><strong>${data.name}</strong></p>
                        <p style="margin: 0; font-size: 12pt"><strong>${data.position}</strong></p>
                        <p style="margin: 0">${data.organization}</p>
                        <br />
                        ${generateContactInfo(data.phone, data.phoneCountryCode, data.internalPhone, data.mail, data.optMail)}${organizationExtraHtml}
                      </td>
                    </tr>
                  </table>`

  // Links
  const linksHtml = data.links?.length ? generateSocialLinksBar(data.links, data.maxWidth) : ''

  // Sponsors (with bar for wide-logo template)
  const sponsorsHtml = generateSponsorsSection(
    data.sponsorText,
    data.sponsors,
    data.color,
    data.maxWidth,
    true
  )

  // Supporters (with bar for wide-logo template)
  const supportersHtml = generateSponsorsSection(
    data.supporterText,
    data.supporters,
    data.color,
    data.maxWidth,
    true
  )

  return `${generateHtmlHead(data.date)}
    <div>
      <!--[if mso]>
        <style type="text/css">
          table {
            border-collapse: collapse;
          }
          td {
            padding: 0;
          }
        </style>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-family: '${data.mainFont}', sans-serif; font-size: 10pt${maxWidthStyle}">
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: fit-content${maxWidthStyle}">
              <tr>
                <td>${headerHtml}${contentHtml}${linksHtml}${sponsorsHtml}${supportersHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>${generateHtmlFooter()}`
}

// =============================================================================
// Generate HTML for any template
// =============================================================================

export function generateSignatureHtml(
  user: UserSignatureData,
  profile: OrganizationConfig,
  enabledOptionalFields?: Set<string>
): string {
  const data = buildTemplateData(user, profile, enabledOptionalFields)

  switch (profile.template) {
    case 'wide-logo':
      return generateWideLogoTemplate(data)
    case 'original':
    default:
      return generateOriginalTemplate(data)
  }
}

// =============================================================================
// Extract just the signature div (for clipboard/email client)
// =============================================================================

export function extractSignatureDiv(html: string): string {
  // Find the main div inside body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (!bodyMatch?.[1]) return html

  const bodyContent = bodyMatch[1].trim()
  return bodyContent
}
