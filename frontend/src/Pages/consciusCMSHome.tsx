import { EPage, ESection, EComponente, ETexto } from '../espiralml/components';
import { Link } from 'react-router-dom';
import '../styles/espiral/conscius-theme.css';
import '../styles/espiral/conscius-tokens.css';

export default function ConsciusCMSHome() {
  return (
    <EPage fn={['Pagina','ConsciusCMSHome']} es={['stack']} fo='standard'>
      {/* HERO PRINCIPAL */}
      <ESection fn={['Hero','Principal']} es={['stack','container']} fo={['brand-hero','rounded']} className='animate-ascend fo--particles'>
        <EComponente as='div' fn='Identidad' es={['stack','center']} fo='standard'>
          <EComponente 
            as='img' 
            fn='LogoCentral' 
            es='inline' 
            fo='standard' 
            src='/cosciusCMSLogo.png' 
            alt='ConsciusCMS Logo' 
            style={{width:'140px', filter:'drop-shadow(0 4px 16px rgba(0,0,0,.6))'}} 
          />
          <ETexto as='h1' fn='Titulo' fo='brand-gradient-text' k='conscius.hero.title' fallback='ConsciusCMS: Conscious Content Infrastructure' />
          <ETexto as='p' fn='Subtitulo' fo='muted' k='conscius.hero.subtitle' fallback='Sustainable Content Management for Ethical Digital Evolution' />
          
          <div className='conscius-badges'>
            <span className='fo--badge glow-badge fo--brand-glow-border'>Ethics-First</span>
            <span className='fo--badge fo--badge-accent'>Human+AI</span>
            <span className='fo--badge'>Sustainable</span>
            <span className='fo--badge'>Semantic</span>
          </div>
          
          <EComponente as='div' fn='CTAGroup' es='inline' fo='standard' style={{marginTop:'2rem'}}>
            <Link to='/examples' className='fn--Accion es--inline fo--btn fo--btn-primary fo--rounded'>Explore Examples</Link>
            <Link to='/documentation' className='fn--Accion es--inline fo--btn fo--btn-outline fo--rounded'>Read Docs</Link>
          </EComponente>
        </EComponente>
      </ESection>

      {/* PROBLEMA Y RESPUESTA */}
      <ESection fn={['Seccion','Problema']} es={['container','stack']} fo='standard'>
        <ETexto as='h2' fn='TituloSeccion' fo='brand-gradient-text' k='conscius.section.problem.title' fallback='The Information Sustainability Challenge' />
        <ESection fn='GridProblema' es={['grid-auto-fit']} fo='standard'>
          <EComponente fn='ProblemaCard' fo={['card-elegant','rounded','panel-elevated']} className='animate-ascend-delayed'>
            <ETexto as='h3' fn='TituloCard' fo='brand-accent' k='conscius.section.problem.entropy.title' fallback='Entropy Growth' />
            <ETexto as='p' fn='DescCard' fo='muted' k='conscius.section.problem.entropy.desc' fallback='Digital systems accumulate complexity and technical debt over time.' />
          </EComponente>
          <EComponente fn='ProblemaCard' fo={['card-elegant','rounded','panel-elevated']} className='animate-ascend-delayed'>
            <ETexto as='h3' fn='TituloCard' fo='brand-accent' k='conscius.section.problem.ethics.title' fallback='Ethical Friction' />
            <ETexto as='p' fn='DescCard' fo='muted' k='conscius.section.problem.ethics.desc' fallback='Publishing lacks reflective pauses for responsible decision-making.' />
          </EComponente>
          <EComponente fn='ProblemaCard' fo={['card-elegant','rounded','panel-elevated']} className='animate-ascend-delayed'>
            <ETexto as='h3' fn='TituloCard' fo='brand-accent' k='conscius.section.problem.semantic.title' fallback='Semantic Drift' />
            <ETexto as='p' fn='DescCard' fo='muted' k='conscius.section.problem.semantic.desc' fallback='Content meaning degrades without structured frameworks.' />
          </EComponente>
        </ESection>
      </ESection>

      {/* RESPUESTA CONSCIUS */}
      <ESection fn={['Seccion','Respuesta']} es={['container','stack']} fo='standard'>
        <ETexto as='h2' fn='TituloSeccion' fo='animated-gradient-text' k='conscius.section.response.title' fallback='ConsciusCMS Response' />
        <EComponente fn='RespuestaPanel' fo={['glass','rounded','panel-elevated']} es='stack' style={{padding:'2.5rem'}}>
          <ETexto as='p' fn='RespuestaIntro' fo='muted' k='conscius.section.response.body' fallback='A reflective publish flow introducing an ethical pause.' />
          
          <ESection fn='PilaresList' es={['stack']} fo='standard' style={{marginTop:'1.5rem'}}>
            <EComponente fn='Pilar' es={['inline']} fo='standard' style={{gap:'1rem', alignItems:'flex-start'}}>
              <EComponente fn='PilarIcon' fo='badge-accent' style={{minWidth:'2.5rem', height:'2.5rem', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <ETexto as='span' fo='standard' k='conscius.section.pillars.semantic.icon' fallback='🏗️' />
              </EComponente>
              <EComponente fn='PilarContent' es='stack' fo='standard'>
                <ETexto as='h3' fn='PilarTitulo' fo='brand-gradient-text' k='conscius.section.pillars.semantic.title' fallback='Semantic Architecture' />
                <ETexto as='p' fn='PilarDesc' fo='muted' k='conscius.section.pillars.semantic.desc' fallback='Three-axis composition ensures readable and maintainable interfaces.' />
              </EComponente>
            </EComponente>
            
            <EComponente fn='Pilar' es={['inline']} fo='standard' style={{gap:'1rem', alignItems:'flex-start'}}>
              <EComponente fn='PilarIcon' fo='badge-accent' style={{minWidth:'2.5rem', height:'2.5rem', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <ETexto as='span' fo='standard' k='conscius.section.pillars.ethics.icon' fallback='⚖️' />
              </EComponente>
              <EComponente fn='PilarContent' es='stack' fo='standard'>
                <ETexto as='h3' fn='PilarTitulo' fo='brand-gradient-text' k='conscius.section.pillars.ethics.title' fallback='Ethics Flow' />
                <ETexto as='p' fn='PilarDesc' fo='muted' k='conscius.section.pillars.ethics.desc' fallback='Two-step publish confirmation creates reflective friction.' />
              </EComponente>
            </EComponente>
            
            <EComponente fn='Pilar' es={['inline']} fo='standard' style={{gap:'1rem', alignItems:'flex-start'}}>
              <EComponente fn='PilarIcon' fo='badge-accent' style={{minWidth:'2.5rem', height:'2.5rem', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <ETexto as='span' fo='standard' k='conscius.section.pillars.i18n.icon' fallback='🌍' />
              </EComponente>
              <EComponente fn='PilarContent' es='stack' fo='standard'>
                <ETexto as='h3' fn='PilarTitulo' fo='brand-gradient-text' k='conscius.section.pillars.i18n.title' fallback='Global Semantics' />
                <ETexto as='p' fn='PilarDesc' fo='muted' k='conscius.section.pillars.i18n.desc' fallback='Structured translation system ensures consistent meaning.' />
              </EComponente>
            </EComponente>
          </ESection>
        </EComponente>
      </ESection>

      {/* VALORES CORE */}
      <ESection fn={['Seccion','Valores']} es={['container','stack']} fo='standard'>
        <ETexto as='h2' fn='TituloSeccion' fo='brand-gradient-text' k='conscius.section.values.title' fallback='Core Principles' />
        <ESection fn='GridValores' es={['grid-auto-fit']} fo='standard'>
          {[
            { k:'integrity', label:'Integrity', desc:'Transparent processes and verifiable actions.'},
            { k:'clarity', label:'Clarity', desc:'Readable semantics over accidental complexity.'},
            { k:'sustainability', label:'Sustainability', desc:'Resource awareness & informational balance.'},
            { k:'community', label:'Community', desc:'Shared stewardship & open evolution.'}
          ].map(v => (
            <EComponente key={v.k} as='div' fn='Valor' fo={['card-elegant','rounded','panel-elevated']} className='fo--card fo--card-elegant animate-ascend-delayed'>
              <ETexto as='h3' fn='TituloValor' fo='brand-gradient-text' k={`conscius.section.values.${v.k}.title`} fallback={v.label} />
              <ETexto as='p' fn='DescripcionValor' fo='muted' k={`conscius.section.values.${v.k}.desc`} fallback={v.desc} />
            </EComponente>
          ))}
        </ESection>
      </ESection>

      {/* CTA FINAL */}
      <ESection fn={['Seccion','CTA']} es={['container','center']} fo='standard'>
        <ESection fn='CTAContent' es={['stack','center']} fo='standard' style={{maxWidth:'600px'}}>
          <ETexto as='h2' fn='CTATitulo' fo='brand-gradient-text' k='conscius.footer.cta' fallback='Join the Aurora Program' />
          <ETexto as='p' fn='CTADesc' fo='muted' k='conscius.footer.join' fallback='Get Started with conscious content management.' />
          
          <EComponente as='div' fn='CTAActions' es='inline' fo='standard' style={{marginTop:'2rem', gap:'1rem'}}>
            <Link to='/examples' className='fn--Accion es--inline fo--btn fo--btn-primary fo--rounded'>Start Exploring</Link>
            <Link to='/documentation' className='fn--Accion es--inline fo--btn fo--btn-outline fo--rounded'>View Documentation</Link>
            <Link to='/plataformas' className='fn--Accion es--inline fo--btn fo--btn-outline fo--rounded'>Aurora Ecosystem</Link>
          </EComponente>
        </ESection>
      </ESection>
      
      <ESection fn='Division' es='container' fo='standard'>
        <div className='fo--divider' />
      </ESection>
    </EPage>
  );
}
