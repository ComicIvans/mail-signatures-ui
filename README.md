# Generador de Firmas de Correo Electrónico

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20v4-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Aplicación web para generar firmas de correo electrónico HTML profesionales y personalizadas para distintas organizaciones.

Este proyecto es una evolución del generador original [mail-signatures](https://github.com/ComicIvans/mail-signatures), reconstruido con Nuxt 4 y Nuxt UI para ofrecer una experiencia más mantenible y consistente.

- [Demo en vivo](https://firmas.wupp.dev/)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png">
  <img alt="Ejemplo de firma de correo electrónico" src="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png">
</picture>

## Características

- Generador individual con vista previa en tiempo real.
- Perfiles preconfigurados para varias organizaciones.
- Activación dinámica de campos opcionales.
- Dos plantillas de firma disponibles: `original` y `wide-logo`.
- Copia del HTML o descarga del archivo final.
- Descarga de vista previa en JPG con modo de imágenes o texto alternativo.
- Modal de edición y exportación de perfiles.
- Guía de uso para Thunderbird, Gmail y Webmail.
- Interfaz responsive con modo claro/oscuro.
- Validación con Zod y SEO base con `@nuxtjs/seo`.

## Tecnologías

- [Nuxt 4](https://nuxt.com/)
- [Nuxt UI v4](https://ui.nuxt.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [@nuxtjs/seo](https://nuxtseo.com/)
- [@formkit/auto-animate](https://auto-animate.formkit.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Instalación

Asegúrate de tener [pnpm](https://pnpm.io/) instalado.

```bash
git clone https://github.com/ComicIvans/mail-signatures-ui.git
cd mail-signatures-ui
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

Comandos útiles:

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:fix
pnpm typecheck
```

## Producción

```bash
pnpm build
pnpm preview
```

## Estructura del proyecto

```text
app/
├── components/
│   ├── AppHeader.vue              # Cabecera con navegación
│   ├── AppFooter.vue              # Pie de página con enlaces del proyecto
│   ├── LayoutShell.vue            # Shell visual compartido
│   ├── profile/
│   │   └── ConfigModal.vue        # Modal para editar configuración de perfil
│   └── signature/
│       └── Preview.vue            # Vista previa del HTML generado
├── composables/
│   ├── usePageSeo.ts              # SEO compartido por página
│   ├── useSignatureCatalog.ts     # Catálogo validado de perfiles y campos
│   ├── useSignatureGenerator.ts   # Generación de HTML y utilidades
│   ├── useSignaturePreview.ts     # Transformaciones de vista previa (imágenes/alt)
│   └── useSignatureTemplates.ts   # Templates HTML de salida
├── data/
│   ├── profiles.json              # Perfiles de organizaciones
│   └── fields.json                # Definición de campos del formulario
├── layouts/
│   └── default.vue                # Layout principal
├── pages/
│   ├── index.vue                  # Página de inicio
│   ├── como-usar.vue              # Guía de configuración
│   └── generador.vue              # Generador de firmas
├── plugins/
│   └── auto-animate.ts            # Plugin para animaciones automáticas
├── types/
│   └── signature.ts               # Tipos y esquemas Zod
├── app.vue                        # Configuración global de la app
└── error.vue                      # Página de error personalizada
shared/
└── constants/
    └── site.ts                    # Metadatos y enlaces comunes
```

## Convenciones de trabajo

- Las reglas de mantenimiento para agentes y contribuciones automatizadas están en [`AGENTS.md`](./AGENTS.md).
- El texto visible debe ser útil para la persona que usa la aplicación, no para describir el código.
- La lógica compartida de SEO y catálogo se centraliza en composables, no en páginas sueltas.
- El HTML exportado sigue siendo la fuente de verdad para compatibilidad con clientes de correo.

## Compatibilidad de clientes de correo

| Cliente           | Estado                         |
| ----------------- | ------------------------------ |
| Webmail           | ✅ Funciona correctamente       |
| Thunderbird       | ✅ Funciona correctamente       |
| Thunderbird móvil | ✅ Funciona correctamente       |
| Outlook web       | ⚠️ Funciona con pequeños fallos |
| Outlook móvil     | ⚠️ Funciona con pequeños fallos |
| Gmail web         | ⚠️ Funciona con pequeños fallos |
| Gmail móvil       | ⚠️ Funciona con pequeños fallos |
| Canary Mail       | ❌ No funciona correctamente    |

## Licencia

Este proyecto está distribuido bajo la licencia [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html).

## Autor

Iván Salido Cobo

- GitHub: [@ComicIvans](https://github.com/ComicIvans)
- LinkedIn: [ivansalidocobo](https://www.linkedin.com/in/ivansalidocobo)
- Instagram: [@ivansalidocobo](https://instagram.com/ivansalidocobo)
