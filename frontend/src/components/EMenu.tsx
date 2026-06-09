import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ESection, EComponente, ETexto } from '../espiralml/components'
import LanguageSelector from '../util/multiselector'

export interface MenuProps {
  className?: string
}

export default function EMenu({ className }: MenuProps) {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  const menuItems = [
    { path: '/home', key: 'nav.home', icon: 'home', label: 'Home' },
    { path: '/manifiesto', key: 'nav.Manifiesto', icon: 'scroll', label: 'Manifesto' },
    { path: '/plataformas', key: 'nav.platforms', icon: 'layer-group', label: 'Platforms' },
    { path: '/labs', key: 'nav.labs', icon: 'flask', label: 'Labs' },
    { path: '/articles', key: 'nav.articles', icon: 'newspaper', label: 'Articles' },
    { path: '/documentation', key: 'nav.docs', icon: 'book', label: 'Docs' },
    { path: '/acerca', key: 'nav.about', icon: 'info-circle', label: 'About' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <ESection 
      fn={['Menu', 'Principal']} 
      es={['inline', 'space-between', 'center']} 
      fo={['glass', 'rounded']}
      className={`e-menu ${className || ''}`}
    >
      {/* Logo/Brand */}
      <Link to="/home" className="e-menu-brand">
        <EComponente 
          fn={['Brand', 'Logo']} 
          es={['inline', 'center']} 
          fo='brand-gradient-text'
        >
          <EComponente 
            fn='LogoSymbol' 
            es='inline' 
            fo={['rounded', 'brand-glow']}
            className="e-menu-logo-symbol"
          >
            A
          </EComponente>
          <ESection fn='BrandText' es='stack' fo='standard'>
            <ETexto as='span' fn='BrandName' fo='brand-accent' k='brand.name' fallback='Aurora' />
            <ETexto as='span' fn='BrandSuffix' fo='muted' k='brand.suffix' fallback='Program' />
          </ESection>
        </EComponente>
      </Link>

      {/* Desktop Navigation */}
      <ESection 
        fn={['Nav', 'Desktop']} 
        es={['inline', 'center']} 
        fo='standard'
        className="e-menu-desktop d-none d-lg-flex"
      >
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`e-menu-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <EComponente
              fn={['MenuItem', 'Desktop']}
              es={['inline', 'center']}
              fo={[
                'rounded',
                'panel-floating',
                isActive(item.path) ? 'brand-accent' : 'muted',
                isActive(item.path) ? 'active' : ''
              ]}
            >
              <EComponente 
                fn='MenuIcon' 
                es='inline' 
                fo='standard'
                className={`fas fa-${item.icon}`}
              />
              <ETexto 
                fn='MenuLabel' 
                fo='standard' 
                k={item.key} 
                fallback={item.label} 
              />
              {isActive(item.path) && (
                <EComponente 
                  fn='ActiveIndicator' 
                  es='inline' 
                  fo={['brand-accent', 'rounded']}
                  className="e-menu-indicator"
                />
              )}
            </EComponente>
          </Link>
        ))}
      </ESection>

      {/* Desktop Actions */}
      <ESection 
        fn={['Actions', 'Desktop']} 
        es={['inline', 'center']} 
        fo='standard'
        className="e-menu-actions d-none d-lg-flex"
      >
        <EComponente fn='LanguageSelector' es='inline' fo='standard'>
          <LanguageSelector />
        </EComponente>
        
        <Link to="/contact" className="e-menu-cta">
          <EComponente
            fn={['CTA', 'Primary']}
            es={['inline', 'center']}
            fo={['btn', 'btn-primary', 'rounded', 'brand-glow']}
          >
            <EComponente 
              fn='CTAIcon' 
              es='inline' 
              fo='standard'
              className="fas fa-envelope"
            />
            <ETexto fn='CTALabel' fo='standard' k='cta.contact' fallback='Contact' />
          </EComponente>
        </Link>
      </ESection>

      {/* Mobile Toggle */}
      <EComponente
        fn={['Toggle', 'Mobile']}
        es={['inline', 'center']}
        fo={['btn', 'btn-outline', 'rounded']}
        className="e-menu-toggle d-lg-none"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <EComponente 
          fn='ToggleIcon' 
          es='inline' 
          fo='standard'
          className={`fas fa-${isMobileOpen ? 'times' : 'bars'}`}
        />
      </EComponente>

      {/* Mobile Navigation */}
      {isMobileOpen && (
        <ESection
          fn={['Nav', 'Mobile']}
          es={['stack', 'full-width']}
          fo={['glass', 'rounded', 'panel-elevated']}
          className="e-menu-mobile"
        >
          <ESection fn='MobileItems' es='stack' fo='standard'>
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`e-menu-mobile-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <EComponente
                  fn={['MenuItem', 'Mobile']}
                  es={['inline', 'space-between', 'center']}
                  fo={[
                    'panel-floating',
                    'rounded',
                    isActive(item.path) ? 'brand-accent' : 'muted'
                  ]}
                >
                  <ESection fn='MobileItemContent' es={['inline', 'center']} fo='standard'>
                    <EComponente 
                      fn='MobileIcon' 
                      es='inline' 
                      fo='standard'
                      className={`fas fa-${item.icon}`}
                    />
                    <ETexto 
                      fn='MobileLabel' 
                      fo='standard' 
                      k={item.key} 
                      fallback={item.label} 
                    />
                  </ESection>
                  
                  <EComponente 
                    fn='MobileArrow' 
                    es='inline' 
                    fo='muted'
                    className="fas fa-chevron-right"
                  />
                </EComponente>
              </Link>
            ))}
          </ESection>

          <ESection 
            fn='MobileActions' 
            es={['stack', 'center']} 
            fo='standard'
            className="e-menu-mobile-actions"
          >
            <EComponente fn='MobileLanguageSelector' es='inline' fo='standard'>
              <LanguageSelector />
            </EComponente>
            
            <Link to="/contact" className="e-menu-mobile-cta" onClick={() => setIsMobileOpen(false)}>
              <EComponente
                fn={['CTA', 'Mobile']}
                es={['inline', 'center']}
                fo={['btn', 'btn-primary', 'rounded', 'brand-glow']}
              >
                <EComponente 
                  fn='MobileCTAIcon' 
                  es='inline' 
                  fo='standard'
                  className="fas fa-envelope"
                />
                <ETexto fn='MobileCTALabel' fo='standard' k='cta.contact.mobile' fallback='Get in Touch' />
              </EComponente>
            </Link>
          </ESection>
        </ESection>
      )}
    </ESection>
  )
}
