import type { SignaturePreviewMode } from '~/types/signature'

function getImageDimension(value: string | null): string | null {
  if (!value) {
    return null
  }

  return /^\d+$/.test(value) ? `${value}px` : value
}

function resolveFallbackLabel(img: HTMLImageElement): string {
  const rawAlt = img.getAttribute('alt')?.trim() || ''
  const linkLabel = img.closest('a')?.getAttribute('aria-label')?.trim() || ''

  if (rawAlt) {
    return rawAlt
  }

  if (linkLabel) {
    const shortLabel = linkLabel.split(' ').slice(0, 2).join(' ')
    return shortLabel.length > 16 ? `${shortLabel.slice(0, 16)}...` : shortLabel
  }

  return rawAlt || 'Imagen'
}

function buildAltImageStyle(img: HTMLImageElement): string {
  const width =
    getImageDimension(img.getAttribute('width')) || img.style.width || `${img.width || 0}px`
  const height =
    getImageDimension(img.getAttribute('height')) || img.style.height || `${img.height || 0}px`

  const styleParts = [
    'display: inline-block',
    'vertical-align: middle',
    'box-sizing: border-box',
    'overflow: hidden',
    'padding: 2px 4px',
    'border: 1px solid #cbd5e1',
    'background: #ffffff',
    'color: #0f172a',
    'font-size: 12px',
    'font-weight: 600',
    'line-height: 1',
    "font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', Arial, sans-serif",
    'text-align: center',
    'white-space: nowrap'
  ]

  if (width && width !== '0px') {
    styleParts.push(`width: ${width}`)
  }

  if (height && height !== '0px') {
    styleParts.push(`height: ${height}`)
    styleParts.push(`line-height: ${height}`)
  } else {
    styleParts.push('min-height: 24px')
  }

  return styleParts.join('; ')
}

export function createSignatureAltReplacement(img: HTMLImageElement): HTMLSpanElement {
  const span = document.createElement('span')
  const alt = resolveFallbackLabel(img)

  span.textContent = alt
  span.setAttribute('role', 'img')
  span.setAttribute('aria-label', alt)
  span.setAttribute('style', buildAltImageStyle(img))

  return span
}

export function replacePreviewImagesWithAlt(root: ParentNode): void {
  for (const image of root.querySelectorAll('img')) {
    image.replaceWith(createSignatureAltReplacement(image))
  }
}

export function getSignaturePreviewHtml(
  signatureHtml: string,
  mode: SignaturePreviewMode = 'images'
): string {
  if (mode === 'images' || typeof DOMParser === 'undefined') {
    return signatureHtml
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(signatureHtml, 'text/html')

  replacePreviewImagesWithAlt(doc.body)

  return doc.body.innerHTML
}
