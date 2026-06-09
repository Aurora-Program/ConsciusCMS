# IE Electronic Intelligence Agent Manifest (Aurora Frontend)

Este documento actúa como punto de entrada para agentes de inteligencia electrónica (IE) que necesiten comprender y operar sobre la base de código del frontend de Aurora.

## 1. Capas Principales
| Capa | Descripción | Ubicación |
|------|-------------|-----------|
| UI Semántica (EspiralML + Constellacss) | Composición de interfaz por ejes fn/es/fo | `src/espiralml`, `src/constellacss`, `docs/devs/CONSTELLACSS_MODEL.md` |
| Estado (Redux Toolkit) | Slices para páginas, idioma, etc. | `src/Pages/pageSlice.ts`, `src/store` |
| Servicios API | Fetch / axios de páginas y recursos | `src/Pages/pageService.ts` |
| Internacionalización (i18n) | Traducciones estáticas ES/EN | `src/util/translations/*.json`, hook `useT` |
| Render dinámico de páginas | Carga de páginas desde backend y selección | `examples-list.tsx`, `landing.tsx` |
| Estilos de diseño | Tokens + sistema de diseño | `src/styles`, `aurora-*.css` |

## 2. Flujo de Datos (High Level)
```
Backend (API Pages) --> pageService.fetchPages() --> loadPages thunk --> pageSlice.pages
                                                          |                        
                                                          v                        
                                             selectPageAction (fetchPageByPage) --> selectedPage
```
Traducción se evalúa en render vía `useT()`.

## 3. Componentes EspiralML
| Componente | Rol | Extensión |
|------------|-----|-----------|
| `EPage` | Contenedor raíz de una vista | fn default: `Pagina` |
| `ESection` | Bloque estructural | fn default: `Seccion` |
| `EComponente` | Unidad atómica genérica | fn default: `Componente` |
| `ETexto` | Texto traducible | fn default: `Texto` |

Clases generadas: `fn--* es--* fo--*` en orden fijo.

## 4. Internacionalización
- Hook: `useT()` → selecciona diccionario según `language.currentLanguage`.
- Fallback: clave misma o `fallback` prop.
- HTML permitido vía `<ETexto html />` para campos ricos.
- Próximas extensiones sugeridas: interpolación, lazy loading, plurales.

## 5. Redux (Slices Relevantes)
- `pageSlice`: carga listado (`loadPages`), selección (`selectPageAction`), CRUD básico.
- `languageSlice`: alterna ES/EN y persiste en `localStorage`.

## 6. Servicios API
Archivo: `pageService.ts`
Responsabilidades:
- `fetchPages(filter?)`: lista páginas; normaliza distintas formas de respuesta.
- `fetchPageByPage(id)`: obtiene detalle + values.
- Mutaciones: `addPage`, `savePage`, `deletePage`.
- Headers: usa token en `sessionStorage.accessToken` si existe.

## 7. Estándares de Código
- Tipado progresivo (algunas funciones aún `any` tras refactor rápido). Mejora recomendada: introducir schema (Zod) + tipos generados.
- Evitar lógica de presentación dentro de servicios (mantener parse simple + normalización). 

## 8. Ética / Publicación Segura
(Resumen — ampliar cuando se integre doc backend aquí)
- Flujo de ethics token (en CMS) antes de operaciones de escritura.
- Header `ethics-token` validado en backend Lambda (TTL en DynamoDB).

## 9. Guías de Diseño / Estilo
Ver:
- `docs/devs/CONSTELLACSS_MODEL.md` (modelo de ejes).
- `docs/devs/ESPIRALML_I18N_INTEGRATION.md` (i18n + EspiralML).
- `AURORA_DESIGN_SYSTEM_GUIDE.md` (tokens / patrones amplios).

## 10. Tareas Recomendadas para Agente
| Prioridad | Acción | Impacto |
|-----------|--------|---------|
| Alta | Crear `templates.json` declarativo | Orquestación dinámica y codegen |
| Alta | Añadir validación Zod para payloads pages | Robustez / confiabilidad |
| Media | Reemplazar literales por `ETexto` progresivamente | Consistencia i18n |
| Media | Linter de claves huérfanas i18n | Mantenimiento |
| Media | Normalizar typo `exmaples` → migración | Limpieza semántica |
| Baja | Codegen de slices a partir de manifiesto | Escalabilidad |

