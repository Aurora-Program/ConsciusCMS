import { EPage, ESection, EComponente, ETexto } from '../espiralml/components';
import { Link } from 'react-router-dom';
import auroraLogo from '../assets/aurora-logo.png';
import '../styles/espiral/conscius-theme.css';
import '../styles/espiral/conscius-tokens.css';

export default function HomeEspiral(){
  return (
    <EPage fn={['Pagina','HomeEspiral']} es={['stack']} fo='standard'>
      {/* HERO */}
  <ESection fn={['Hero','Principal']} es={['stack','container']} fo={['brand-hero','rounded']} className='animate-ascend'>
        <EComponente as='div' fn='Identidad' es={['stack','center']} fo='standard'>
          <EComponente as='img' fn='LogoCentral' es='inline' fo='standard' src={auroraLogo} alt='Aurora main logo' style={{width:'120px', filter:'drop-shadow(0 4px 12px rgba(0,0,0,.45))'}} />
          <ETexto as='h1' fn='Titulo' fo='brand-gradient-text' k='home.heroTitle' fallback='Aurora Program' />
          <ETexto as='p' fn='Subtitulo' fo='muted' k='home.heroSubtitle' fallback='Ethical electronic intelligence.' />
          <div className='conscius-badges'>
            <span className='fo--badge glow-badge fo--brand-glow-border'>Ethics-first</span>
            <span className='fo--badge'>Sustainable</span>
            <span className='fo--badge'>Composable</span>
            <span className='fo--badge fo--badge-accent'>Multilingual</span>
          </div>
          <EComponente as='div' fn='CTAGroup' es='inline' fo='standard' style={{marginTop:'1.5rem'}}>
            <Link to='/consciuscms' className='fn--Accion es--inline fo--btn fo--btn-primary fo--rounded'>ConsciusCMS</Link>
            <Link to='/documentation' className='fn--Accion es--inline fo--btn fo--btn-outline fo--rounded'>Docs</Link>
          </EComponente>
        </EComponente>
      </ESection>

      {/* VALUES */}
      <ESection fn={['Seccion','Valores']} es={['container','stack']} fo='standard'>
        <ETexto as='h2' fn='TituloSeccion' fo='acentuada' k='conscius.section.values.title' fallback='Core Principles' />
        <ESection fn='GridValores' es={['grid-auto-fit']} fo='standard'>
          {[
            { k:'integrity', label:'Integrity', desc:'Transparent processes and verifiable actions.'},
            { k:'clarity', label:'Clarity', desc:'Readable semantics over accidental complexity.'},
            { k:'sustainability', label:'Sustainability', desc:'Resource awareness & informational balance.'},
            { k:'community', label:'Community', desc:'Shared stewardship & open evolution.'}
          ].map(v => (
            <EComponente key={v.k} as='div' fn='Valor' fo={['card-elegant','rounded','panel-elevated']} className='fo--card fo--card-elegant animate-ascend-delayed'>
              <ETexto as='h3' fn='TituloValor' fo='brand-gradient-text' k={`home.values.${v.k}.title`} fallback={v.label} />
              <ETexto as='p' fn='DescripcionValor' fo='muted' k={`home.values.${v.k}.desc`} fallback={v.desc} />
            </EComponente>
          ))}
        </ESection>
      </ESection>
      <ESection fn='Division' es='container' fo='standard'>
        <div className='fo--divider' />
      </ESection>

      {/* SECONDARY FEATURE PROMO */}
      <ESection fn='FeatureShowcase' es={['container','stack']} fo='standard'>
        <ETexto as='h2' fn='TituloFeature' fo='brand-gradient-text' k='home.feature.coreTitle' fallback='Semantic + Ethical Core' />
        <ETexto as='p' fn='FeatureIntro' fo='muted' k='home.feature.coreIntro' fallback='A compositional layer (EspiralML) + tokenized conscience actions ensure integrity in automation and design evolution.' />
        <EComponente fn='FeaturePanel' fo={['glass','rounded','panel-elevated']} es='stack' style={{padding:'2rem 2.25rem'}}>          
          <ETexto as='p' fn='Linea' fo='muted' k='home.feature.line1' fallback='Templates + JSON schema drive reproducible structures.' />
          <ETexto as='p' fn='Linea' fo='muted' k='home.feature.line2' fallback='i18n layer ensures global narratives remain consistent.' />
          <ETexto as='p' fn='Linea' fo='muted' k='home.feature.line3' fallback='Ethics publish flow adds reflective friction before impact.' />
          <EComponente fn='MiniCTA' es='inline' fo='standard' style={{marginTop:'1rem'}}>
            <Link to='/consciuscms' className='fn--Accion es--inline fo--btn fo--btn-primary fo--rounded'>Explore ConsciusCMS</Link>
            <Link to='/examples' className='fn--Accion es--inline fo--btn fo--btn-outline fo--rounded'>View Examples</Link>
          </EComponente>
        </EComponente>
      </ESection>
    </EPage>
  );
}
