import { EPage, ESection, EComponente } from '../espiralml/components'

export default function HomePage() {
  return (
    <EPage fn={["Pagina","Portada"]} es={["container","stack"]} fo="standard">
  <ESection fn={["Seccion","Hero"]} es={["stack","section-pad","text-center","items-center","justify-center"]} fo={"hero"}>
        <EComponente as="h1" fn="Titulo" es="inline" fo={["title-highlight"]}>Documentación y Plataforma Aurora</EComponente>
        <EComponente as="p" fn="Subtitulo" es="inline" fo="muted">Una arquitectura clara para construir interfaces a escala con EspiralML y Constellacss.</EComponente>
  <ESection as="div" es={["row","justify-center","items-center"]}>
          <EComponente as="span" es={["inline","p-sm"]} fo={["btn","btn-outline","rounded"]}>Ver documentación</EComponente>
          <EComponente as="span" es={["inline","p-sm"]} fo={["btn","btn-elevated","rounded"]}>Explorar proyectos</EComponente>
        </ESection>
      </ESection>

      <ESection>
        <EComponente as="h2" fn={["Titulo","Titulo--lg"]} es="inline" fo="standard">Principios de diseño</EComponente>
        <ESection as="div" es={["grid","grid-3"]}>
          <ESection as="article" fn="Card" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="Subtitulo" fo="acentuada">Función</EComponente>
            <EComponente as="p" fo="standard">Define qué es cada elemento (Página, Sección, Componente). Usa clases fn--* de lo general a lo específico.</EComponente>
          </ESection>
          <ESection as="article" fn="Card" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="Subtitulo" fo="acentuada">Estructura</EComponente>
            <EComponente as="p" fo="standard">Determina cómo se coloca en el espacio (grid, stack, container). Usa es--* y compón sin aumentar especificidad.</EComponente>
          </ESection>
          <ESection as="article" fn="Card" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="Subtitulo" fo="acentuada">Forma</EComponente>
            <EComponente as="p" fo="standard">Aplica la piel visual (color, tipografía, sombra, bordes). Usa fo--* apoyándote en tokens de Aurora.</EComponente>
          </ESection>
        </ESection>
      </ESection>

      <ESection>
        <EComponente as="h2" fn={["Titulo","Titulo--lg"]} es="inline" fo="standard">Capas composables que escalan</EComponente>
        <ESection as="div" es={["grid","grid-3"]}>
          <ESection as="article" fn="Card" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="Subtitulo" fo="standard">Baja especificidad</EComponente>
            <EComponente as="p" fo="muted">Una clase por regla, sin !important; la cascada hace el resto.</EComponente>
          </ESection>
          <ESection as="article" fn="Card" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="Subtitulo" fo="standard">Orden predecible</EComponente>
            <EComponente as="p" fo="muted">fn → es → fo; general → específico dentro de cada eje.</EComponente>
          </ESection>
          <ESection as="article" fn="Card" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="Subtitulo" fo="standard">Tokens de diseño</EComponente>
            <EComponente as="p" fo="muted">Colores, espaciados y sombras unificados desde aurora-tokens.</EComponente>
          </ESection>
        </ESection>
      </ESection>

      <ESection>
        <EComponente as="h2" fn="Titulo" es="inline" fo="standard">¿Listo para construir?</EComponente>
        <EComponente as="p" fo="muted">Integra datos después; hoy validamos estructura y escala visual.</EComponente>
        <ESection as="div" es="row">
          <EComponente as="span" es={["inline","p-sm"]} fo={["btn","btn-outline","rounded"]}>Design System</EComponente>
          <EComponente as="span" es={["inline","p-sm"]} fo={["btn","btn-elevated","rounded"]}>Ver proyectos</EComponente>
        </ESection>
      </ESection>
    </EPage>
  )
}