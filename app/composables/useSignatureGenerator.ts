import type { OrganizationConfig, UserSignatureData } from '~/types/signature'
import { generateSignatureHtml, extractSignatureDiv } from './useSignatureTemplates'

// =============================================================================
// Main composable export
// =============================================================================

export function useSignatureGenerator() {
  const toast = useToast()

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
    copyToClipboard,
    downloadHtml
  }
}
