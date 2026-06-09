import './header.css'
import '../App.css'
import { Link } from 'react-router-dom'
import LanguageSelector from '../util/multiselector.tsx'
import auroraLogo from '../assets/aurora-logo.png'
import { useT } from '../util/useTranslation'
import EMenu from '../components/EMenu'
import '../components/EMenu.css'

function Header() {
    const t = useT()

    return (
        <>
            <header className="aurora-modern-header">
                <div className="aurora-header-container">
                    <div className="aurora-header-content">
                        {/* Logo and Brand Section */}
                        <Link to="/" className="aurora-brand-section">
                            <div className="aurora-logo-wrapper">
                                <img 
                                    src={auroraLogo} 
                                    alt="Aurora Program Logo" 
                                    className="aurora-logo-image"
                                />
                                <div className="aurora-logo-glow"></div>
                            </div>
                            <div className="aurora-brand-text">
                                <h1 className="aurora-brand-title">
                                    <span className="aurora-gradient-text">Aurora</span>
                                    <span className="aurora-brand-suffix">Program</span>
                                </h1>
                                <p className="aurora-brand-tagline">
                                    {t('header.tagline')}
                                </p>
                            </div>
                        </Link>
                        
                        {/* Header Actions - Simplified */}
                        <div className="aurora-header-actions">
                            <LanguageSelector />
                            <Link to="/acerca" className="aurora-cta-button">
                                <i className="fas fa-info-circle"></i>
                                <span>{t('nav.about')}</span>
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Integrated EMenu Navigation */}
                <div className="header-menu-wrapper">
                    <EMenu className="header-integrated-menu" />
                </div>
                
                {/* Decorative Aurora Effects */}
                <div className="aurora-header-effects">
                    <div className="aurora-particle"></div>
                    <div className="aurora-particle"></div>
                    <div className="aurora-particle"></div>
                </div>
            </header>
        </>
    )
}

export default Header
