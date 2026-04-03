# Deploy de Tutta Pizza

## 1) Publicar en GitHub Pages

1. Subí el repositorio a GitHub con `index.html` en la raíz.
2. Entrá a **Settings > Pages**.
3. En **Build and deployment**, seleccioná:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (o la rama principal) y carpeta `/root`.
4. Guardá cambios.
5. Esperá 1-3 minutos y revisá la URL que muestra GitHub Pages.
6. Verificá que carguen correctamente:
   - `index.html`
   - `pages/menu.html`
   - `pages/sucursales.html`
   - `pages/promociones.html`
   - `pages/contacto.html`

## 2) Publicar en InfinityFree

1. Creá una cuenta y un dominio/subdominio en InfinityFree.
2. Ingresá al **File Manager** o conectate por FTP.
3. Subí todo el contenido del proyecto dentro de la carpeta `htdocs`.
4. Confirmá que `index.html` quede directamente dentro de `htdocs`.
5. No cambies la estructura de carpetas `pages/`, `css/`, `scss/` e `img/`.
6. Abrí la URL pública y validá navegación y estilos.

## 3) Publicar en 000webhost

1. Creá un sitio nuevo en 000webhost.
2. Abrí **File Manager** y entrá en `public_html`.
3. Subí todos los archivos del proyecto a `public_html`.
4. Verificá que `index.html` esté en la raíz de `public_html`.
5. Probá cada enlace del menú y del footer.

## 4) Checklist rápido post-deploy

- `index.html` abre al entrar al dominio.
- Todas las rutas relativas funcionan (`pages/...`, `img/...`, `css/...`).
- Bootstrap CSS y JS cargan por CDN.
- El sitio no tiene scroll horizontal en mobile.
- Navegación y footer enlazan correctamente las 5 páginas.
