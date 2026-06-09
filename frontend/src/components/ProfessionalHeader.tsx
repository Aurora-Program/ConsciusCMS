import './professional-header.css'
import '../App.css'
import { Link } from 'react-router-dom'
import { ESection, EComponente, ETexto } from '../espiralml/components'
import LanguageSelector from '../util/multiselector'
import '../components/EMenu.css'
// Import ConstellaCSS
import '../constellacss/fn.css'
import '../constellacss/es.css'
import '../constellacss/fo.css'
// Import the logo directly
import cosciusLogo from '/cosciusCMSLogo.png'

function ProfessionalHeader() {
    return (
        <ESection 
            as="header" 
            fn={['Header', 'Principal']} 
            es={['full-width']} 
            fo={['standard', 'elevada']}
            className="conscius-header fn--Header es--full-width fo--elevada"
        >
            {/* Top Header Bar */}
            <ESection 
                fn={['TopBar', 'Header']} 
                es={['row', 'container']} 
                fo={['standard', 'bordered']}
                className="conscius-top-bar fn--TopBar es--row es--container fo--standard fo--bordered"
            >
                {/* Logo and Brand */}
                <Link to="/" className="conscius-brand-link fn--Brand">
                    <ESection 
                        fn={['Brand', 'Identity']} 
                        es={['row']} 
                        fo={['standard']}
                        className="conscius-brand fn--Brand es--row fo--standard"
                    >
                        <EComponente 
                            fn='LogoPrimary' 
                            es='inline' 
                            fo={['standard']}
                            className="conscius-logo-container fn--Logo es--inline fo--standard"
                        >
                            <img 
                                src={cosciusLogo}
                                alt="ConsciusCMS - Conscious Content Management" 
                                className="conscius-logo-image"
                                onError={(e) => {
                                    // Fallback to text logo if image fails
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                }}
                            />
                            <div className="conscius-logo-fallback">
                                <div className="conscius-icon">⚡</div>
                                <div className="conscius-text">
                                    <span className="conscius-name">Conscius</span>
                                    <span className="conscius-suffix">CMS</span>
                                </div>
                            </div>
                        </EComponente>
                        
                        <ESection fn='BrandText' es='stack' fo='standard' className="conscius-brand-text fn--BrandText es--stack fo--standard">
                            <ETexto 
                                as='h1' 
                                fn='BrandTitle' 
                                fo={['acentuada']} 
                                k='conscius.brand.title' 
                                fallback='ConsciusCMS' 
                                className="conscius-title fn--Titulo fo--acentuada"
                            />
                            <ETexto 
                                as='p' 
                                fn='BrandTagline' 
                                fo={['muted']} 
                                k='conscius.brand.tagline' 
                                fallback='Conscious Content Infrastructure' 
                                className="conscius-tagline fn--Subtitulo fo--muted"
                            />
                        </ESection>
                    </ESection>
                </Link>

                {/* System Status & Actions */}
                <ESection 
                    fn={['Actions', 'Header']} 
                    es={['inline', 'center']} 
                    fo='standard'
                    className="conscius-header-actions"
                >
                    {/* System Status Indicator */}
                    <EComponente 
                        fn='SystemStatus' 
                        es={['inline', 'center']} 
                        fo={['badge', 'success', 'rounded']}
                        className="conscius-status"
                        title="System Status: Operational"
                    >
                        <i className="fas fa-circle conscius-status-icon"></i>
                        <ETexto fn='StatusText' fo='standard' k='system.status.operational' fallback='Live' />
                    </EComponente>

                    {/* Language Selector */}
                    <EComponente fn='LanguageSelector' es='inline' fo={['panel-floating', 'rounded']}>
                        <LanguageSelector />
                    </EComponente>

                    {/* Admin/Dashboard Access */}
                    <Link to="/admin" className="conscius-admin-link">
                        <EComponente
                            fn={['CTA', 'Admin']}
                            es={['inline', 'center']}
                            fo={['btn', 'btn-primary', 'rounded', 'brand-glow']}
                            className="conscius-admin-btn"
                        >
                            <i className="fas fa-cog conscius-admin-icon"></i>
                            <ETexto fn='AdminLabel' fo='standard' k='nav.admin' fallback='Admin' />
                        </EComponente>
                    </Link>

                    {/* User Profile */}
                    <EComponente
                        fn={['Profile', 'User']}
                        es={['inline', 'center']}
                        fo={['panel-floating', 'rounded', 'avatar']}
                        className="conscius-user-avatar"
                        title="User Profile"
                    >
                        <i className="fas fa-user-circle"></i>
                    </EComponente>
                </ESection>
            </ESection>

            {/* Professional Navigation Menu */}
            <ESection 
                fn={['Navigation', 'Primary']} 
                es={['inline', 'space-between', 'center']} 
                fo={['glass', 'rounded']}
                className="conscius-nav-container"
            >
                {/* Main Navigation Items */}
                <ESection 
                    fn={['Nav', 'Main']} 
                    es={['inline', 'center']} 
                    fo='standard'
                    className="conscius-main-nav"
                >
                    <NavItem path="/dashboard" icon="tachometer-alt" labelKey="nav.dashboard" label="Dashboard" />
                    <NavItem path="/content" icon="file-alt" labelKey="nav.content" label="Content" />
                    <NavItem path="/media" icon="images" labelKey="nav.media" label="Media" />
                    <NavItem path="/users" icon="users" labelKey="nav.users" label="Users" />
                    <NavItem path="/analytics" icon="chart-line" labelKey="nav.analytics" label="Analytics" />
                    <NavItem path="/settings" icon="sliders-h" labelKey="nav.settings" label="Settings" />
                </ESection>

                {/* Secondary Navigation */}
                <ESection 
                    fn={['Nav', 'Secondary']} 
                    es={['inline', 'center']} 
                    fo='standard'
                    className="conscius-secondary-nav"
                >
                    <NavItem path="/docs" icon="book" labelKey="nav.documentation" label="Docs" />
                    <NavItem path="/support" icon="life-ring" labelKey="nav.support" label="Support" />
                    
                    {/* Quick Actions */}
                    <ESection fn='QuickActions' es={['inline', 'center']} fo='standard'>
                        <QuickAction icon="plus" action="create" label="Create" />
                        <QuickAction icon="search" action="search" label="Search" />
                        <QuickAction icon="bell" action="notifications" label="Notifications" badge="3" />
                    </ESection>
                </ESection>
            </ESection>
        </ESection>
    )
}

// Navigation Item Component
function NavItem({ path, icon, labelKey, label }: { path: string, icon: string, labelKey: string, label: string }) {
    return (
        <Link to={path} className="conscius-nav-item">
            <EComponente
                fn={['NavItem', 'Primary']}
                es={['inline', 'center']}
                fo={['panel-floating', 'rounded', 'nav-hover']}
                className="conscius-nav-link"
            >
                <i className={`fas fa-${icon} conscius-nav-icon`}></i>
                <ETexto fn='NavLabel' fo='standard' k={labelKey} fallback={label} />
            </EComponente>
        </Link>
    )
}

// Quick Action Component
function QuickAction({ icon, action, label, badge }: { icon: string, action: string, label: string, badge?: string }) {
    return (
        <EComponente
            fn={['QuickAction', action]}
            es={['inline', 'center']}
            fo={['btn', 'btn-outline', 'rounded']}
            className="conscius-quick-action"
            title={label}
        >
            <div className="conscius-action-icon-wrapper">
                <i className={`fas fa-${icon} conscius-action-icon`}></i>
                {badge && (
                    <span className="conscius-action-badge">{badge}</span>
                )}
            </div>
        </EComponente>
    )
}

export default ProfessionalHeader
