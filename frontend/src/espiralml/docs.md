


# EspiralML

EspiralML propone construir interfaces con tres ejes composables por clase CSS: Función (fn--), Estructura (es--) y Forma (fo--). En React, exponemos componentes mínimos que reutilizan el estado existente (cmscomponents) y añaden composición de clases en el orden correcto.

## Ejes (reglas rápidas)

- Función → fn--… (qué es: Página, Sección, Título, Botón)
- Estructura → es--… (cómo se coloca: grid, stack, container, full-width)
- Forma → fo--… (cómo se ve: standard, acentuada, muted, theme-*)

Orden en class: fn--* luego es--* luego fo--*. Dentro de cada eje, del más general al más específico. Sin !important.

## Componentes Espiral

- EField: campo de datos ligado al store. Props: { name, slice?, id?, as?, fallback?, html?, fn/es/fo/className }
- EList: lista de items desde el store. Props: { slice?, template?, as?, empty?, children, fn/es/fo/className }
- ELoader: ejecuta una acción/thunk y muestra children cuando finaliza. Props: { action, payload?, as?, fallback?, error?, fn/es/fo/className }
- ESelect: selecciona página/elemento. Props: { action = 'pages/selectPage', payload?, as?, fallback?, fn/es/fo/className }

Todos aceptan los ejes fn, es, fo como string o string[].

## Ejemplos

Título de portada acentuado:

```tsx
import { EField } from './components'

<EField
	name="Titulo"
	as="h1"
	fn={["Pagina", "Portada", "Titulo"]}
	es={["stack"]}
	fo={["standard", "acentuada"]}
/>
```

Listado de páginas (tarjetas):

```tsx
import { EList } from './components'

<EList template="Card" as="article" fn={["Seccion","Listado","Card"]} es={["grid","grid-3"]} fo="standard">
	{(item) => (
		<>
			<h3 className="fn--Titulo fo--acentuada">{item.Page}</h3>
			<p className="fn--Subtitulo fo--muted">{item.Template}</p>
		</>
	)}
	</EList>
```

Cargar y renderizar sección:

```tsx
import { ELoader, EField } from './components'

<ELoader action="pages/loadPages" fn="Seccion" es={["container","stack"]} fo="standard">
	<EField name="Descripcion" as="p" fo="muted" />
</ELoader>
```

## CSS sugerido (tokens + utilidades)

Definir tus tokens y utilidades fuera del alcance de este documento. Las clases fn--/es--/fo-- deben mantener especificidad baja (un selector de clase) y no usar !important.

## Notas

- Los componentes Espiral reutilizan la lógica existente de `cmscomponents` (no duplicamos store/acciones).
- `composeClass` asegura el orden fn → es → fo y evita duplicados.
- Puedes mezclar utilidades (u-*) cuando sea necesario.

