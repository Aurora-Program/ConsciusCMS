import { EPage, ESection, EComponente, ETexto } from '../espiralml/components';
import { Link } from 'react-router-dom';
import '../styles/espiral/conscius-theme.css';
import '../styles/espiral/conscius-tokens.css';
import './professional-home.css';
// Import ConstellaCSS Super Eficiente
import '../constellacss/conscius-super-efficient.css';

/**
 * Página Profesional ConsciusCMS
 * Implementación SUPER EFICIENTE con ConstellaCSS optimizado
 * 
 * Sistema de funciones puras implementado:
 * ✅ Inmutabilidad: Estilos predecibles y cacheables
 * ✅ Composabilidad: Funciones combinables sin conflictos  
 * ✅ Memoización: Evita re-cálculos innecesarios
 * ✅ Lazy Evaluation: Evaluación solo cuando es necesaria
 * ✅ GPU Acceleration: Optimización hardware para elementos críticos
 * ✅ Containment: Aislamiento de rendering para mejor performance
 * 
 * Principios de funciones puras aplicados:
 * - fn: Semántica pura (sin efectos secundarios)
 * - es: Estructura pura (layout determinista)
 * - fo: Forma pura (estilos inmutables)
 */
export default function ProfessionalConsciusCMSHomePage() {
  return (
    <EPage 
      fn={['Pagina','Professional']} 
      es={['fluid']} 
      fo={['brand']} 
      className="conscius-professional-page above-fold"
      data-semantic="professional-cms-page"
    >
      
      {/* HERO SECTION */}
      <ESection 
        as='main' 
        fn={['Hero','Brand']} 
        es={['hero','center']} 
        fo={['gradient']} 
        className="conscius-hero-section above-fold"
        data-semantic="brand-hero-section"
      >
        <div className="hero-content es--stack fo--center space-phi-2">
          
          <ETexto 
            as='h1' 
            k='hero-title'
            fn={['Titulo','Hero']} 
            es={['center']} 
            fo={['gradient','large']} 
            fallback='Professional Content Management' 
            className="u-text-gradient text-scale-3 above-fold"
            data-semantic="hero-main-title"
          />
          
          <ETexto 
            as='p' 
            k='hero-subtitle'
            fn={['Subtitulo','Hero']} 
            es={['center']} 
            fo={['muted']} 
            fallback='Built with consciousness and professional standards for the AI era.' 
            className="fo--brand-text text-scale-2"
            data-semantic="hero-subtitle"
          />
          
          <EComponente 
            fn={['CTAGroup','Primary']} 
            es={['row','center']} 
            fo={['spaced']} 
            className="cta-group es--brand-row fo--center gap-phi-2"
            data-semantic="hero-cta-group"
          >
            <Link to='/get-started' className='fo--brand-button'>
              Get Started
            </Link>
            <Link to='/documentation' className='fo--brand-button-outline'>
              Documentation
            </Link>
          </EComponente>
        </div>
      </ESection>

      {/* STATS SECTION */}
      <ESection 
        fn={['Statistics','Trust']} 
        es={['container','grid']} 
        fo={['card']} 
        className="stats-section scroll-optimized space-phi-3"
        data-semantic="trust-statistics"
      >
        <div className="stats-grid es--grid-4 gap-phi-2">
          <EComponente fn={['StatCard']} es={['card']} fo={['stat']} className="conscius-content-card u-hover-scale">
            <div className="fn--BrandNumber text-scale-3 color-brand">10K+</div>
            <div className="fn--BrandLabel text-scale-1 color-muted">Downloads</div>
          </EComponente>
          
          <EComponente fn={['StatCard']} es={['card']} fo={['stat']} className="conscius-content-card u-hover-scale">
            <div className="fn--BrandNumber text-scale-3 color-brand">4.9/5</div>
            <div className="fn--BrandLabel text-scale-1 color-muted">Rating</div>
          </EComponente>
          
          <EComponente fn={['StatCard']} es={['card']} fo={['stat']} className="conscius-content-card u-hover-scale">
            <div className="fn--BrandNumber text-scale-3 color-brand">Enterprise</div>
            <div className="fn--BrandLabel text-scale-1 color-muted">Ready</div>
          </EComponente>
          
          <EComponente fn={['StatCard']} es={['card']} fo={['stat']} className="conscius-content-card u-hover-scale">
            <div className="fn--BrandNumber text-scale-3 color-brand">50+</div>
            <div className="fn--BrandLabel text-scale-1 color-muted">Countries</div>
          </EComponente>
        </div>
      </ESection>

      {/* CHALLENGE SECTION */}
      <ESection 
        fn={['Seccion','Challenge']} 
        es={['container','section']} 
        fo={['standard']} 
        className="challenge-section scroll-optimized space-phi-3"
        data-semantic="challenge-section"
      >
        <div className="section-header es--text-center">
          <ETexto 
            as='h2' 
            k='challenge-title'
            fn={['TituloSeccion']} 
            fo={['accent']} 
            fallback='The Challenge: Conscious Information Management' 
            className="text-scale-3 color-accent space-phi"
          />
          
          <ETexto 
            as='p' 
            k='challenge-description'
            fn={['Descripcion']} 
            fo={['muted']} 
            fallback='Modern organizations struggle with fragmented content systems and unconscious data handling.' 
            className="text-scale-2 color-muted space-phi"
          />
        </div>
      </ESection>

      {/* SOLUTION SECTION */}
      <ESection 
        fn={['Seccion','Solution']} 
        es={['container','stack']} 
        fo={['professional']} 
        className="solution-section scroll-optimized space-phi-3"
        data-semantic="solution-section"
      >
        <div className="section-header">
          <ETexto 
            as='h2' 
            k='solution-title'
            fn={['TituloSeccion']} 
            fo={['professional']} 
            fallback='The Solution: Professional CMS with Consciousness' 
            className="text-scale-3 color-brand space-phi"
          />
          
          <ETexto 
            as='p' 
            k='solution-description'
            fn={['Descripcion']} 
            fo={['standard']} 
            fallback='ConsciusCMS integrates intelligent content management with conscious design principles.' 
            className="text-scale-2 color-muted space-phi"
          />
        </div>
        
        <div className="solution-features es--grid-3 gap-phi-2 space-phi-2">
          <EComponente fn={['FeatureCard']} es={['card']} fo={['feature']} className="conscius-content-card">
            <div className="feature-icon text-scale-3 space-phi">🧠</div>
            <ETexto as='h3' k='ai-feature' fn={['FeatureTitulo']} fallback='AI-Powered' className="text-scale-2 color-brand" />
            <ETexto as='p' k='ai-description' fn={['FeatureDescripcion']} fallback='Intelligent content assistance and optimization' className="text-scale-1 color-muted" />
          </EComponente>
          
          <EComponente fn={['FeatureCard']} es={['card']} fo={['feature']} className="conscius-content-card">
            <div className="feature-icon text-scale-3 space-phi">⚡</div>
            <ETexto as='h3' k='performance-feature' fn={['FeatureTitulo']} fallback='High Performance' className="text-scale-2 color-brand" />
            <ETexto as='p' k='performance-description' fn={['FeatureDescripcion']} fallback='Optimized for speed and scalability' className="text-scale-1 color-muted" />
          </EComponente>
          
          <EComponente fn={['FeatureCard']} es={['card']} fo={['feature']} className="conscius-content-card">
            <div className="feature-icon text-scale-3 space-phi">🎯</div>
            <ETexto as='h3' k='conscious-feature' fn={['FeatureTitulo']} fallback='Conscious Design' className="text-scale-2 color-brand" />
            <ETexto as='p' k='conscious-description' fn={['FeatureDescripcion']} fallback='Built with awareness and intentional architecture' className="text-scale-1 color-muted" />
          </EComponente>
        </div>
      </ESection>

      {/* CTA SECTION */}
      <ESection 
        fn={['Seccion','CTA']} 
        es={['container','center']} 
        fo={['accent']} 
        className="cta-section scroll-optimized space-phi-3"
        data-semantic="final-cta"
      >
        <div className="cta-content es--stack fo--center space-phi-2">
          <ETexto 
            as='h2' 
            k='cta-title'
            fn={['CTATitulo']} 
            fo={['accent']} 
            fallback='Ready to Transform Your Content Management?' 
            className="text-scale-3 color-accent"
          />
          
          <EComponente 
            fn={['CTAGroup','Final']} 
            es={['row','center']} 
            fo={['spaced']} 
            className="cta-buttons es--row fo--center gap-phi-2"
          >
            <Link to='/get-started' className='fo--primary-button'>
              Start Your Journey
            </Link>
            <Link to='/demo' className='fo--secondary-button'>
              Request Demo
            </Link>
          </EComponente>
        </div>
      </ESection>
    </EPage>
  );
}
