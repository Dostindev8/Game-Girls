# Decisiones

## Runtime sin dependencias

El juego es HTML, CSS y JavaScript vainilla. No hay CDN ni `dependencies` de npm. El navegador solo pide archivos de este origen.

## Herramientas de desarrollo

| Paquete                                 | Por qué está                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| eslint                                  | Revisa el código y prohíbe `innerHTML`.                                                                 |
| @eslint/js, globals                     | Configuración plana de ESLint 10.                                                                       |
| prettier                                | Formato uniforme.                                                                                       |
| @playwright/test                        | Pruebas en Chromium, WebKit y móvil.                                                                    |
| @axe-core/playwright                    | Accesibilidad en el flujo real.                                                                         |
| @fontsource/nunito, @fontsource/fredoka | Solo para copiar los woff2 usados a `assets/fonts/`. No se cargan en el navegador desde `node_modules`. |

No se usa el paquete `serve`. Traía `compression` con un aviso alto (GHSA-vc2v-76pw-4v95). El servidor local es `scripts/serve.mjs`, solo Node.

`jpeg-js` y `piexifjs` se usaron una vez para crear `tests/fixtures/exif-orientation-6.jpg` y no forman parte de `package.json`.

## Módulos y rutas relativas

`js/app.js` es un módulo ES para poder probar el estado sin el DOM. Por eso el juego se abre con un servidor, no con `file://`.

Todas las rutas son relativas (`./`, `css/`, `js/`) para que GitHub Pages sirva el sitio en `/Game-Girls/`.

## Foto

La foto vive en memoria (`ImageBitmap` reducido a un canvas de máximo 1600 px). `serializeState` no la incluye. `validateState` rechaza cualquier objeto que traiga claves de imagen. El PNG exportado sale de un canvas nuevo, así que no arrastra EXIF.

## CSP

La política va en una etiqueta `meta`. `frame-ancestors` no funciona en `meta` y GitHub Pages no deja poner esa cabecera desde el repositorio. Por eso no está. El resto de la política sí: sin scripts ni estilos en línea, sin conexiones de red desde la página.

El service worker se registra con `script-src 'self'`. Sus propias peticiones de caché no pasan por `connect-src` de la página.

Esa misma política hace que Lighthouse 13.5 falle la auditoría SEO de `robots.txt`: Chrome aplica el CSP de la página a `Network.loadNetworkResource`. El archivo `robots.txt` es válido (`User-agent: *` y `Allow: /`). Un buscador lo pide como recurso propio, no desde el JavaScript de la página. No se aflojó `connect-src` para subir el número.

## Canvas

El lienzo lógico mide 480×560. En pantalla el buffer interno usa `devicePixelRatio` con tope 2. El PNG siempre mide 960×1120. El fondo y el cuerpo se cachean; la cara y los accesorios se redibujan solo cuando hay animación o un cambio.

## Voz

`speechSynthesis` es del navegador. No se envía audio a ningún servidor. Si no hay una voz en español, el juego avisa y no habla en otro idioma.

## iOS

El guardado usa `toBlob` y `navigator.share` cuando existe. Playwright WebKit cubre el motor. No se probó un iPhone físico en esta entrega.
