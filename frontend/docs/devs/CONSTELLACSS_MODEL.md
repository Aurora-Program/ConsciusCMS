# Constellacss Model (fn / es / fo)

Constellacss es un micro–modelo de composición semántica que organiza las clases CSS en **tres ejes ortogonales**:

- **fn (Función)**: Qué hace / rol semántico (ej. `Pagina`, `Hero`, `Menu`, `Card`, `TituloItem`).
- **es (Estructura)**: Cómo se dispone en el layout (ej. `container`, `stack`, `grid`, `p-md`, `list-grid`).
- **fo (Forma)**: Apariencia visual / skin (ej. `standard`, `muted`, `acentuada`, `card-elegant`, `rounded`).

Cada eje se representa con un prefijo consistente:
- `fn--*`
- `es--*`
- `fo--*`

El orden en la clase final: **fn → es → fo → extras**. Esto mantiene previsibilidad y baja especificidad.

---
## Objetivos
1. Reforzar semántica para agentes y humanos (inspección rápida = intención clara).
2. Minimizar colisiones: cada eje es independiente.
3. Facilitar generación automática (codegen) desde manifiestos de diseño.
4. Permitir sustitución / theming sin reescribir estructura DOM.
5. Establecer un vocabulario controlado (taxonomía) escalable.

---
## Ejemplo Simple
```html
<section class="fn--Pagina es--container es--stack fo--standard">
  <header class="fn--Hero es--stack fo--hero">
    <h1 class="fn--Titulo es--inline fo--title-highlight">Título</h1>
    <p class="fn--Subtitulo es--inline fo--muted">Subtítulo</p>
  </header>
  <article class="fn--Card es--stack fo--card-elegant fo--rounded">
    <h3 class="fn--CardTitle fo--acentuada">Item 1</h3>
    <p class="fn--CardSubtitle fo--muted">Descripción...</p>
  </article>
</section>
```

---
## Integración con React (EspiralML Layer)
Los componentes `EPage`, `ESection`, `EComponente` actúan como *wrappers* mínimos que aplican composición automática:
```tsx
<ESection fn={["Hero"]} es={["stack"]} fo={["hero"]}>
  <EComponente as="h1" fn="Titulo" fo={"title-highlight"}>Hola</EComponente>
</ESection>
```
Produce:
```html
<section class="fn--Seccion fn--Hero es--stack fo--hero">
  <h1 class="fn--Componente fn--Titulo fo--title-highlight">Hola</h1>
</section>
```

---
## Convenciones de Nomenclatura
| Eje | Regla | Ejemplos |
|-----|-------|----------|
| fn  | PascalCase semántico sin sufijos técnicos | `Pagina`, `Hero`, `CardTitle`, `Lista`, `AccionVer` |
| es  | tokens cortos estructurales | `stack`, `grid`, `inline`, `p-md`, `container`, `list-grid` |
| fo  | describe estilo / skin | `standard`, `muted`, `acentuada`, `rounded`, `card-elegant`, `btn`, `btn-primary` |

Notas:
- Puedes encadenar granularidad: `fn--Card fn--CardTitle` en descendientes.
- Evitar sobrecarga de un eje (no mezclar estructura dentro de fo).
- Prefiere tokens atómicos antes que variantes compuestas largas.

---
## Diseño de Escalas (Tokens)
Las utilidades en `es` y `fo` suelen mapear a variables de diseño (espaciados, colores, radios). Ejemplo:
```css
.es--stack > * + * { margin-top: var(--aurora-spacing-md); }
.fo--muted { color: var(--aurora-muted); }
.fo--rounded { border-radius: var(--aurora-radius); }
```
Esto permite que un cambio de tema sólo re–defina variables sin tocar el HTML.

---
## Patrones Frecuentes
### 1. Card
```html
<article class="fn--Card es--stack fo--card-elegant fo--rounded"></article>
```
### 2. Lista Responsiva
```html
<div class="fn--Lista es--grid fo--standard"></div>
```
### 3. Botón Primario
```html
<button class="fn--Accion es--inline fo--btn fo--btn-primary"></button>
```

