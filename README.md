# Generador de Firmas de Correo Electrónico

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20v4-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Página web para generar firmas de correo electrónico HTML profesionales y personalizadas para distintas organizaciones.

Este proyecto es una evolución del generador original [mail-signatures](https://github.com/ComicIvans/mail-signatures), reconstruido con una interfaz moderna usando Nuxt 4 y Nuxt UI.

- [Demo en vivo](https://firmas.wupp.dev/)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png">
  <img alt="Ejemplo de firma de correo electrónico" src="https://raw.githubusercontent.com/ComicIvans/mail-signatures/main/img/enem.png">
</picture>

## ✨ Características

### Implementadas

- 🎨 **Interfaz moderna** con Nuxt UI v4 y Tailwind CSS
- 🌗 **Modo claro/oscuro** con detección automática del sistema
- 📱 **Diseño responsive** adaptado a móviles y escritorio
- ♿ **Accesibilidad** con skip links, ARIA labels, roles semánticos y navegación por teclado
- 🔍 **SEO optimizado** con @nuxtjs/seo (Open Graph, meta tags, etc.)
- 🌐 **Internacionalización** configurada en español
- 📖 **Guía de uso** con instrucciones para Thunderbird, Gmail y Webmail
- 🖼️ **Galería animada** con ejemplos de firmas disponibles
- 🏢 **Múltiples organizaciones** - Perfiles preconfigurados (DEFC, DGE, AMAT, CREUP, ENEM)
- 📝 **Generador individual** - Formulario con campos personalizables:
  - Campos requeridos: Nombre, Cargo y Email
  - Campos opcionales dinámicos: Teléfono, código de país, extensión interna, email secundario, organización extra, fuentes personalizadas, ancho máximo e imagen personalizada
- 🎭 **Plantillas de firma** - Dos diseños disponibles:
  - **Original**: Avatar circular con barra horizontal de color
  - **Logo ancho**: Logo rectangular con barra vertical de color
- 📋 **Exportación** - Copiar HTML al portapapeles o descargar archivo HTML
- ✅ **Validación** con Zod para asegurar datos correctos
- 🔄 **Vista previa en tiempo real** que siempre muestra modo claro
- ⚙️ **Gestión de perfiles** - Modal para ver, editar y exportar configuraciones de perfil:
  - Edición completa de todos los campos del perfil
  - Gestión de listas (redes sociales, patrocinadores, colaboradores) con reordenación animada
  - Validación en tiempo real con detección de IDs duplicados
  - Exportación a JSON

### Próximamente

- 📊 **Generación múltiple** - Crear varias firmas a la vez
- 📥 **Importación CSV** - Cargar datos desde archivo

## 🛠️ Tecnologías

- [Nuxt 4](https://nuxt.com/) - Framework Vue.js
- [Nuxt UI v4](https://ui.nuxt.com/) - Biblioteca de componentes
- [Tailwind CSS v4](https://tailwindcss.com/) - Framework CSS
- [Zod](https://zod.dev/) - Validación de esquemas TypeScript-first
- [Tabler Icons](https://tabler.io/icons) - Iconos
- [Lucide Icons](https://lucide.dev/) - Iconos adicionales
- [@nuxtjs/seo](https://nuxtseo.com/) - Módulo SEO
- [@formkit/auto-animate](https://auto-animate.formkit.com/) - Animaciones automáticas
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático

## 📦 Instalación

Asegúrate de tener [pnpm](https://pnpm.io/) instalado.

```bash
# Clonar el repositorio
git clone https://github.com/ComicIvans/mail-signatures-ui.git
cd mail-signatures-ui

# Instalar dependencias
pnpm install
```

## 🚀 Desarrollo

Iniciar el servidor de desarrollo en `http://localhost:3000`:

```bash
pnpm dev
```

## 🏗️ Producción

Compilar la aplicación para producción:

```bash
pnpm build
```

Previsualizar la build de producción:

```bash
pnpm preview
```

## 📁 Estructura del proyecto

```
app/
├── components/
│   ├── AppHeader.vue              # Cabecera con navegación
│   ├── AppFooter.vue              # Pie de página con enlaces sociales
│   ├── profile/
│   │   └── ConfigModal.vue        # Modal para editar configuración de perfil
│   └── signature/
│       ├── Preview.vue            # Selector de plantilla de vista previa
│       ├── TemplateOriginal.vue   # Plantilla: avatar circular + barra horizontal
│       └── TemplateWideLogo.vue   # Plantilla: logo ancho + barra vertical
├── composables/
│   └── useSignatureGenerator.ts   # Generación de HTML y utilidades
├── data/
│   ├── formats.json               # Configuración de formatos de firma
│   ├── profiles.json              # Perfiles de organizaciones
│   └── fields.json                # Definición de campos del formulario
├── pages/
│   ├── index.vue                  # Página de inicio
│   ├── como-usar.vue              # Guía de configuración
│   └── generador.vue              # Generador de firmas
├── plugins/
│   └── auto-animate.ts            # Plugin para animaciones automáticas
├── types/
│   └── signature.ts               # Tipos y esquemas Zod
├── app.vue                        # Layout principal
└── error.vue                      # Página de error personalizada
```

## 🤝 Compatibilidad de clientes de correo

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

## 📄 Licencia

Este proyecto está distribuido bajo la licencia [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html).

## 👤 Autor

**Iván Salido Cobo**

- GitHub: [@ComicIvans](https://github.com/ComicIvans)
- LinkedIn: [ivansalidocobo](https://www.linkedin.com/in/ivansalidocobo)
- Instagram: [@ivansalidocobo](https://instagram.com/ivansalidocobo)
