import { EPage, ESection, EComponente, ETexto } from '../espiralml/components';
import { Link } from 'react-router-dom';
import { useT } from '../espiralml/i18n';
import '../styles/espiral/conscius-theme.css';
import '../styles/espiral/conscius-tokens.css';

export default function ConsciusCMSHomePage() {
  const { t } = useT();
  
  return (
    <EPage fn={['Pagina','ConsciusCMSHome']} es={['stack']} fo='standard' style={{background:'var(--conscius-brand-bg)'}}>
      
      {/* HERO PRINCIPAL */}
      <ESection fn={['Hero','Principal']} es={['container','stack','center']} fo={['brand-hero']} className='animate-ascend'>
        <EComponente as='img' fn='LogoConscius' es='inline' fo='standard' 
          src='/ConciusLogo.PNG' alt='ConsciusCMS Logo' 
          style={{width:'140px', height:'auto', marginBottom:'1rem', filter:'drop-shadow(0 4px 16px rgba(0,0,0,.5))'}} />
        
        <ETexto as='h1' fn={['Titulo','Display']} fo={['brand-gradient-text','animated-gradient-text']} 
          k='conscius.hero.title' fallback='ConsciusCMS' />
        
        <ETexto as='p' fn='Subtitulo' fo='brand-accent' style={{fontSize:'1.25rem', textAlign:'center', maxWidth:'600px'}}
          k='conscius.hero.subtitle' fallback='The first CMS designed for the AI era with informational sustainability at its core.' />
        
        <div className='conscius-badges' style={{marginTop:'1.5rem'}}>
          <span className='fo--badge glow-badge fo--brand-glow-border'>Ethics-First</span>
          <span className='fo--badge fo--badge-accent'>Open Source</span>
          <span className='fo--badge'>Serverless Ready</span>
          <span className='fo--badge'>Community Driven</span>
        </div>
        
        <EComponente fn='CTAGroup' es={['inline','center']} fo='standard' style={{marginTop:'2rem', gap:'1rem'}}>
          <Link to='/examples' className='fn--Accion es--inline fo--btn fo--btn-primary fo--rounded fo--accent-ring'>
            Get Started
          </Link>
          <Link to='/documentation' className='fn--Accion es--inline fo--btn fo--btn-outline fo--rounded'>
            Documentation
          </Link>
        </EComponente>
      </ESection>

      {/* PROBLEMA - DEAD INTERNET THEORY */}
      <ESection fn={['Seccion','Problema']} es={['container','stack']} fo='standard' style={{padding:'4rem 0'}}>
        <ETexto as='h2' fn='TituloSeccion' fo='brand-gradient-text' style={{textAlign:'center', fontSize:'2.25rem'}}
          k='conscius.problem.title' fallback='The Problem: Information Sustainability' />
        
        <EComponente fn='ProblemaPanel' fo={['glass','rounded','panel-elevated']} es='stack' style={{padding:'2.5rem', maxWidth:'800px', margin:'0 auto'}}>
          <ETexto as='p' fn='TextoProblema' fo='brand-fg' style={{fontSize:'1.125rem', lineHeight:'1.6'}}
            k='conscius.problem.deadInternet' 
            fallback='The Dead Internet Theory suggests much online content is no longer human-generated. Whether literal or metaphorical, this reflects a real risk: an information ecosystem where saturation and distrust lead to chaos.' />
          
          <ETexto as='p' fn='TextoProblema' fo='brand-fg-muted' style={{fontSize:'1.125rem', lineHeight:'1.6'}}
            k='conscius.problem.sustainability' 
            fallback='Just as the environment has pollution limits, our information ecosystem has a carrying capacity. Digital pollution—disinformation, spam, low-quality content—threatens the foundation of trust we need for a functioning society.' />
        </EComponente>
      </ESection>

      {/* SOLUCIÓN - CMS WITH CONSCIENCE */}
      <ESection fn={['Seccion','Solucion']} es={['container','stack']} fo='standard' style={{padding:'4rem 0'}}>
        <ETexto as='h2' fn='TituloSeccion' fo='brand-gradient-text' style={{textAlign:'center', fontSize:'2.25rem'}}
          k='conscius.solution.title' fallback='The Response: A CMS with Conscience' />
        
        <ESection fn='GridSolucion' es={['grid-auto-fit']} fo='standard' style={{gap:'2rem', marginTop:'2rem'}}>
          
          {/* AI-Era Design */}
          <EComponente fn='SolucionCard' fo={['card-elegant','rounded','panel-elevated']} className='animate-ascend-delayed'>
            <div style={{padding:'2rem'}}>
              <ETexto as='h3' fn='TituloCard' fo='brand-gradient-text' 
                k='conscius.solution.aiEra.title' fallback='Designed for the AI Era' />
              <ETexto as='p' fn='DescCard' fo='brand-fg-muted' style={{lineHeight:'1.6'}}
                k='conscius.solution.aiEra.desc' 
                fallback='Built on two assumptions: most websites will be created by AI, and much content will be AI-generated. We embrace this reality while adding ethical guardrails.' />
            </div>
          </EComponente>

          {/* Conscience Token Flow */}
          <EComponente fn='SolucionCard' fo={['card-elegant','rounded','panel-elevated']} className='animate-ascend-delayed'>
            <div style={{padding:'2rem'}}>
              <ETexto as='h3' fn='TituloCard' fo='brand-gradient-text' 
                k='conscius.solution.token.title' fallback='Conscience Token Flow' />
              <ETexto as='p' fn='DescCard' fo='brand-fg-muted' style={{lineHeight:'1.6'}}
                k='conscius.solution.token.desc' 
                fallback='Every publish action requires a reflection moment. The system issues a conscience prompt and token—only after conscious confirmation does content go live.' />
            </div>
          </EComponente>

          {/* Open Standard */}
          <EComponente fn='SolucionCard' fo={['card-elegant','rounded','panel-elevated']} className='animate-ascend-delayed'>
            <div style={{padding:'2rem'}}>
              <ETexto as='h3' fn='TituloCard' fo='brand-gradient-text' 
                k='conscius.solution.standard.title' fallback='Informational Sustainability Standard' />
              <ETexto as='p' fn='DescCard' fo='brand-fg-muted' style={{lineHeight:'1.6'}}
                k='conscius.solution.standard.desc' 
                fallback='Open source and deployable in 20 minutes. Our goal is establishing an ethics standard for content management, not competing with existing platforms.' />
            </div>
          </EComponente>

        </ESection>
      </ESection>

      {/* ARQUITECTURA TÉCNICA */}
      <ESection fn={['Seccion','Arquitectura']} es={['container','stack']} fo='standard' style={{padding:'4rem 0'}}>
        <ETexto as='h2' fn='TituloSeccion' fo='brand-gradient-text' style={{textAlign:'center', fontSize:'2.25rem'}}
          k='conscius.architecture.title' fallback='Technical Architecture' />
        
        <EComponente fn='ArquitecturaPanel' fo={['glass','rounded','panel-elevated']} es='stack' style={{padding:'2.5rem', maxWidth:'900px', margin:'2rem auto 0'}}>
          
          <ESection fn='SubseccionArq' es='stack' fo='standard'>
            <ETexto as='h3' fn='SubtituloArq' fo='brand-accent' style={{fontSize:'1.5rem'}}
              k='conscius.architecture.espiralml.title' fallback='EspiralML Semantic Layer' />
            <ETexto as='p' fn='DescArq' fo='brand-fg-muted' style={{lineHeight:'1.6'}}
              k='conscius.architecture.espiralml.desc' 
              fallback='Three orthogonal axes (fn/es/fo) separate function, structure, and form. This enables clean component composition, agent-readable semantics, and theme flexibility without DOM rewrites.' />
          </ESection>

          <div className='fo--divider' style={{margin:'1.5rem 0'}} />

          <ESection fn='SubseccionArq' es='stack' fo='standard'>
            <ETexto as='h3' fn='SubtituloArq' fo='brand-accent' style={{fontSize:'1.5rem'}}
              k='conscius.architecture.constellacss.title' fallback='ConstellaCSS Design System' />
            <ETexto as='p' fn='DescArq' fo='brand-fg-muted' style={{lineHeight:'1.6'}}
              k='conscius.architecture.constellacss.desc' 
              fallback='Token-driven CSS architecture that scales predictably. Design tokens map to utility classes, enabling consistent theming and automated design system evolution.' />
          </ESection>

          <div className='fo--divider' style={{margin:'1.5rem 0'}} />

          <ESection fn='SubseccionArq' es='stack' fo='standard'>
            <ETexto as='h3' fn='SubtituloArq' fo='brand-accent' style={{fontSize:'1.5rem'}}
              k='conscius.architecture.i18n.title' fallback='Multilingual by Design' />
            <ETexto as='p' fn='DescArq' fo='brand-fg-muted' style={{lineHeight:'1.6'}}
              k='conscius.architecture.i18n.desc' 
              fallback='Built-in translation infrastructure with semantic key hierarchy. Supports global content distribution while maintaining narrative consistency across languages.' />
          </ESection>

        </EComponente>
      </ESection>

      {/* PRINCIPIOS DE SOSTENIBILIDAD */}
      <ESection fn={['Seccion','Principios']} es={['container','stack']} fo='standard' style={{padding:'4rem 0'}}>
        <ETexto as='h2' fn='TituloSeccion' fo='brand-gradient-text' style={{textAlign:'center', fontSize:'2.25rem'}}
          k='conscius.principles.title' fallback='Sustainability Principles' />
        
        <ESection fn='GridPrincipios' es={['grid-auto-fit']} fo='standard' style={{gap:'1.5rem', marginTop:'2rem'}}>
          
          {[
            { k: 'semantic', title: 'Semantic Integrity', desc: 'Schema versioning, hierarchical keys, and generated documentation prevent meaning drift over time.' },
            { k: 'energetic', title: 'Energy Efficiency', desc: 'Smart caching, lazy loading, and CSS deduplication minimize resource waste.' },
            { k: 'evolutionary', title: 'Evolutionary Resilience', desc: 'Declarative manifests and controlled codegen prevent exponential complexity growth.' },
            { k: 'ethical', title: 'Ethical Friction', desc: 'Conscience tokens add reflective pause to prevent automated content pollution.' }
          ].map(p => (
            <EComponente key={p.k} fn='PrincipioCard' fo={['card-elegant','rounded']} className='animate-ascend-delayed'>
              <div style={{padding:'1.75rem'}}>
                <ETexto as='h4' fn='TituloPrincipio' fo='brand-gradient-text' 
                  k={`conscius.principles.${p.k}.title`} fallback={p.title} />
                <ETexto as='p' fn='DescPrincipio' fo='brand-fg-muted' style={{lineHeight:'1.5', fontSize:'.95rem'}}
                  k={`conscius.principles.${p.k}.desc`} fallback={p.desc} />
              </div>
            </EComponente>
          ))}
          
        </ESection>
      </ESection>

      {/* COMMUNITY & LLAMADA A LA ACCIÓN */}
      <ESection fn={['Seccion','Community']} es={['container','stack','center']} fo='standard' style={{padding:'6rem 0'}}>
        <EComponente fn='CommunityPanel' fo={['glass','rounded','panel-elevated']} es={['stack','center']} style={{padding:'3rem', maxWidth:'700px', textAlign:'center'}}>
          
          <ETexto as='h2' fn='TituloCommunity' fo='brand-gradient-text' style={{fontSize:'2.25rem', marginBottom:'1rem'}}
            k='conscius.community.title' fallback='Join the Aurora Program' />
          
          <ETexto as='p' fn='DescCommunity' fo='brand-fg' style={{fontSize:'1.125rem', lineHeight:'1.6', marginBottom:'2rem'}}
            k='conscius.community.desc' 
            fallback='ConsciusCMS is community-driven software with purpose. We invite developers, creators, researchers, and institutions to help cultivate a new digital conscience.' />
          
          <ETexto as='p' fn='CommunityQuote' fo='brand-accent' style={{fontSize:'1rem', fontStyle:'italic', marginBottom:'2rem'}}
            k='conscius.community.quote' 
            fallback='"Information must be treated with the same responsibility we care for the planet: with awareness, sustainability, and respect for truth."' />
          
          <ESection fn='CTAButtons' es={['inline','center']} fo='standard' style={{gap:'1rem', flexWrap:'wrap'}}>
            <Link to='/examples' className='fn--Accion es--inline fo--btn fo--btn-primary fo--rounded fo--accent-ring'>
              {t('conscius.community.cta.start', 'Start Building')}
            </Link>
            <Link to='/documentation' className='fn--Accion es--inline fo--btn fo--btn-outline fo--rounded'>
              {t('conscius.community.cta.contribute', 'Contribute')}
            </Link>
            <a href='https://github.com/Aurora-Program' target='_blank' rel='noopener noreferrer' 
               className='fn--Accion es--inline fo--btn fo--btn-outline fo--rounded'>
              {t('conscius.community.cta.github', 'GitHub')}
            </a>
          </ESection>
          
        </EComponente>
      </ESection>

      {/* FOOTER MINIMAL */}
      <ESection fn='Footer' es={['container','center']} fo='standard' style={{padding:'2rem 0', borderTop:'1px solid rgba(255,255,255,0.1)'}}>
        <ETexto as='p' fn='Copyright' fo='brand-fg-muted' style={{fontSize:'.875rem'}}
          k='conscius.footer.copyright' 
          fallback='© 2025 Aurora Program. Open source under MIT License.' />
      </ESection>

    </EPage>
  );
}
