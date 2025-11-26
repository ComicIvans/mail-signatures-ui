import type { OrganizationConfig, UserSignatureData } from '~/types/signature'

// =============================================================================
// Types for template data
// =============================================================================

interface TemplateData {
  name: string
  position: string
  mail: string
  phone?: string
  phoneCountryCode?: string
  internalPhone?: string
  optMail?: string
  organizationExtra?: string
  nameImage: string
  mainFont: string
  nameFont: string
  maxWidth?: number
  date: string
  profile: OrganizationConfig
}

// =============================================================================
// Helper functions for generating reusable HTML sections
// =============================================================================

function buildTemplateData(user: UserSignatureData, profile: OrganizationConfig): TemplateData {
  return {
    name: user.name || 'Nombre',
    position: user.position || 'Puesto',
    mail: user.mail || 'email@ejemplo.com',
    phone: user.phone || profile.phone,
    phoneCountryCode: user.phone_country_code || profile.phone_country_code,
    internalPhone: user.internal_phone || profile.internal_phone,
    optMail: user.opt_mail || profile.opt_mail,
    organizationExtra: user.organization_extra || profile.organization_extra,
    nameImage: user.name_image || profile.name_image,
    mainFont: user.main_font || profile.main_font,
    nameFont: user.name_font || profile.name_font,
    maxWidth: user.max_width || profile.max_width,
    date: new Date().toISOString().split('T')[0] || '',
    profile
  }
}

