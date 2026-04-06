import type { OrganizationConfig, SignaturePreviewMode, UserSignatureData } from '~/types/signature'
import { generateSignatureHtml, extractSignatureDiv } from '~/composables/useSignatureTemplates'
import { createSignatureAltReplacement } from '~/composables/useSignaturePreview'

// =============================================================================
// Main composable export
// =============================================================================

export function useSignatureGenerator() {
  const toast = useToast()

  function buildBaseFilename(profileId: string, userName: string, outputName?: string): string {
    const normalizedOutputName = outputName?.trim()

    if (normalizedOutputName) {
      return normalizedOutputName.replace(/\.[^.]+$/, '')
    }

    const normalizedUserName = userName.trim().replace(/\s+/g, '-').toLowerCase()

    if (!normalizedUserName) {
      return `firma-${profileId}`
    }

    return `firma-${profileId}-${normalizedUserName}`
  }

  async function blobToDataUrl(blob: Blob): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
          return
        }

        reject(new Error('Could not encode blob as data URL.'))
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    })
  }

  async function waitForImageReady(image: HTMLImageElement): Promise<void> {
    // Images already in a terminal state should not wait for load/error events.
    if (image.complete) {
      return
    }

    if (typeof image.decode === 'function') {
      try {
        await image.decode()
        if (image.naturalWidth > 0) {
          return
        }
      } catch {
        // Fall back to load/error listeners.
      }
    }

    await new Promise<void>((resolve) => {
      let settled = false

      const finish = () => {
        if (settled) {
          return
        }

        settled = true
        image.removeEventListener('load', finish)
        image.removeEventListener('error', finish)
        clearTimeout(timeout)
        resolve()
      }

      const timeout = window.setTimeout(finish, 4000)

      image.addEventListener('load', finish)
      image.addEventListener('error', finish)
    })
  }

  async function inlineImagesForExport(
    container: HTMLElement,
    mode: SignaturePreviewMode
  ): Promise<void> {
    const images = Array.from(container.querySelectorAll('img'))

    await Promise.all(
      images.map(async (image) => {
        const src = image.getAttribute('src')

        if (!src) {
          return
        }

        if (!src.startsWith('data:')) {
          try {
            const response = await fetch(src, {
              mode: 'cors',
              credentials: 'omit'
            })

            if (!response.ok) {
              throw new Error(`Could not fetch image: ${src}`)
            }

            const dataUrl = await blobToDataUrl(await response.blob())
            image.setAttribute('src', dataUrl)
          } catch {
            if (mode === 'alt') {
              image.replaceWith(createSignatureAltReplacement(image))
              return
            }

            throw new Error(
              `No se pudo cargar una imagen externa para el JPG. Comprueba que la URL sea accesible y permita CORS: ${src}`
            )
          }
        }

        await waitForImageReady(image)

        if (image.naturalWidth === 0 || image.naturalHeight === 0) {
          if (mode === 'alt' && image.isConnected) {
            image.replaceWith(createSignatureAltReplacement(image))
            return
          }

          throw new Error(`Una imagen externa no terminó de cargarse para el JPG: ${src}`)
        }
      })
    )
  }

  async function loadRasterizedSvg(svgMarkup: string): Promise<HTMLImageElement> {
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    try {
      const image = new Image()
      image.decoding = 'sync'
      image.src = svgUrl

      await waitForImageReady(image)

      if (image.naturalWidth === 0 || image.naturalHeight === 0) {
        throw new Error('Could not rasterize preview SVG.')
      }

      return image
    } catch (error) {
      URL.revokeObjectURL(svgUrl)
      throw error
    }
  }

  async function renderPreviewToCanvas(
    wrapper: HTMLElement,
    width: number,
    height: number
  ): Promise<HTMLCanvasElement> {
    const serializedWrapper = new XMLSerializer().serializeToString(wrapper)
    const svgMarkup = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
      `<foreignObject width="100%" height="100%">${serializedWrapper}</foreignObject>`,
      '</svg>'
    ].join('')
    const rasterizedSvg = await loadRasterizedSvg(svgMarkup)
    const scale = 2
    const canvas = document.createElement('canvas')

    canvas.width = Math.ceil(width * scale)
    canvas.height = Math.ceil(height * scale)

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Could not create the JPG export canvas.')
    }

    try {
      context.scale(scale, scale)
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)
      context.drawImage(rasterizedSvg, 0, 0, width, height)
    } finally {
      URL.revokeObjectURL(rasterizedSvg.src)
    }

    return canvas
  }

  async function canvasToJpegBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    const jpegBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    })

    if (!jpegBlob) {
      throw new Error('Could not generate the JPG file.')
    }

    return jpegBlob
  }

  async function renderPreviewJpegBlob(
    previewElement: HTMLElement,
    mode: SignaturePreviewMode
  ): Promise<Blob> {
    const previewRect = previewElement.getBoundingClientRect()
    const clonedPreview = previewElement.cloneNode(true) as HTMLElement

    if (previewRect.width > 0) {
      clonedPreview.style.width = `${Math.ceil(previewRect.width)}px`
    }

    clonedPreview.style.minWidth = '0'
    clonedPreview.style.display = 'inline-block'

    const measurementHost = document.createElement('div')
    const wrapper = document.createElement('div')

    measurementHost.setAttribute(
      'style',
      ['position: fixed', 'left: -10000px', 'top: 0', 'pointer-events: none', 'opacity: 0'].join(
        '; '
      )
    )
    wrapper.setAttribute(
      'style',
      [
        'display: inline-block',
        'background: #ffffff',
        'padding: 24px',
        'box-sizing: border-box',
        'color: #0f172a'
      ].join('; ')
    )
    wrapper.setAttribute('data-signature-export', 'preview')
    wrapper.appendChild(clonedPreview)
    measurementHost.appendChild(wrapper)

    document.body.appendChild(measurementHost)

    try {
      await inlineImagesForExport(wrapper, mode)
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })

      const width = Math.ceil(wrapper.scrollWidth)
      const height = Math.ceil(wrapper.scrollHeight)

      if (width === 0 || height === 0) {
        throw new Error('Preview export has no measurable size.')
      }

      const canvas = await renderPreviewToCanvas(wrapper, width, height)
      return await canvasToJpegBlob(canvas)
    } finally {
      if (measurementHost.isConnected) {
        document.body.removeChild(measurementHost)
      }
    }
  }

  function triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function generateHtml(
    user: UserSignatureData,
    profile: OrganizationConfig,
    enabledOptionalFields?: Set<string>
  ): string {
    return generateSignatureHtml(user, profile, enabledOptionalFields)
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
    const filename = `${buildBaseFilename(profileId, userName, outputName)}.html`

    triggerDownload(blob, filename)

    toast.add({
      title: 'Descarga iniciada',
      description: 'El archivo HTML se está descargando.',
      icon: 'i-lucide-download',
      color: 'success'
    })
  }

  async function downloadPreviewJpg(
    previewElement: HTMLElement | null,
    profileId: string,
    userName: string,
    mode: SignaturePreviewMode,
    outputName?: string
  ): Promise<boolean> {
    if (!previewElement) {
      toast.add({
        title: 'Error',
        description: 'No se encontró la vista previa para generar el JPG.',
        icon: 'i-lucide-x',
        color: 'error'
      })

      return false
    }

    try {
      const jpegBlob = await renderPreviewJpegBlob(previewElement, mode)
      const filenameSuffix = mode === 'images' ? 'vista-imagenes' : 'vista-alt'
      const filename = `${buildBaseFilename(profileId, userName, outputName)}-${filenameSuffix}.jpg`

      triggerDownload(jpegBlob, filename)

      toast.add({
        title: 'Descarga iniciada',
        description:
          mode === 'images'
            ? 'La vista previa con imágenes se está descargando en JPG.'
            : 'La vista previa con texto alternativo se está descargando en JPG.',
        icon: 'i-lucide-image-down',
        color: 'success'
      })

      return true
    } catch (error) {
      const description =
        error instanceof Error && error.message
          ? error.message
          : 'No se pudo generar la imagen JPG de la vista previa.'

      toast.add({
        title: 'Error',
        description,
        icon: 'i-lucide-x',
        color: 'error'
      })

      return false
    }
  }

  return {
    generateHtml,
    copyToClipboard,
    downloadHtml,
    downloadPreviewJpg
  }
}
