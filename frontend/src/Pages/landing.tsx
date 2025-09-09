import { EPage, ESection, EComponente } from '../espiralml/components'

export default function LandingPage() {
  return (
    <EPage fn={["Pagina","Portada"]} es={["container","stack"]} fo="standard">
      {/* Hero */}
      <ESection fn={["Seccion","Hero"]} es={["stack","section-pad","text-center","items-center","justify-center"]} fo="hero">
        <EComponente as="h1" fn="Titulo" es="inline" fo={["title-highlight"]}>Espiral Demo</EComponente>
        <EComponente as="p" fn="Subtitulo" es="inline" fo="muted">Prueba de reutilización con EPage, ESection y EComponente.</EComponente>
        <ESection as="div" es={["row","justify-center","items-center"]}>
          <EComponente as="a" mode="link" href="/homepage" es={["inline","p-sm"]} fo={["btn","btn-secondary","rounded"]}>Ver Homepage</EComponente>
          <EComponente as="a" mode="link" href="/projects" es={["inline","p-sm"]} fo={["btn","btn-primary","rounded"]}>Ir a Proyectos</EComponente>
        </ESection>
      </ESection>

      {/* Feature list using list-grid */}
      <ESection fn="Seccion" es={["stack","section-pad"]} fo="standard">
        <EComponente as="h2" fn={["Titulo","Titulo--lg"]} es="inline" fo="standard">Componentes reutilizables</EComponente>
        <ESection as="div" fn="List" es={["list-grid"]}>
          <ESection as="article" fn={["ListItem","Card"]} es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="CardTitle" fo="acentuada">EPage</EComponente>
            <EComponente as="p" fo="standard">Raíz de página con fn/es/fo base.</EComponente>
          </ESection>
          <ESection as="article" fn={["ListItem","Card"]} es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="CardTitle" fo="acentuada">ESection</EComponente>
            <EComponente as="p" fo="standard">Bloques y layouts composables.</EComponente>
          </ESection>
          <ESection as="article" fn={["ListItem","Card"]} es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
            <EComponente as="h3" fn="CardTitle" fo="acentuada">EComponente</EComponente>
            <EComponente as="p" fo="standard">Texto, botones y enlaces atómicos.</EComponente>
          </ESection>
        </ESection>
      </ESection>

      {/* CTA */}
      <ESection fn="Seccion" es={["stack","section-pad","text-center","items-center","justify-center"]} fo="standard">
        <EComponente as="h2" fn="Titulo" es="inline" fo="standard">¿Listo para explorar?</EComponente>
        <ESection as="div" es={["row","justify-center","items-center"]}>
          <EComponente as="a" mode="link" href="/design-system" es={["inline","p-sm"]} fo={["btn","btn-outline","rounded"]}>Design System</EComponente>
          <EComponente as="a" mode="link" href="/documentation" es={["inline","p-sm"]} fo={["btn","btn-elevated","rounded"]}>Documentación</EComponente>
        </ESection>
      </ESection>
    </EPage>
  )
}
