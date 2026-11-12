## 1. Metadatos del paquete

- [ ] 1.1 Añadir `keywords` en `extensions/kanban-json/package.json` (`kanban`, `board`, `task`, `todo`, `json`, `project management` y similares)
- [ ] 1.2 Revisar `categories` y añadir `galleryBanner` (color y tema)
- [ ] 1.3 Reescribir `description` con el beneficio clave (tablero Kanban en un JSON versionable en git, sin cuentas ni servicios), en inglés

## 2. Recursos visuales

- [ ] 2.1 Preparar un `kanban.json` de demo con datos realistas (varios proyectos y prioridades) en `extensions/kanban-json/examples/`
- [ ] 2.2 Grabar GIF de arrastrar y soltar tarjetas (5-10 s)
- [ ] 2.3 Grabar GIF/captura del filtro y de la agrupación por proyecto
- [ ] 2.4 Capturar el tablero completo en tema claro y en tema oscuro
- [ ] 2.5 Optimizar los GIFs (ancho máx. ~800 px, ~2 MB cada uno) y guardarlos en `extensions/kanban-json/images/`

## 3. README

- [ ] 3.1 Reescribir `extensions/kanban-json/README.md` en inglés con el ángulo diferencial arriba
- [ ] 3.2 Insertar los recursos visuales con rutas relativas
- [ ] 3.3 Incluir un ejemplo mínimo de `kanban.json` y comprobar que la extensión lo abre sin avisos
- [ ] 3.4 Revisar que `.vscodeignore` mantiene `images/` fuera del `.vsix` y que el paquete no incluye `src/`, `test/` ni `node_modules/`

## 4. Preparar la publicación

- [ ] 4.1 Subir `images/` a GitHub (rama por defecto) y confirmar que el README renderiza las imágenes
- [ ] 4.2 Añadir entrada en `CHANGELOG.md` y subir la versión a 0.6.1
- [ ] 4.3 Generar el `.vsix` con `npm run package` e instalarlo en local para revisar la ficha
- [ ] 4.4 Crear cuenta y namespace `pasta0126` en Open VSX y generar el token (guardarlo fuera del repo)

## 5. Publicar en ambos registros

- [ ] 5.1 Publicar 0.6.1 en el Marketplace de Microsoft con el `.vsix` generado
- [ ] 5.2 Publicar el mismo `.vsix` en Open VSX con `ovsx publish`
- [ ] 5.3 Verificar ambas fichas (imágenes, keywords, categoría, versión)

## 6. Plan de difusión

- [ ] 6.1 Escribir `extensions/kanban-json/docs/promotion.md` con canales, orden, normas de autopromoción y textos base en inglés
- [ ] 6.2 Publicar el post de lanzamiento en dev.to (problema, ángulo diferencial, GIFs, enlaces a ambos registros)
- [ ] 6.3 Publicar en Reddit (r/vscode) tras leer las normas de la comunidad
- [ ] 6.4 (Opcional) Show HN y Product Hunt
- [ ] 6.5 Difundir en redes (X, LinkedIn, Mastodon) con el GIF principal
- [ ] 6.6 Enviar PRs a listas «awesome» relevantes

## 7. Mantenimiento

- [ ] 7.1 Revisar el README del repo raíz (descripción, enlaces a ambos registros)
- [ ] 7.2 Responder issues y reseñas durante la primera semana tras la difusión
- [ ] 7.3 Pedir reseñas a los primeros usuarios, sin insistir
- [ ] 7.4 Revisar las estadísticas de instalaciones a las 2 semanas y decidir siguientes pasos
