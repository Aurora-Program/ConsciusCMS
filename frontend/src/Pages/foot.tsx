import { Link } from 'react-router-dom'
import './footer.css'
import { useT } from '../espiralml/i18n'
import { ESection, EComponente, ETexto } from '../espiralml/components'
import '../styles/espiral/conscius-theme.css'
import '../styles/espiral/conscius-tokens.css'

function Foot() {
    const { t } = useT()
    
    return (
        <ESection as='footer' fn={['Footer','Principal']} es={['container']} fo={['glass','rounded']} style={{marginTop:'3rem', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.1)'}}>
            <ESection fn='FooterContent' es={['grid-auto-fit']} fo='standard' style={{padding:'2.5rem 0 1.5rem'}}>
                {/* MARCA Y DESCRIPCIÓN */}
                <EComponente fn='FooterBrand' es='stack' fo='standard'>
                    <EComponente fn='BrandMark' es={['inline']} fo='standard' style={{gap:'0.75rem', alignItems:'center'}}>
                        <EComponente as='img' fn='LogoFooter' src='/aurora-logo-mark.svg' alt='Aurora' style={{width:'42px'}} />
                        <ETexto as='h3' fn='TituloFooter' fo='brand-gradient-text' k='footer.brandTitle' fallback='Aurora Program' />
                    </EComponente>
                    <ETexto as='p' fn='DescFooter' fo='muted' k='footer.tagline' fallback='Ethical electronic intelligence for sustainable digital evolution.' />
                    <EComponente fn='AICredit' fo='standard' style={{marginTop:'1rem'}}>
                        <ETexto as='p' fn='CreditoIA' fo='muted' style={{fontSize:'0.875rem'}} k='footer.aiCredit' fallback='🤝 Created through Human+AI collaboration' />
                    </EComponente>
                </EComponente>

                {/* NAVEGACIÓN */}
                <EComponente fn='FooterNav' es='stack' fo='standard'>
                    <ETexto as='h4' fn='TituloNav' fo='brand-accent' k='footer.navigation' fallback='Navigation' />
                    <ESection fn='LinksNav' es='stack' fo='standard' style={{gap:'0.5rem'}}>
                        <Link to='/' className='fn--Link fo--muted' style={{textDecoration:'none'}}>{t('nav.home', 'Home')}</Link>
                        <Link to='/consciuscms' className='fn--Link fo--muted' style={{textDecoration:'none'}}>ConsciusCMS</Link>
                        <Link to='/manifiesto' className='fn--Link fo--muted' style={{textDecoration:'none'}}>{t('nav.Manifiesto', 'Manifesto')}</Link>
                        <Link to='/plataformas' className='fn--Link fo--muted' style={{textDecoration:'none'}}>{t('nav.platforms', 'Platforms')}</Link>
                        <Link to='/examples' className='fn--Link fo--muted' style={{textDecoration:'none'}}>Examples</Link>
                    </ESection>
                </EComponente>

                {/* PLATAFORMAS */}
                <EComponente fn='FooterPlatforms' es='stack' fo='standard'>
                    <ETexto as='h4' fn='TituloPlataformas' fo='brand-accent' k='footer.platforms' fallback='Platforms' />
                    <ESection fn='LinksPlataformas' es='stack' fo='standard' style={{gap:'0.5rem'}}>
                        <Link to='/plataformas/ethicsi' className='fn--Link fo--muted' style={{textDecoration:'none'}}>EthicsI Foundation</Link>
                        <Link to='/plataformas/innvalab' className='fn--Link fo--muted' style={{textDecoration:'none'}}>InnvaLab</Link>
                        <Link to='/plataformas/harmonia' className='fn--Link fo--muted' style={{textDecoration:'none'}}>Harmonia Coop</Link>
                    </ESection>
                </EComponente>

                {/* RECURSOS */}
                <EComponente fn='FooterResources' es='stack' fo='standard'>
                    <ETexto as='h4' fn='TituloRecursos' fo='brand-accent' k='footer.resources' fallback='Resources' />
                    <ESection fn='LinksRecursos' es='stack' fo='standard' style={{gap:'0.5rem'}}>
                        <Link to='/documentation' className='fn--Link fo--muted' style={{textDecoration:'none'}}>{t('nav.docs', 'Documentation')}</Link>
                        <Link to='/articles' className='fn--Link fo--muted' style={{textDecoration:'none'}}>{t('nav.articles', 'Articles')}</Link>
                        <Link to='/labs' className='fn--Link fo--muted' style={{textDecoration:'none'}}>{t('nav.labs', 'Labs')}</Link>
                    </ESection>
                </EComponente>
            </ESection>

            {/* PIE INFERIOR */}
            <ESection fn='FooterBottom' es={['inline']} fo='standard' style={{padding:'1.5rem 0', borderTop:'1px solid rgba(255,255,255,0.1)', justifyContent:'space-between', alignItems:'center'}}>
                <ETexto as='p' fn='Copyright' fo='muted' k='footer.copyright' fallback='© 2025 Aurora Program. All rights reserved.' />
                <ESection fn='SocialLinks' es={['inline']} fo='standard' style={{gap:'1rem'}}>
                    <EComponente as='a' fn='SocialLink' href='https://github.com/Aurora-Program' target='_blank' rel='noopener noreferrer' fo='muted' style={{textDecoration:'none'}}>
                        <ETexto k='footer.social.github' fallback='GitHub' />
                    </EComponente>
                    <EComponente as='a' fn='SocialLink' href='https://medium.com/@pab.man.alvarez/list/aurora-program-169646e4abe9' target='_blank' rel='noopener noreferrer' fo='muted' style={{textDecoration:'none'}}>
                        <ETexto k='footer.social.medium' fallback='Medium' />
                    </EComponente>
                    <EComponente as='a' fn='SocialLink' href='https://www.linkedin.com/company/107873626/' target='_blank' rel='noopener noreferrer' fo='muted' style={{textDecoration:'none'}}>
                        <ETexto k='footer.social.linkedin' fallback='LinkedIn' />
                    </EComponente>
                </ESection>
            </ESection>
        </ESection>
    )
}

export default Foot