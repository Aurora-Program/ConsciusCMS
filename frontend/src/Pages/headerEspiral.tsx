import { ESection, EComponente, ETexto } from '../espiralml/components';
import { Link } from 'react-router-dom';
import { useT } from '../espiralml/i18n';
import '../styles/espiral/conscius-theme.css';

export default function HeaderEspiral(){
  const { t } = useT();
  return (
    <ESection as='header' fn={['Header','Nav']} es={['container','inline']} fo='glass' style={{backdropFilter:'blur(12px)', padding:'0.75rem 1rem', borderRadius:'20px', marginTop:'1rem'}}>
      <ESection fn='Brand' es={['inline','center']} fo='standard' className='brand-block' style={{gap:'0.75rem'}}>
  <EComponente as='img' fn='Logo' es='inline' fo='standard' src='/aurora-logo-mark.svg' alt='Aurora Logo' style={{width:'58px'}} />
        <ETexto as='h1' fn='Titulo' fo='brand-gradient-text' k='conscius.hero.title' fallback='ConsciusCMS' />
      </ESection>
      <ESection fn='Menu' as='nav' es={['inline']} fo='standard' className='primary-menu' style={{gap:'.5rem'}}>
        <Link to='/consciuscms' className='fn--Link es--inline fo--btn fo--btn-outline'>{t('conscius.hero.cta','Core')}</Link>
        <Link to='/documentation' className='fn--Link es--inline fo--btn fo--btn-outline'>{t('nav.docs','Docs')}</Link>
        <Link to='/examples' className='fn--Link es--inline fo--btn fo--btn-outline'>{t('nav.articles','Examples')}</Link>
        <Link to='/plataformas' className='fn--Link es--inline fo--btn fo--btn-primary'>{t('nav.platforms','Ecosystem')}</Link>
      </ESection>
    </ESection>
  );
}
