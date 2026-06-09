import { EPage, ESection, EComponente, ETexto } from '../espiralml/components';
import { Link } from 'react-router-dom';
import '../styles/espiral/conscius-theme.css';
import '../styles/espiral/conscius-tokens.css';
import './professional-home.css';
// Import ConstellaCSS siguiendo principios de funciones puras
import '../constellacss/fn.css';
import '../constellacss/es.css';
import '../constellacss/fo.css';
import '../constellacss/conscius-tokens.css';
import cosciusLogo from '/cosciusCMSLogo.png';

/**
 * Página Profesional ConsciusCMS
 * Implementación eficiente usando ConstellaCSS con principios de funciones puras
 * - fn: Funcionalidad (semántica pura)
 * - es: Estructura (layout puro)
 * - fo: Forma (estilo puro)
 */
export default function ProfessionalConsciusCMSHomePage() {
  return (
    <EPage 
      fn={['Pagina','ConsciusCMS','Professional']} 
      es={['fluid','responsive']} 
      fo={['brand-page']} 
      className="fn--BrandPage es--fluid fo--brand-page"
    >
      
      {/* HERO SECTION - Función pura de presentación */}
      <ESection 
        as='main' 
        fn={['Hero','Brand','Presentation']} 
        es={['brand-hero','center']} 
        fo={['gradient','elevated']} 
        className="fn--BrandHero es--brand-hero fo--brand-gradient"
      >
        <div className="hero-content es--brand-stack fo--center">
          
          {/* Logo Component - Función pura de identidad */}
          <EComponente 
            fn={['Logo','Brand','Identity']} 
            es={['inline','center']} 
            fo={['icon','responsive']} 
            className="fn--BrandLogo es--inline fo--brand-icon"
          >
            <img 
              src={cosciusLogo} 
              alt="ConsciusCMS Logo" 
              className="hero-logo-image fo--responsive"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hero-logo-fallback fn--LogoFallback fo--brand-icon" style={{ display: 'none' }}>
              <div className="logo-icon fo--brand-icon">
                <i className="fas fa-brain"></i>
              </div>
              <div className="logo-text es--inline">
                <span className="logo-name fn--BrandName">Conscius</span>
                <span className="logo-suffix fn--BrandSuffix">CMS</span>
              </div>
            </div>
          </EComponente>
          
          {/* Título Principal - Función pura de mensaje */}
          <ETexto 
            as='h1' 
            fn={['Titulo','Hero','Primary']} 
            es={['center']} 
            fo={['gradient','large']} 
            k='conscius.hero.title' 
            fallback='Professional Content Management for the AI Era' 
            className="fn--BrandTitle fo--text-gradient"
          />
          
          {/* Subtítulo - Función pura de descripción */}
          <ETexto 
            as='p' 
            fn={['Subtitulo','Hero','Description']} 
            es={['center','wide']} 
            fo={['muted','readable']} 
            k='conscius.hero.subtitle' 
            fallback='The first CMS designed with consciousness, ethics, and sustainability at its core. Built for professionals who value responsible technology.' 
            className="fn--BrandSubtitle fo--brand-text"
          />
          
          {/* Badges - Función pura de características */}
          <EComponente 
            fn={['BadgeGroup','Features','Highlight']} 
            es={['row','wrap','center']} 
            fo={['spaced']} 
            className="professional-badges es--brand-row fo--spaced"
          >
            <span className='fn--Badge fo--brand-badge'>
              <i className="fas fa-shield-alt"></i> Ethics-First
            </span>
            <span className='fn--Badge fo--brand-badge'>
              <i className="fab fa-github"></i> Open Source
            </span>
            <span className='fn--Badge fo--brand-badge'>
              <i className="fas fa-cloud"></i> Serverless Ready
            </span>
            <span className='fn--Badge fo--brand-badge'>
              <i className="fas fa-users"></i> Community Driven
            </span>
          </EComponente>
          
          {/* CTA Group - Función pura de acciones */}
          <EComponente 
            fn={['CTAGroup','Actions','Primary']} 
            es={['row','center','responsive']} 
            fo={['spaced']} 
            className="cta-group es--brand-row fo--center"
          >
            <Link to='/get-started' className='fn--CTA fo--brand-button'>
              <i className="fas fa-rocket"></i>
              Get Started
            </Link>
            <Link to='/documentation' className='fn--CTA fo--brand-button-outline'>
              <i className="fas fa-book"></i>
              Documentation
            </Link>
            <Link to='/demo' className='fn--CTA fo--brand-button-outline'>
              <i className="fas fa-play"></i>
              Live Demo
            </Link>
          </EComponente>
        </div>
      </ESection>

      {/* STATISTICS SECTION - Función pura de métricas */}
      <ESection 
        fn={['Statistics','Metrics','Trust']} 
        es={['container','grid']} 
        fo={['card','elevated']} 
        className="stats-section fn--BrandStats es--brand-container fo--brand-card"
      >
        <div className="stats-grid es--brand-grid es--grid-4 fo--spaced">
          
          {/* Stat Cards - Funciones puras de datos */}
          <EComponente fn={['StatCard','Downloads']} es={['card']} fo={['stat','brand']} className="stat-card fn--BrandCard fo--brand-stat-card">
            <div className="stat-icon fo--brand-icon">
              <i className="fas fa-download"></i>
            </div>
            <div className="stat-number fn--BrandNumber">10K+</div>
            <div className="stat-label fn--BrandLabel">Downloads</div>
          </EComponente>
          
          <EComponente fn={['StatCard','Rating']} es={['card']} fo={['stat','brand']} className="stat-card fn--BrandCard fo--brand-stat-card">
            <div className="stat-icon fo--brand-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-number fn--BrandNumber">4.9/5</div>
            <div className="stat-label fn--BrandLabel">Rating</div>
          </EComponente>
          
          <EComponente fn={['StatCard','Contributors']} es={['card']} fo={['stat','brand']} className="stat-card fn--BrandCard fo--brand-stat-card">
            <div className="stat-icon fo--brand-icon">
              <i className="fas fa-code-branch"></i>
            </div>
            <div className="stat-number fn--BrandNumber">500+</div>
            <div className="stat-label fn--BrandLabel">Contributors</div>
          </EComponente>
          
          <EComponente fn={['StatCard','Users']} es={['card']} fo={['stat','brand']} className="stat-card fn--BrandCard fo--brand-stat-card">
            <div className="stat-icon fo--brand-icon">
              <i className="fas fa-globe"></i>
            </div>
            <div className="stat-number fn--BrandNumber">1M+</div>
            <div className="stat-label fn--BrandLabel">Users Worldwide</div>
          </EComponente>
        </div>
      </ESection>

      {/* CHALLENGE SECTION - Función pura de problema */}
      <ESection 
        fn={['Challenge','Problem','Awareness']} 
        es={['container','center']} 
        fo={['card','highlighted']} 
        className="challenge-section fn--BrandSection es--brand-container fo--brand-card"
      >
        <div className="section-header es--center fo--spaced">
          <ETexto 
            as='h2' 
            fn={['Titulo','Section','Challenge']} 
            es={['center']} 
            fo={['accent','large']} 
            k='conscius.challenge.title' 
            fallback='The Challenge: Conscious Information Management' 
            className="fn--BrandTitle fo--brand-accent"
          />
          <div className="header-decoration fo--brand-decoration">
            <i className="fas fa-brain"></i>
          </div>
        </div>
        
        <EComponente 
          fn={['Panel','Challenge','Content']} 
          es={['stack','center']} 
          fo={['card','padded']} 
          className="challenge-panel fn--BrandCard fo--brand-card es--brand-stack"
        >
          <div className="challenge-content es--brand-row fo--aligned">
            <div className="challenge-icon fo--brand-icon fo--large">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div className="challenge-text es--stack">
              <ETexto 
                as='h3' 
                fn={['Titulo','Content','Problem']} 
                es={['left']} 
                fo={['bold','medium']} 
                k='conscius.challenge.heading' 
                fallback='Information without Consciousness' 
                className="fn--BrandSubtitle fo--brand-text"
              />
              <ETexto 
                as='p' 
                fn={['Parrafo','Description','Problem']} 
                es={['left','readable']} 
                fo={['muted']} 
                k='conscius.challenge.description' 
                fallback='The modern web faces an unconscious information crisis. Content lacks intentionality, purpose, and ethical consideration. ConsciusCMS addresses this by bringing consciousness to content creation.' 
                className="fn--BrandText fo--brand-text"
              />
            </div>
          </div>
        </EComponente>
      </ESection>

      {/* SOLUTION SECTION - Función pura de solución */}
      <ESection 
        fn={['Solution','Resolution','Innovation']} 
        es={['container','stack']} 
        fo={['gradient','elevated']} 
        className="solution-section fn--BrandSection es--brand-container fo--brand-gradient"
      >
        <div className="section-header es--center fo--spaced">
          <ETexto 
            as='h2' 
            fn={['Titulo','Section','Solution']} 
            es={['center']} 
            fo={['accent','large']} 
            k='conscius.solution.title' 
            fallback='The Solution: Professional CMS with Conscious Purpose' 
            className="fn--BrandTitle fo--brand-accent"
          />
        </div>
        
        <div className="features-grid es--brand-grid es--grid-3 fo--spaced">
          
          {/* Feature Cards - Funciones puras de características */}
          <EComponente 
            fn={['FeatureCard','Architecture','Conscious']} 
            es={['card','center']} 
            fo={['brand','elevated']} 
            className="feature-card fn--BrandCard fo--brand-card"
          >
            <div className="feature-icon fo--brand-icon fo--large">
              <i className="fas fa-brain"></i>
            </div>
            <ETexto 
              as='h3' 
              fn={['Titulo','Feature','Architecture']} 
              es={['center']} 
              fo={['bold','medium']} 
              k='conscius.feature.conscious.title' 
              fallback='Conscious Architecture' 
              className="fn--BrandSubtitle fo--brand-text"
            />
            <ETexto 
              as='p' 
              fn={['Descripcion','Feature','Architecture']} 
              es={['center','readable']} 
              fo={['muted']} 
              k='conscius.feature.conscious.description' 
              fallback='Every component is designed with purpose and ethical consideration at its core.' 
              className="fn--BrandText fo--brand-text"
            />
          </EComponente>
          
          <EComponente 
            fn={['FeatureCard','Performance','Professional']} 
            es={['card','center']} 
            fo={['brand','elevated']} 
            className="feature-card fn--BrandCard fo--brand-card"
          >
            <div className="feature-icon fo--brand-icon fo--large">
              <i className="fas fa-rocket"></i>
            </div>
            <ETexto 
              as='h3' 
              fn={['Titulo','Feature','Performance']} 
              es={['center']} 
              fo={['bold','medium']} 
              k='conscius.feature.performance.title' 
              fallback='Professional Performance' 
              className="fn--BrandSubtitle fo--brand-text"
            />
            <ETexto 
              as='p' 
              fn={['Descripcion','Feature','Performance']} 
              es={['center','readable']} 
              fo={['muted']} 
              k='conscius.feature.performance.description' 
              fallback='Built for enterprise-grade performance with modern web technologies.' 
              className="fn--BrandText fo--brand-text"
            />
          </EComponente>
          
          <EComponente 
            fn={['FeatureCard','Ethics','Design']} 
            es={['card','center']} 
            fo={['brand','elevated']} 
            className="feature-card fn--BrandCard fo--brand-card"
          >
            <div className="feature-icon fo--brand-icon fo--large">
              <i className="fas fa-shield-alt"></i>
            </div>
            <ETexto 
              as='h3' 
              fn={['Titulo','Feature','Ethics']} 
              es={['center']} 
              fo={['bold','medium']} 
              k='conscius.feature.ethics.title' 
              fallback='Ethics by Design' 
              className="fn--BrandSubtitle fo--brand-text"
            />
            <ETexto 
              as='p' 
              fn={['Descripcion','Feature','Ethics']} 
              es={['center','readable']} 
              fo={['muted']} 
              k='conscius.feature.ethics.description' 
              fallback='Privacy, transparency, and user autonomy are built into every feature.' 
              className="fn--BrandText fo--brand-text"
            />
          </EComponente>
        </div>
      </ESection>

      {/* FINAL CTA SECTION - Función pura de conversión */}
      <ESection 
        fn={['CTA','Final','Conversion']} 
        es={['hero','center']} 
        fo={['gradient','elevated']} 
        className="final-cta-section fn--BrandHero es--brand-hero fo--brand-gradient"
      >
        <div className="cta-content es--center fo--spaced">
          <ETexto 
            as='h2' 
            fn={['Titulo','CTA','Final']} 
            es={['center']} 
            fo={['gradient','large']} 
            k='conscius.cta.title' 
            fallback='Ready to Build Consciously?' 
            className="fn--BrandTitle fo--text-gradient"
          />
          <ETexto 
            as='p' 
            fn={['Subtitulo','CTA','Encouragement']} 
            es={['center','wide']} 
            fo={['muted','large']} 
            k='conscius.cta.subtitle' 
            fallback='Join thousands of conscious creators building the future of ethical content management.' 
            className="fn--BrandSubtitle fo--brand-text"
          />
          
          <EComponente 
            fn={['CTAGroup','Final','Actions']} 
            es={['row','center','responsive']} 
            fo={['spaced']} 
            className="cta-buttons es--brand-row fo--center"
          >
            <Link to='/get-started' className='fn--CTA fo--brand-button fo--large'>
              <i className="fas fa-rocket"></i>
              Start Building
            </Link>
            <Link to='/contact' className='fn--CTA fo--brand-button-outline fo--large'>
              <i className="fas fa-envelope"></i>
              Contact Sales
            </Link>
          </EComponente>
        </div>
      </ESection>
    </EPage>
  );
}
