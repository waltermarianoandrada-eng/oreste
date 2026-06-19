# 🎨 Oreste Comello | Galería de Arte

Galería de arte interactiva y catálogo digital de obras del artista plástico **Oreste J. Comello**, oriundo de La Rioja, Argentina.  
Desarrollada como **Progressive Web App (PWA)** — funciona sin conexión y puede instalarse en cualquier dispositivo.

---

## 📸 Vista General

La aplicación permite explorar el catálogo de obras del artista, ver detalles ampliados de cada pieza en un lightbox, y filtrar por técnica. También incluye un panel de administración protegido para gestionar el catálogo.

---

## ✨ Funcionalidades

### Galería Pública
- 🖼️ **Grid de obras** con vista tipo tarjeta (imagen, técnica, año, título)
- 🔍 **Lightbox** — vista ampliada con descripción completa, técnica, dimensiones, autor, fecha y colección
- ↔️ **Navegación en lightbox** — botones anterior/siguiente, teclas de flecha y swipe táctil (mobile)
- 🗂️ **Filtros por categoría** — Todas, Óleo, Dibujo
- 📜 Desplazamiento suave con botón **Volver arriba**

### Panel de Administración
- 🔐 **Login protegido por contraseña** (modal dedicado)
- ➕ **Agregar obras** — formulario con soporte para imagen local (drag & drop / selección) o URL externa
- 🗑️ **Eliminar obras** del catálogo
- 💾 **Persistencia local** — el catálogo se guarda en `localStorage` del navegador

### PWA / Offline
- ⚡ **Instalable** en Android, iOS y escritorio (Chrome/Edge)
- 📶 **Funciona sin conexión** gracias al Service Worker con estrategia _Cache First_
- 🔔 **Prompt de instalación** integrado en la barra de navegación

---

## 🗂️ Estructura del Proyecto

```
oreste/
├── index.html          # Estructura HTML principal (modales, galería, nav)
├── styles.css          # Estilos globales, componentes y animaciones
├── app.js              # Lógica de la aplicación (estado, eventos, render)
├── sw.js               # Service Worker (caché offline, estrategia Cache First)
├── package.json        # Configuración del proyecto y scripts npm
├── .gitignore          # Archivos excluidos del repositorio
└── public/
    ├── manifest.json       # Configuración PWA (nombre, iconos, colores)
    ├── icon-192.png        # Ícono PWA 192×192
    ├── icon-512.png        # Ícono PWA 512×512
    ├── artist-profile.png  # Foto del artista (sección Hero)
    ├── obra-federal.png    # Obra: "Forjadores de la Historia" (2009)
    ├── obra-playa.jpg      # Obra: "Caminata al Atardecer" (2026)
    ├── obra-soldado.jpg    # Obra: "Retrato del General" (2026)
    ├── obra-victoria.jpg   # Obra: "Victoria Romero" (2018)
    ├── obra-pamela.png     # Obra: "Retrato de Dama con Pamela" (2026)
    └── obra-flores.png     # Obra: "Flores en Florero Azul" (2026)
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica |
| **CSS3 (Vanilla)** | Estilos, animaciones, responsive design |
| **JavaScript (ES6+)** | Lógica de app, DOM, eventos |
| **Vite 4** | Servidor de desarrollo y bundler |
| **Service Worker API** | Cache offline y soporte PWA |
| **localStorage / sessionStorage** | Persistencia de catálogo y sesión admin |
| **Font Awesome 6** | Íconos de interfaz |
| **Google Fonts** | Tipografía |

---

## 🚀 Instalación y Desarrollo Local

### Requisitos
- [Node.js](https://nodejs.org/) v16 o superior
- npm (incluido con Node.js)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/oreste.git
cd oreste

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La app estará disponible en: **http://localhost:5188**

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo (puerto 5188) |
| `npm run build` | Genera el bundle de producción en `/dist` |
| `npm run preview` | Vista previa del build de producción |

---

## 🔐 Panel de Administración

Para acceder al panel de administración:

1. Hacer clic en el botón **Admin** (🔑) en la barra de navegación
2. Ingresar la contraseña de administrador
3. Se abre el panel para agregar o eliminar obras

> ⚠️ **Nota de seguridad**: La contraseña actualmente está definida directamente en el código (`app.js`). Se recomienda migrarla a una variable de entorno usando `VITE_ADMIN_PWD` en un archivo `.env.local` (no versionado) para entornos de producción.

---

## 📦 Catálogo Inicial de Obras

El catálogo incluye las siguientes obras predeterminadas, que se sincronizan automáticamente al iniciar la app:

| Obra | Técnica | Año |
|------|---------|-----|
| Forjadores de la Historia | Óleo sobre lienzo | 2009 |
| Caminata al Atardecer | Óleo sobre lienzo | 2026 |
| Retrato del General | Óleo monocromático | 2026 |
| Victoria Romero | Dibujo monocromático | 2018 |
| Retrato de Dama con Pamela | Óleo sobre soporte texturizado | 2026 |
| Flores en Florero Azul | Óleo sobre lienzo | 2026 |

---

## 🌐 Despliegue

El proyecto está configurado para desplegarse en **Vercel**. Cada push a la rama principal dispara un deploy automático.

```bash
# Build de producción
npm run build

# Los archivos generados estarán en /dist
```

---

## 📄 Licencia

Las obras de arte son propiedad intelectual de **Oreste J. Comello**. Todos los derechos reservados.  
El código fuente de la aplicación está disponible para uso educativo y referencia.

---

*Desarrollado con ❤️ para preservar y difundir el arte riojano.*