## 10.1 Manifiesto de Plantillas (`templates.json`)
Archivo raíz que define los tipos de página soportados.
Estructura:
```json
{
  "version": 1,
  "templates": [
    {"name": "examples", "alias": ["exmaples"], "schemaVersion": 1, "fields": [ {"name":"Title","type":"text","required":true} ] }
  ]
}
```
Campos:
- `name`: identificador canónico.
- `alias`: lista de variantes aceptadas (para migraciones).
- `schemaVersion`: permite migraciones específicas.
- `fields[*]`: contrato mínimo (type: text | richtext | enum | number | date).

Uso previsto:
1. Validar páginas recibidas del backend.
2. Generar formularios dinámicos (futuro codegen).
3. Normalizar Templates (map alias → name).

## 10.2 Scripts de Mantenimiento
Ubicación: `scripts/`.

| Script | Comando | Propósito | Salida |
|--------|---------|-----------|--------|
| scan-i18n | `npm run scan:i18n` | Detecta literales sin traducción en código fuente | Lista de archivos + literal | 

Convenciones futuras (no implementados aún):
| Nombre propuesto | Función |
|------------------|---------|
| scan-styles | Detectar clases fn-- / es-- / fo-- no usadas |
| entropy-report | Emitir métricas de reutilización / duplicación |
| migrate-template | Reescribir alias antiguos a nombre canónico |

Integración CI (sugerido): `scan-i18n` debe fallar el pipeline si encuentra literales.

## 11. Contrato Esperado (pages API)
Respuesta típica (lista):
```json
{
  "Items": [
    {"Template": "examples", "Page": "Example 1", "updateTime": "..."}
  ]
}
```
Detalle:
```json
{
  "Items": [
    {"Template": "examples", "Page": "Example 1", "values": [{"name":"Title","value":{"text":"..."}}] }
  ]
}
```

## 12. Glosario
| Término | Definición |
|---------|------------|
| EspiralML | Capa de composición semántica React + clases multieje |
| Constellacss | Vocabulario de clases base (fn/es/fo) |
| Ethics Token | Token temporal para autorizar cambios críticos |
| Page Values | Lista de campos (estructura flexible) de una página |
| Visión Sostenibilidad | Narrativa y propósito ético del sistema | `INFORMATIONAL_SUSTAINABILITY_VISION_EN.md`, `VISION_SOSTENIBILIDAD_INFORMACIONAL_ES.md` |

## 13. Señales para Observabilidad (Sugerido)
Estructura de log (futuro):
```json
{"event":"pages_fetch","status":"ok","count":5,"lang":"ES"}
```

## 14. Expansión Futuro
- Integrar generador de documentación automática para nuevos templates.
- Añadir modo de previsualización por idioma (`?lang=EN`).
- Edge caching selectivo por `Template`.

## 15. Sostenibilidad de la Información
ConsciusCMS persigue la sostenibilidad informacional y una red más resiliente:

| Pilar | Objetivo | Prácticas / Implicaciones |
|-------|----------|---------------------------|
| Persistencia Ética | Evitar pérdida y deriva de significado | Versionado de schemas, trazabilidad de cambios, metadatos de procedencia |
| Minimización de Entropía | Reducir duplicación y contradicciones | Normalización de plantillas, detección de claves i18n huérfanas, consolidation refactors |
| Eficiencia de Transferencia | Menor huella energética | Carga diferida (lazy), caché etag, bundles i18n segmentados |
| Accesibilidad Semántica | Datos legibles por humanos y agentes | Claves jerárquicas, ejes fn/es/fo, manifiestos declarativos |
| Transparencia | Auditabilidad y confianza | Logs estructurados, hash de contenido, diffs claros en PR |
| Reutilización | Promover ensamblaje sobre re-escritura | Componentes atómicos, plantillas parametrizadas, codegen controlado |

Principios guía:
1. Cada nuevo dato debe declarar su ciclo de vida (origen, propósito, expiración opcional).
2. El coste de mantenimiento se evalúa antes de introducir una segunda fuente de verdad.
3. La internacionalización no duplica lógica de presentación (se externaliza en claves y tokens).
4. Estilos se mantienen en capas granulares; evitar cascada opaca que dificulte refactors energéticamente eficientes.
5. Automatización > Corrección manual repetida (scripts para limpieza de claves, merging de estilos).

Indicadores sugeridos (para un panel futuro):
- Ratio de reutilización de componentes (instancias / definiciones).
- % de claves i18n sin uso vs totales.
- Tamaño medio de payload de página por Template.
- Tiempo medio de resolución de una clave (hit/miss caché).
- Duplicación estructural (hash de estructuras de `values`).

Meta estratégica: reducir el crecimiento no lineal de complejidad; que la plataforma escale en páginas y idiomas con incremento sub‑lineal de tamaño de código y energía consumida.

---
Fin.
