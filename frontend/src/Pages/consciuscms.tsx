import { EPage, ESection, EComponente, ETexto } from '../espiralml/components';
import '../aurora-design-system.css';
import '../aurora-palette.css';

// ConsciusCMS Landing Page (multi-language via ETexto keys)
// Required translation keys (add to en/es):
// conscius.hero.title, conscius.hero.subtitle, conscius.hero.cta, conscius.section.problem.title,
// conscius.section.problem.body, conscius.section.response.title, conscius.section.response.body,
// conscius.section.token.title, conscius.section.token.body, conscius.section.standard.title,
// conscius.section.standard.body, conscius.section.community.title, conscius.section.community.body,
// conscius.section.values.title, conscius.section.values.items (list), conscius.footer.cta, conscius.footer.join

export default function ConsciusCMSPage(){
  return (
    <EPage fn={["Pagina","ConsciusCMS"]} es={["stack"]} fo="standard" className="conscius-root">
      {/* HERO */}
      <ESection fn={["Hero","Intro"]} es={["stack","container"]} fo={["hero","rounded"]}>
        <EComponente as="img" fn="Logo" es="inline" fo={"standard"} src="/cosciusCMSLogo.png" alt="ConsciusCMS" style={{maxWidth:'180px'}} />
        <ETexto as="h1" fn="Titulo" fo="title-highlight" k="conscius.hero.title" fallback="ConsciusCMS: Conscious Content Infrastructure" />
        <ETexto as="p" fn="Subtitulo" fo="muted" k="conscius.hero.subtitle" fallback="Informational sustainability for the AI era." />
        <EComponente as="a" fn="CTA" fo={["btn","btn-primary","rounded"]} href="#problem">Learn More</EComponente>
      </ESection>

      {/* PROBLEM */}
      <ESection id="problem" fn={["Seccion","Problema"]} es={["stack","container"]} fo="standard">
        <ETexto as="h2" fn="TituloSeccion" fo="acentuada" k="conscius.section.problem.title" fallback="The Problem: Informational Sustainability" />
        <ETexto as="p" fn="Parrafo" fo="standard" k="conscius.section.problem.body" fallback="Dead Internet concerns and noise erode trust..." />
      </ESection>

      {/* RESPONSE */}
      <ESection fn={["Seccion","Respuesta"]} es={["stack","container"]} fo="standard">
        <ETexto as="h2" fn="TituloSeccion" fo="acentuada" k="conscius.section.response.title" fallback="The Response: A CMS with Conscience" />
        <ETexto as="p" fn="Parrafo" fo="standard" k="conscius.section.response.body" fallback="ConsciusCMS inserts a reflective conscience token step in publishing flows." />
      </ESection>

      {/* TOKEN FLOW */}
      <ESection fn={["Seccion","TokenFlow"]} es={["stack","container"]} fo="standard">
        <ETexto as="h2" fn="TituloSeccion" fo="acentuada" k="conscius.section.token.title" fallback="Conscience Token Flow" />
        <ETexto as="p" fn="Parrafo" fo="standard" k="conscius.section.token.body" fallback="Before persisting changes, a contextual ethical prompt returns a token requiring explicit reuse." />
        <ESection fn={["Lista","Pasos"]} es={["stack"]} fo="standard">
          <EComponente as="div" fn="Paso" fo="card-elegant">1. Attempt to publish</EComponente>
            <EComponente as="div" fn="Paso" fo="card-elegant">2. Receive conscience prompt + token</EComponente>
            <EComponente as="div" fn="Paso" fo="card-elegant">3. Optional revise / discard</EComponente>
            <EComponente as="div" fn="Paso" fo="card-elegant">4. Redeem token → persist</EComponente>
        </ESection>
      </ESection>

      {/* STANDARD */}
      <ESection fn={["Seccion","Estandar"]} es={["stack","container"]} fo="standard">
        <ETexto as="h2" fn="TituloSeccion" fo="acentuada" k="conscius.section.standard.title" fallback="Toward an Informational Sustainability Standard" />
        <ETexto as="p" fn="Parrafo" fo="standard" k="conscius.section.standard.body" fallback="Open, serverless, deployable under 20 minutes." />
      </ESection>

      {/* COMMUNITY */}
      <ESection fn={["Seccion","Comunidad"]} es={["stack","container"]} fo="standard">
        <ETexto as="h2" fn="TituloSeccion" fo="acentuada" k="conscius.section.community.title" fallback="Community Driven" />
        <ETexto as="p" fn="Parrafo" fo="standard" k="conscius.section.community.body" fallback="A shared effort: developers, researchers, creators." />
      </ESection>

      {/* VALUES */}
      <ESection fn={["Seccion","Valores"]} es={["stack","container"]} fo="standard">
        <ETexto as="h2" fn="TituloSeccion" fo="acentuada" k="conscius.section.values.title" fallback="Core Principles" />
        <ESection fn={["Lista","Valores"]} es={["stack"]} fo="standard">
          <EComponente as="div" fn="Valor" fo="card">Integrity</EComponente>
          <EComponente as="div" fn="Valor" fo="card">Clarity</EComponente>
          <EComponente as="div" fn="Valor" fo="card">Sustainability</EComponente>
          <EComponente as="div" fn="Valor" fo="card">Community</EComponente>
        </ESection>
      </ESection>

      {/* CTA */}
      <ESection fn={["Seccion","CTA"]} es={["stack","container"]} fo={["hero","rounded"]}>
        <ETexto as="h2" fn="TituloSeccion" fo="title-highlight" k="conscius.footer.cta" fallback="Join the Aurora Program" />
        <EComponente as="a" fn="Accion" fo={["btn","btn-primary","rounded"]} href="/documentation">Get Started</EComponente>
      </ESection>
    </EPage>
  );
}

// Basic page-specific style overrides could be added via a SCSS module in futuro.