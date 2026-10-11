# Avatar Mágico

Juego web infantil para crear un avatar original: piel, cabello, maquillaje, accesorios, escenas y voz. Todo corre en el navegador. No hay servidor, analítica, cookies ni recursos de terceros.

La foto que sube el niño se queda en el dispositivo. No se guarda en el navegador ni viaja a internet.

Sitio: <https://dostindev8.github.io/Game-Girls/>

Repositorio: <https://github.com/Dostindev8/Game-Girls>

## Cómo abrirlo

Los módulos ES no funcionan abriendo `index.html` con `file://`. Hace falta un servidor estático.

```bash
npm install
npm run serve
```

Abre <http://127.0.0.1:4173>.

## Pruebas

```bash
npm run lint
npm test
npx playwright install chromium webkit
npm run test:e2e
```

`npm test` cubre estado, historial, foto, voz y galería. Playwright recorre Chromium, WebKit y un móvil emulado.

Lighthouse 13.5, móvil, contra el servidor local el 11 de octubre de 2026: Performance 99, Accessibility 100, Best Practices 100, SEO 91. SEO no llega a 95 porque la auditoría de `robots.txt` usa una petición que Chrome bloquea con `connect-src 'none'`. El archivo existe y un rastreador lo lee fuera de esa política. El runtime pesa 179234 bytes.

## Estructura

```
index.html              juego
privacy.html            aviso de privacidad
404.html
sw.js                   caché offline
manifest.webmanifest
css/styles.css
js/                     app, state, draw, ui, speech, storage, photo
assets/fonts/           Nunito y Fredoka, autoalojadas
assets/icons/           íconos originales
tests/                  node:test y Playwright
docs/                   decisiones, mejoras y capturas
```

## Privacidad

El proyecto está diseñado para respetar COPPA y la Ley 172-13 de protección de datos de la República Dominicana. Esa frase describe la intención del diseño. No es una certificación legal.

Detalle en [privacy.html](privacy.html).

## Licencia

MIT. Copyright 2026 Logic Code Spot. Ver [LICENSE](LICENSE).