---
## Extensión Segura
Añade nuevas clases en el fichero correspondiente:
- Función: `src/constellacss/fn.css`
- Estructura: `src/constellacss/es.css`
- Forma: `src/constellacss/fo.css`

Reglas:
1. Una responsabilidad por clase.
2. Sin `!important`.
3. Especificidad = 1 selector de clase.
4. Documentar en comentario si añade dependencia contextual.
5. No referenciar IDs ni elementos HTML directamente.

---
## Anti‑Patrones
| Problema | Ejemplo | Alternativa |
|----------|---------|-------------|
| Mezclar ejes | `.fo--card-elegant { display:grid; }` | Mover grid a `.es--grid-card` |
| Nombres vagos | `fn--Box`, `es--thing` | Usa `Card`, `Panel`, `Stack` |
| Sobrescribir cascada | Repetir mismas propiedades en muchas `fo--*` | Crear utilitarios compartidos |
| Mutar semántica | Reutilizar `fn--Hero` en un footer | Crear `fn--FooterHero` o `fn--Banner` |

---
## Estrategia para Agentes
Un agente puede:
1. Leer inventario: escanear `fn.css`, `es.css`, `fo.css` y construir vocabulario.
2. Recibir un manifiesto (futuro `templates.json`) y componer páginas.
3. Verificar cobertura: cada componente renderizado debe tener >=1 clase por eje.
4. Sugerir consolidación: detectar `fo--*` con propiedades duplicadas >80%.
5. Generar documentación incremental (dif entre commits en taxonomía).

---
## Roadmap de Mejora
- [ ] Añadir `templates.json` (contrato declarativo).
- [ ] Codegen de tipos TS a partir de manifiesto.
- [ ] Validación runtime ligera (Zod) antes de render.
- [ ] CLI para listar / buscar tokens y detectar no usados.
- [ ] Modo dark via `:root[data-theme=dark]` sin cambiar HTML.
- [ ] Telemetría opcional: frecuencia de uso de tokens.

---
## Checklist de Revisión (PR)
- ¿Cada bloque tiene fn / es / fo donde aplica?
- ¿No se mezclan responsabilidades en un eje?
- ¿Tokens nuevos están documentados?
- ¿Se evita duplicación innecesaria en CSS?
- ¿Clases mantienen baja especificidad?

---
## Ejemplo de Automatización
Entrada (manifiesto parcial):
```json
{
  "component": "CardSimple",
  "fn": ["Card"],
  "es": ["stack"],
  "fo": ["card-elegant","rounded"],
  "slots": ["title","subtitle","content"]
}
```
Salida generada:
```html
<article class="fn--Card es--stack fo--card-elegant fo--rounded">
  <h3 class="fn--Titulo es--inline fo--acentuada">{{title}}</h3>
  <p class="fn--Subtitulo es--inline fo--muted">{{subtitle}}</p>
  <div class="fn--Contenido es--block fo--standard">{{content}}</div>
</article>
```

---
## Integración con Accesibilidad
- Usa `fn--*` para reforzar roles visuales, pero aplica atributos ARIA vía componentes React.
- Generar regla: si `fn--Accion` y `as="button"` faltan `aria-label` → warning en dev.

---
## Testing
Pruebas sugeridas:
1. Snapshot de clase compuesta (orden correcto).
2. Linter que rechaza clases fuera de vocabulario.
3. Visual regression para combinaciones críticas (Storybook + Chromatic).

---
## Licencia / Créditos
Modelo interno Aurora inspirado en metodologías BEM / ITCSS / Utility‑First combinadas, adaptado a necesidades de generación por agentes.

---
## Preguntas Frecuentes
**¿Puedo omitir un eje?** Sí, pero se recomienda siempre incluir al menos `fn` para mantener trazabilidad semántica.

**¿Puedo combinar varias funciones?** Sí: `fn--Pagina fn--Hero` cuando semánticamente el bloque hace ambas (preferir separar si complica estilos).

**¿Cómo versiono tokens?** Añadiendo comentarios con `@since vX.Y` y changelog en este documento.

---
Fin.
