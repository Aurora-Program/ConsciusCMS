# Integración EspiralML + Sistema de Traducción

Esta guía describe cómo conectar los ejes fn / es / fo de EspiralML con claves de traducción centralizadas.

## Objetivo
Renderizar texto semántico usando clases composables y claves i18n sin repetir lógica en cada componente.

## Componentes Nuevos
- `useT()`: Hook que retorna `{ t, lang }`.
- `ETexto`: Componente atómico que resuelve una clave de traducción y aplica ejes EspiralML.

## Ejemplo Básico
```tsx
import { ESection, ETexto } from '../espiralml/components';

<ESection fn={['Hero']} es={['stack']} fo='hero'>
  <ETexto as='h1' fn='Titulo' fo='title-highlight' k='home.heroTitle' />
  <ETexto as='p' fn='Subtitulo' fo='muted' k='home.heroSubtitle' />
  <ETexto as='div' fn='Descripcion' fo='standard' k='home.heroDescription' />
</ESection>
```

## HTML Enriquecido
Si la traducción contiene HTML controlado:
```tsx
<ETexto as='div' fn='Contenido' fo='standard' k='platforms.harmonia.body' html />
```
Internamente usa `dangerouslySetInnerHTML` (asegúrate de sanitizar contenido si proviene de usuario).

## Fallback
```tsx
<ETexto k='home.noExiste' fallback='(sin traducción)' />
```
Si la clave no existe, se muestra el fallback (o la propia clave si no hay fallback).

## Buenas Prácticas
1. Mantener claves jerárquicas (`home.hero.title`).
2. Evitar concatenar strings en runtime (usar plantillas parametrizadas en futuro: `t('home.greeting', { name })`).
3. No mezclar idiomas en un mismo nodo.
4. Para contenido largo / rich, preferir claves HTML específicas.
5. Revisar diffs de JSON en PR (lint + validación schema futura).

## Roadmap
- Parámetros: `t(key, params)` con interpolación.
- Lazy loading de bundles por ruta (`dynamic import`).
- Detección automática de claves huérfanas (script).
- Soporte plurales (ICU MessageFormat o lightweight parser).

## Testing
- Test unit: `t('common.loading')` retorna string esperada.
- Snapshot que verifique orden de clases `fn--* es--* fo--*`.
- E2E: cambiar idioma y verificar re-render sin recarga.

## Migración Progresiva
1. Introducir `ETexto` solo en nuevas secciones.
2. Sustituir gradualmente etiquetas estáticas `<h1>Texto fijo` por `<ETexto k='...' />`.
3. Crear script para detectar literales en JSX que no estén traducidos.

---
Fin.
