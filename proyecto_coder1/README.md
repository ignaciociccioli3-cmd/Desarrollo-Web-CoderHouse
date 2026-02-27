# Tutta Pizza - Segunda Pre-Entrega

Sitio web estatico de una pizzeria ficticia (Tutta Pizza) desarrollado con HTML y CSS propio, incorporando componentes de Bootstrap por CDN.

## Estructura del proyecto

- `index.html`
- `pages/menu.html`
- `pages/sucursales.html`
- `css/style.css`
- `img/`

## Como ejecutar localmente

1. Abri la carpeta del proyecto en VS Code.
2. Instala la extension **Live Server** (si no la tenes).
3. Click derecho sobre `index.html`.
4. Selecciona **Open with Live Server**.

## Checklist de requisitos cumplidos

- [x] Estructura avanzada en todo el proyecto usando CSS propio (box model + flex + grid).
- [x] Desktop maquetado en los 3 HTML (index, menu y sucursales).
- [x] Sin clases utility de Bootstrap para layout/espaciado/color rapido.
- [x] Responsive visible (desktop vs mobile) en al menos 2 paginas.
- [x] Responsive implementado en las 3 paginas.
- [x] Bootstrap por componentes (opcion A):
  - [x] Navbar Bootstrap (`navbar`, `navbar-expand-lg`, `navbar-collapse`, etc).
  - [x] Carousel Bootstrap en `index.html`.
- [x] Rutas funcionando entre raiz y `pages/*`.
- [x] Proyecto listo para GitHub (sin zip/rar) y con `.gitignore` para archivos basura de macOS.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y subi este proyecto.
2. Verifica que `index.html` este en la raiz del repositorio.
3. En GitHub entra a **Settings**.
4. En el menu lateral entra a **Pages**.
5. En **Build and deployment** selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main` (o la rama que uses) y carpeta `/root`
6. Click en **Save**.
7. Espera el deploy y abre la URL publica que te muestra GitHub Pages.