function generateHtmlHead(date: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="author" content="Iván Salido Cobo" />
    <meta name="github" content="https://github.com/ComicIvans/mail-signatures" />
    <meta name="last-modified" content="${date}" />
    <meta name="icons-source" content="https://tabler-icons.io/" />
    <title></title>
  </head>`
}

function generateContactHtml(data: TemplateData): string {
  const { phone, phoneCountryCode, internalPhone, mail, optMail } = data

  if (phone) {
    const phoneLink = phoneCountryCode
      ? `<a style="color: inherit; text-decoration: none" href="tel:${phoneCountryCode}${phone.replace(/\s/g, '')}">${phone}</a>`
      : phone
    const internalPhoneHtml = internalPhone ? `&nbsp;(${internalPhone})` : ''
    return `
            <br />
            <p style="margin: 0">
              ${phoneLink}${internalPhoneHtml}
              <b>&nbsp;&nbsp;·&nbsp;&nbsp;</b><a style="color: inherit; text-decoration: none" href="mailto:${mail}">${mail}</a>
            </p>`
  }

  if (optMail) {
    return `
            <br />
            <a style="color: inherit; text-decoration: none" href="mailto:${mail}">${mail}</a><b>&nbsp;&nbsp;·&nbsp;&nbsp;</b><a style="color: inherit; text-decoration: none" href="mailto:${optMail}">${optMail}</a>
            <br />`
  }

  return `
            <br />
            <a style="color: inherit; text-decoration: none" href="mailto:${mail}">${mail}</a>
            <br />`
}

function generateOrganizationExtraHtml(organizationExtra?: string): string {
  if (!organizationExtra) return ''
  return `
            <br />
            <p style="margin: 0">
              <i>${organizationExtra}</i>
            </p>`
}

function generateLinksHtml(profile: OrganizationConfig): string {
  if (!profile.links || profile.links.length === 0) return ''

  return `
        <div style="display: flex; align-items: center; margin-bottom: 20px">
          ${profile.links
            .map(
              (link) => `
          <a href="${link.url}" style="border-radius: 50%; color: inherit; text-decoration: none; margin-right: 5px; min-width: 35px; min-height: 35px; display: flex; align-items: center; justify-content: center; background-color: white; font-weight: bold; font-size: 14pt">
            <img alt="${link.alt}" moz-do-not-send="true" style="font-size: 16pt; max-width: 35px; max-height: 35px; display: flex; align-items: center; justify-content: center" height="35" width="35" src="${link.image}" />
          </a>`
            )
            .join('')}
        </div>`
}

function generateSponsorTextHtml(
  profile: OrganizationConfig,
  withColorBar: boolean = false
): string {
  if (!profile.sponsor_text) return ''

  if (withColorBar) {
    return `
      <div style="display: flex; flex-direction: row; margin-bottom: 10px">
        <div style="margin-right: 10px; width: 4px; min-height: max-content; background-color: ${profile.color}; border-radius: 10px"></div>
        <p style="margin: 0; font-size: 12pt;">${profile.sponsor_text}</p>
      </div>`
  }

  return `
      <div style="margin-bottom: 10px">
        <p style="margin: 0; font-size: 12pt;">${profile.sponsor_text}</p>
      </div>`
}

function generateSponsorsHtml(profile: OrganizationConfig, maxWidth?: number): string {
  if (!profile.sponsors || profile.sponsors.length === 0) return ''

  return `
      <div style="display: flex; flex-direction: row; gap: 5px; flex-wrap: wrap; margin-bottom: 20px">
        ${profile.sponsors
          .map((sponsor) => {
            const widthStyle = sponsor.width ? `${sponsor.width}px` : 'auto'
            const heightStyle = sponsor.height ? `${sponsor.height}px` : 'auto'
            const maxWidthStyle = maxWidth ? `${maxWidth}px` : 'none'
            const widthAttr = sponsor.width ? `width="${sponsor.width}"` : ''
            const heightAttr = sponsor.height ? `height="${sponsor.height}"` : ''
            return `
        <a href="${sponsor.url}" style="color: inherit; text-decoration: none">
          <img alt="${sponsor.alt}" moz-do-not-send="true" style="max-width: ${maxWidthStyle}; width: ${widthStyle}; height: ${heightStyle}; display: flex; align-items: center; justify-content: center" ${widthAttr} ${heightAttr} src="${sponsor.image}" />
        </a>&nbsp;`
          })
          .join('')}
      </div>`
}

function generateSupporterTextHtml(
  profile: OrganizationConfig,
  withColorBar: boolean = false
): string {
  if (!profile.supporter_text) return ''

  if (withColorBar) {
    return `
      <div style="display: flex; flex-direction: row; margin-bottom: 10px">
        <div style="margin-right: 10px; width: 4px; min-height: max-content; background-color: ${profile.color}; border-radius: 10px"></div>
        <p style="margin: 0; font-size: 12pt;">${profile.supporter_text}</p>
      </div>`
  }

  return `
      <div style="margin-bottom: 10px">
        <p style="margin: 0; font-size: 12pt;">${profile.supporter_text}</p>
      </div>`
}

function generateSupportersHtml(profile: OrganizationConfig, maxWidth?: number): string {
  if (!profile.supporters || profile.supporters.length === 0) return ''

  return `
      <div style="display: flex; flex-direction: row; gap: 5px; flex-wrap: wrap; margin-bottom: 20px">
        ${profile.supporters
          .map((supporter) => {
            const widthStyle = supporter.width ? `${supporter.width}px` : 'auto'
            const heightStyle = supporter.height ? `${supporter.height}px` : 'auto'
            const maxWidthStyle = maxWidth ? `${maxWidth}px` : 'none'
            const widthAttr = supporter.width ? `width="${supporter.width}"` : ''
            const heightAttr = supporter.height ? `height="${supporter.height}"` : ''
            return `
        <a href="${supporter.url}" style="color: inherit; text-decoration: none">
          <img alt="${supporter.alt}" moz-do-not-send="true" style="max-width: ${maxWidthStyle}; width: ${widthStyle}; height: ${heightStyle}; display: flex; align-items: center; justify-content: center" ${widthAttr} ${heightAttr} src="${supporter.image}" />
        </a>&nbsp;`
          })
          .join('')}
      </div>`
}

function generateFooterHtml(profile: OrganizationConfig): string {
  if (!profile.footer_address && !profile.footer_text) return ''

  let html = `
      <footer style="font-size: 8pt">`

  if (profile.footer_address) {
    html += `
        <b style="color: ${profile.color}">${profile.footer_address}</b>`
  }

  if (profile.footer_text) {
    html += `
        <p style="color: dimgray">${profile.footer_text}</p>`
  }

  html += `
      </footer>`

  return html
}

// =============================================================================
// Template: Original (avatar circular + nombre al lado, barra horizontal)
// =============================================================================

function generateOriginalHtml(user: UserSignatureData, profile: OrganizationConfig): string {
  const data = buildTemplateData(user, profile)
  const maxWidthStyle = data.maxWidth ? `${data.maxWidth}px` : 'fit-content'

  return `${generateHtmlHead(data.date)}
  <body>
    <div style="font-family: '${data.mainFont}', sans-serif; font-size: 10pt; margin-top: 10px">
      <div style="width: ${maxWidthStyle}">
        <div style="display: flex; flex-direction: row; align-items: center; font-size: 16pt; margin-bottom: 10px">
          <img alt="👤" moz-do-not-send="true" style="min-width: 55px; min-height: 55px; max-width: 55px; max-height: 55px; display: flex; align-items: center; justify-content: center; color: white; overflow: hidden; border-radius: 50%; margin-right: 10px" height="55" width="55" src="${data.nameImage}" />
          <p style="margin: auto; margin-left: 0; font-family: '${data.nameFont}', sans-serif">
            <b>${data.name}</b>
          </p>
        </div>
        <div style="margin-bottom: 10px; height: 4px; background-color: ${profile.color}; border-radius: 10px"></div>
        <div style="margin-bottom: 20px">
          <p style="margin: 0">
            <b>${data.position}</b>
          </p>
          <p style="margin: 0">${profile.organization}</p>${generateContactHtml(data)}${generateOrganizationExtraHtml(data.organizationExtra)}
        </div>
${generateLinksHtml(profile)}
      </div>${generateSponsorTextHtml(profile)}${generateSponsorsHtml(profile, data.maxWidth)}${generateSupporterTextHtml(profile)}${generateSupportersHtml(profile, data.maxWidth)}${generateFooterHtml(profile)}
    </div>
  </body>
</html>`
}

// =============================================================================
// Template: Wide/Ancha (logo ancho arriba, barra vertical al lado del contenido)
// =============================================================================

function generateWideLogoHtml(user: UserSignatureData, profile: OrganizationConfig): string {
  const data = buildTemplateData(user, profile)
  const maxWidthStyle = data.maxWidth ? `${data.maxWidth}px` : 'fit-content'
  const imageMaxWidth = data.maxWidth ? `max-width: ${data.maxWidth}px;` : ''

  return `${generateHtmlHead(data.date)}
  <body>
    <div style="font-family: '${data.mainFont}', sans-serif; font-size: 10pt">
      <div style="width: ${maxWidthStyle}">
        <img alt="👤" moz-do-not-send="true" style="min-width: 120px; min-height: 65px; ${imageMaxWidth} display: flex; align-items: center; justify-content: center; color: white; overflow: hidden" width="120" src="${data.nameImage}" />
        <div style="display: flex; flex-direction: row; margin-top: 10px; margin-bottom: 20px">
          <div style="margin-right: 10px; width: 4px; min-height: max-content; background-color: ${profile.color}; border-radius: 10px"></div>
          <div>
            <p style="margin: auto; margin-left: 0; font-family: '${data.nameFont}', sans-serif; font-size: 16pt">
              <b>${data.name}</b>
            </p>
            <p style="margin: 0; font-size: 12pt">
              <b>${data.position}</b>
            </p>
            <p style="margin: 0">${profile.organization}</p>${generateContactHtml(data)}${generateOrganizationExtraHtml(data.organizationExtra)}
          </div>
        </div>
${generateLinksHtml(profile)}
      </div>${generateSponsorTextHtml(profile, true)}${generateSponsorsHtml(profile, data.maxWidth)}${generateSupporterTextHtml(profile, true)}${generateSupportersHtml(profile, data.maxWidth)}${generateFooterHtml(profile)}
    </div>
  </body>
</html>`
}

// =============================================================================
// Main composable export
// =============================================================================

export function useSignatureGenerator() {
  const toast = useToast()

  function generateHtml(user: UserSignatureData, profile: OrganizationConfig): string {
    switch (profile.template) {
      case 'wide-logo':
        return generateWideLogoHtml(user, profile)
      case 'original':
      default:
        return generateOriginalHtml(user, profile)
    }
  }

  /**
   * Extracts only the signature div from the full HTML (excludes DOCTYPE, html, head, body)
   * This is what users need to paste into email clients
   */
  function extractSignatureDiv(html: string): string {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const signatureDiv = doc.body.querySelector('div')
    return signatureDiv?.outerHTML || html
  }

  async function copyToClipboard(html: string): Promise<boolean> {
    try {
      const signatureHtml = extractSignatureDiv(html)
      await navigator.clipboard.writeText(signatureHtml)
      toast.add({
        title: 'HTML copiado',
        description: 'La firma HTML ha sido copiada al portapapeles.',
        icon: 'i-lucide-check',
        color: 'success'
      })
      return true
    } catch {
      toast.add({
        title: 'Error',
        description: 'No se pudo copiar al portapapeles.',
        icon: 'i-lucide-x',
        color: 'error'
      })
      return false
    }
  }

  function downloadHtml(
    html: string,
    profileId: string,
    userName: string,
    outputName?: string
  ): void {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    const filename =
      outputName || `firma-${profileId}-${userName.replace(/\s+/g, '-').toLowerCase()}.html`
    a.download = filename

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.add({
      title: 'Descarga iniciada',
      description: 'El archivo HTML se está descargando.',
      icon: 'i-lucide-download',
      color: 'success'
    })
  }

  return {
    generateHtml,
    generateOriginalHtml,
    generateWideLogoHtml,
    copyToClipboard,
    downloadHtml
  }
}
