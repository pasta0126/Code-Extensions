## Context

Ver `proposal.md` (Why) para la motivación. Estado actual relevante:

- `.vscodeignore` ya es una lista blanca (`**` y excepciones para `dist/extension.js`, `media/**`, `package.json`, `README.md`, `icon.png`, `LICENSE`, `CHANGELOG.md`). Una carpeta nueva de imágenes **no** entra en el `.vsix` salvo que se añada explícitamente.
- `package.json` tiene `repository` con `directory: extensions/kanban-json`, que `vsce` usa para resolver rutas relativas del README.
- La publicación actual es solo en el Marketplace de Microsoft (`publisher: pasta0126`). No hay flujo para Open VSX.
- El README ya describe funciones y formato, pero sin recursos visuales ni ángulo diferencial arriba.

## Goals / Non-Goals

**Goals:**
- Una ficha que se encuentre por búsqueda y convierta (keywords, descripción, GIFs).
- Mismo contenido y versión en Marketplace y Open VSX.
- Un plan de difusión reutilizable, con textos base, ejecutable por una sola persona.

**Non-Goals:**
- Cambiar funcionalidad, formato de `kanban.json` o la UI de la extensión.
- Automatizar la difusión en redes ni contratar promoción de pago.
- Montar CI/CD de publicación (se valora más adelante; ver Open Questions).

## Decisions

1. **Imágenes en el repo, referenciadas con rutas relativas, y fuera del `.vsix`.**
   Los GIFs viven en `extensions/kanban-json/images/` y el README los referencia con rutas relativas. `vsce` las reescribe a URLs de GitHub usando `repository`, y el `.vsix` no las incluye porque `.vscodeignore` es lista blanca.
   *Alternativas:* incrustarlas en el paquete (infla la instalación, sin beneficio) o alojarlas en un CDN externo (dependencia extra y riesgo de enlaces rotos).
   *Consecuencia:* las imágenes deben estar **subidas a GitHub antes de publicar**, o la ficha mostrará imágenes rotas.

2. **Publicar en Open VSX con `ovsx` desde el mismo `.vsix`.**
   Se genera una vez con `vsce package` y se publica el mismo fichero en ambos registros (`vsce publish --packagePath` y `ovsx publish <vsix> -p <token>`), garantizando contenido idéntico.
   *Alternativa:* empaquetar por separado para cada registro (riesgo de divergencias).
   Requiere crear cuenta y namespace `pasta0126` en Open VSX y un token, que se guarda fuera del repo.

3. **GIFs cortos y ligeros, grabados a mano.**
   Entre 5 y 10 s, ancho máximo de unos 800 px y unos 2 MB cada uno, sobre un `kanban.json` de ejemplo con datos realistas (varios proyectos y prioridades). Un único tablero de demo para que todas las capturas sean coherentes, en tema claro y oscuro.
   *Alternativa:* vídeo en YouTube enlazado (no se reproduce en línea en la ficha). Los GIFs animados se muestran bien en ambos registros.

4. **Ángulo diferencial como eje de todo el texto.**
   «Tu tablero Kanban es un fichero JSON en tu repo: versionable, diffeable, sin cuentas ni servicios». Se repite en `description`, en la apertura del README y en los textos de difusión.

5. **Difusión escalonada y condicionada a la ficha.**
   Orden: (1) ficha lista y publicada en ambos registros; (2) post en dev.to con el relato del problema y los GIFs; (3) Reddit (r/vscode) respetando sus normas de autopromoción; (4) Show HN / Product Hunt opcionales; (5) PRs a listas «awesome». No se difunde nada hasta cumplir los requisitos de la ficha (spec `marketplace-listing`).

6. **Plan de difusión como documento del repo.**
   Se guarda en `extensions/kanban-json/docs/promotion.md` (en español, por ser documentación interna según las convenciones del repo), con los textos base de las publicaciones en inglés. Queda fuera del `.vsix`.

7. **Versión de publicación.**
   Los cambios de metadatos y README no alteran el comportamiento, pero el Marketplace solo actualiza la ficha con una versión nueva. Se publica una versión de parche (0.6.1) con una entrada de CHANGELOG que lo explique.

## Risks / Trade-offs

- [Imágenes rotas en la ficha por no estar subidas a GitHub] → Subir `images/` a la rama por defecto antes de publicar y comprobar la vista previa del README.
- [Autopromoción mal vista en Reddit u otras comunidades] → Leer las normas antes, aportar contexto del problema y no repetir el mismo texto en varios foros a la vez.
- [Open VSX rechaza o retrasa el namespace] → Solicitarlo al empezar; no bloquea la publicación en el Marketplace de Microsoft.
- [GIFs pesados ralentizan la carga de la ficha] → Límites de duración y tamaño; optimizar (p. ej. con `gifsicle`) antes de subirlos.
- [Un pico de visitas sin soporte] → Reservar tiempo para responder issues y reseñas los primeros días.
- [Expectativas: el crecimiento orgánico es lento] → Medir con las estadísticas de instalaciones de ambos registros y no depender de un solo lanzamiento.

## Migration Plan

1. Preparar ficha y recursos en una rama; verificar con `vsce package` y una instalación local del `.vsix`.
2. Subir las imágenes a GitHub y confirmar que el README las muestra.
3. Publicar 0.6.1 en el Marketplace de Microsoft y en Open VSX.
4. Comprobar ambas fichas (imágenes, keywords, categoría).
5. Ejecutar la difusión según el plan.
Reversión: ambos registros permiten publicar una versión corregida o retirar la versión; no hay migración de datos.

## Open Questions

- ¿Se automatiza la publicación dual con GitHub Actions más adelante? No bloquea este cambio.
- ¿Merece la pena un sitio o página de aterrizaje propia? Se decide según el resultado de la primera difusión.
