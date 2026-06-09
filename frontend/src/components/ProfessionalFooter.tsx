import { Link } from 'react-router-dom'
import { ESection, ETexto } from '../espiralml/components'
import './professional-footer.css'

function ProfessionalFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <ESection 
            as="footer" 
            fn={['Footer', 'Principal']} 
            es={['stack', 'full-width']} 
            fo={['brand-hero', 'glass']}
            className="conscius-footer"
        >
            {/* Main Footer Content */}
            <ESection 
                fn={['Content', 'Footer']} 
                es={['grid', 'responsive']} 
                fo='standard'
                className="conscius-footer-content"
            >
                {/* Brand Column */}
                <ESection fn={['Column', 'Brand']} es='stack' fo='standard' className="conscius-footer-brand">
                    <ESection fn={['Brand', 'Footer']} es={['inline', 'center']} fo='brand-gradient-text'>
                        <div className="conscius-footer-logo">
                            <div className="conscius-footer-icon">⚡</div>
                            <div className="conscius-footer-text">
                                <span className="conscius-footer-name">Conscius</span>
                                <span className="conscius-footer-suffix">CMS</span>
                            </div>
                        </div>
                    </ESection>
                    
                    <ETexto 
                        as='p' 
                        fn='BrandDescription' 
                        fo={['muted', 'text-sm']} 
                        k='conscius.footer.description' 
                        fallback='Conscious Content Management System for ethical digital evolution. Built with sustainability, transparency, and human-AI collaboration at its core.' 
                        className="conscius-footer-description"
                    />

                    {/* Social Links */}
                    <ESection fn='SocialLinks' es={['inline', 'center']} fo='standard' className="conscius-social-links">
                        <SocialLink icon="github" href="https://github.com/Aurora-Program/ConsciusCMS" label="GitHub" />
                        <SocialLink icon="twitter" href="#" label="Twitter" />
                        <SocialLink icon="linkedin" href="#" label="LinkedIn" />
                        <SocialLink icon="discord" href="#" label="Discord" />
                    </ESection>
                </ESection>

                {/* Product Column */}
                <ESection fn={['Column', 'Product']} es='stack' fo='standard' className="conscius-footer-column">
                    <ETexto as='h4' fn='ColumnTitle' fo={['brand-accent', 'title-sm']} k='footer.product' fallback='Product' />
                    <FooterLink to="/features" labelKey="footer.features" label="Features" />
                    <FooterLink to="/pricing" labelKey="footer.pricing" label="Pricing" />
                    <FooterLink to="/integrations" labelKey="footer.integrations" label="Integrations" />
                    <FooterLink to="/api" labelKey="footer.api" label="API" />
                    <FooterLink to="/changelog" labelKey="footer.changelog" label="Changelog" />
                </ESection>

                {/* Resources Column */}
                <ESection fn={['Column', 'Resources']} es='stack' fo='standard' className="conscius-footer-column">
                    <ETexto as='h4' fn='ColumnTitle' fo={['brand-accent', 'title-sm']} k='footer.resources' fallback='Resources' />
                    <FooterLink to="/docs" labelKey="footer.documentation" label="Documentation" />
                    <FooterLink to="/tutorials" labelKey="footer.tutorials" label="Tutorials" />
                    <FooterLink to="/blog" labelKey="footer.blog" label="Blog" />
                    <FooterLink to="/community" labelKey="footer.community" label="Community" />
                    <FooterLink to="/support" labelKey="footer.support" label="Support" />
                </ESection>

                {/* Company Column */}
                <ESection fn={['Column', 'Company']} es='stack' fo='standard' className="conscius-footer-column">
                    <ETexto as='h4' fn='ColumnTitle' fo={['brand-accent', 'title-sm']} k='footer.company' fallback='Company' />
                    <FooterLink to="/about" labelKey="footer.about" label="About Us" />
                    <FooterLink to="/careers" labelKey="footer.careers" label="Careers" />
                    <FooterLink to="/contact" labelKey="footer.contact" label="Contact" />
                    <FooterLink to="/manifesto" labelKey="footer.manifesto" label="Manifesto" />
                    <FooterLink to="/sustainability" labelKey="footer.sustainability" label="Sustainability" />
                </ESection>

                {/* System Status Column */}
                <ESection fn={['Column', 'Status']} es='stack' fo='standard' className="conscius-footer-column">
                    <ETexto as='h4' fn='ColumnTitle' fo={['brand-accent', 'title-sm']} k='footer.system' fallback='System' />
                    
                    {/* System Health */}
                    <ESection fn='SystemHealth' es={['inline', 'center']} fo='standard' className="conscius-system-health">
                        <div className="conscius-health-indicator">
                            <i className="fas fa-circle conscius-status-live"></i>
                            <ETexto fn='StatusText' fo='standard' k='system.status' fallback='All Systems Operational' />
                        </div>
                    </ESection>

                    {/* Version Info */}
                    <ESection fn='VersionInfo' es='stack' fo='standard' className="conscius-version-info">
                        <div className="conscius-version-item">
                            <span className="conscius-version-label">Core:</span>
                            <span className="conscius-version-value">v2.1.0</span>
                        </div>
                        <div className="conscius-version-item">
                            <span className="conscius-version-label">API:</span>
                            <span className="conscius-version-value">v1.4.2</span>
                        </div>
                        <div className="conscius-version-item">
                            <span className="conscius-version-label">Build:</span>
                            <span className="conscius-version-value">#{Math.random().toString(36).substr(2, 8)}</span>
                        </div>
                    </ESection>

                    <FooterLink to="/status" labelKey="footer.status" label="Status Page" />
                </ESection>
            </ESection>

            {/* Footer Bottom */}
            <ESection 
                fn={['Bottom', 'Footer']} 
                es={['inline', 'space-between', 'center']} 
                fo={['panel-elevated', 'rounded']}
                className="conscius-footer-bottom"
            >
                <ESection fn='LegalLinks' es={['inline', 'center']} fo='standard' className="conscius-legal-links">
                    <FooterLink to="/privacy" labelKey="footer.privacy" label="Privacy Policy" />
                    <FooterLink to="/terms" labelKey="footer.terms" label="Terms of Service" />
                    <FooterLink to="/security" labelKey="footer.security" label="Security" />
                    <FooterLink to="/compliance" labelKey="footer.compliance" label="Compliance" />
                </ESection>

                <ETexto 
                    as='p' 
                    fn='Copyright' 
                    fo={['muted', 'text-sm']} 
                    k='footer.copyright' 
                    fallback={`© ${currentYear} ConsciusCMS. Built with consciousness for a sustainable digital future.`}
                    className="conscius-copyright"
                />

                {/* Technology Badge */}
                <ESection fn='TechBadge' es={['inline', 'center']} fo={['badge', 'tech']} className="conscius-tech-badge">
                    <i className="fas fa-leaf conscius-tech-icon"></i>
                    <ETexto fn='TechLabel' fo='standard' k='footer.tech' fallback='Sustainable Tech' />
                </ESection>
            </ESection>
        </ESection>
    )
}

// Footer Link Component
function FooterLink({ to, labelKey, label }: { to: string, labelKey: string, label: string }) {
    return (
        <Link to={to} className="conscius-footer-link">
            <ETexto fn='LinkText' fo='standard' k={labelKey} fallback={label} />
        </Link>
    )
}

// Social Link Component
function SocialLink({ icon, href, label }: { icon: string, href: string, label: string }) {
    return (
        <a href={href} className="conscius-social-link" title={label} target="_blank" rel="noopener noreferrer">
            <i className={`fab fa-${icon} conscius-social-icon`}></i>
        </a>
    )
}

export default ProfessionalFooter
