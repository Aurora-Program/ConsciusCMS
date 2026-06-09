
import './inicio.css'
import '../App.css'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar  from 'react-bootstrap/Navbar';

import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './professional-menu.css'
import {   Offcanvas} from 'react-bootstrap';
import LanguageSelector from '../util/multiselector.tsx'
import { useT } from '../util/useTranslation'
import { useState } from 'react';

function Menu() {
    const t = useT()
    const [activeItem, setActiveItem] = useState('')
    
    const menuItems = [
        { path: '/home', key: 'nav.home', icon: 'fas fa-home', label: 'Home' },
        { path: '/manifiesto', key: 'nav.Manifiesto', icon: 'fas fa-scroll', label: 'Manifesto' },
        { path: '/plataformas', key: 'nav.platforms', icon: 'fas fa-layer-group', label: 'Platforms' },
        { path: '/labs', key: 'nav.labs', icon: 'fas fa-flask', label: 'Labs' },
        { path: '/articles', key: 'nav.articles', icon: 'fas fa-newspaper', label: 'Articles' },
        { path: '/documentation', key: 'nav.docs', icon: 'fas fa-book', label: 'Docs' },
        { path: '/acerca', key: 'nav.about', icon: 'fas fa-info-circle', label: 'About' }
    ];
    
    return (
        <>
            <div className="professional-navigation">
                <div className="nav-backdrop"></div>
                <Navbar expand="lg" className="professional-navbar">
                    <Container fluid className="professional-nav-container">
                        <Navbar.Brand as={Link} to="/home" className="professional-nav-brand">
                            <div className="brand-logo">
                                <div className="logo-symbol">A</div>
                                <div className="brand-text">
                                    <span className="brand-name">Aurora</span>
                                    <span className="brand-suffix">Program</span>
                                </div>
                            </div>
                        </Navbar.Brand>
                        
                        {/* Desktop Navigation */}
                        <Nav className="professional-desktop-nav d-none d-lg-flex">
                            {menuItems.map((item, index) => (
                                <Nav.Link 
                                    key={index}
                                    as={Link} 
                                    to={item.path} 
                                    className={`professional-nav-item ${activeItem === item.path ? 'active' : ''}`}
                                    onClick={() => setActiveItem(item.path)}
                                >
                                    <i className={item.icon}></i>
                                    <span>{t(item.key)}</span>
                                    <div className="nav-item-indicator"></div>
                                </Nav.Link>
                            ))}
                        </Nav>
                        
                        {/* Desktop Actions */}
                        <div className="professional-nav-actions d-none d-lg-flex">
                            <LanguageSelector />
                            <Link to="/contact" className="professional-cta-button">
                                <i className="fas fa-envelope"></i>
                                <span>Contact</span>
                            </Link>
                        </div>
                        
                        <Navbar.Toggle 
                            aria-controls="offcanvasNavbar-expand-lg" 
                            className="professional-toggle d-lg-none"
                        />
                        
                        <Navbar.Offcanvas
                            id="offcanvasNavbar-expand-lg"
                            aria-labelledby="offcanvasNavbarLabel-expand-lg"
                            placement="end"
                            className="professional-offcanvas"
                        >
                            <Offcanvas.Header closeButton className="professional-offcanvas-header">
                                <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg" className="professional-offcanvas-title">
                                    <div className="mobile-brand">
                                        <div className="mobile-logo-symbol">A</div>
                                        <span>Aurora Program</span>
                                    </div>
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            
                            <Offcanvas.Body className="professional-offcanvas-body">
                                <Nav className="professional-mobile-nav">
                                    {menuItems.map((item, index) => (
                                        <Nav.Link 
                                            key={index}
                                            as={Link} 
                                            to={item.path} 
                                            className="professional-mobile-nav-item"
                                        >
                                            <div className="mobile-nav-content">
                                                <i className={item.icon}></i>
                                                <span>{t(item.key)}</span>
                                            </div>
                                            <div className="mobile-nav-arrow">
                                                <i className="fas fa-chevron-right"></i>
                                            </div>
                                        </Nav.Link>
                                    ))}
                                </Nav>
                                
                                <div className="professional-mobile-footer">
                                    <div className="mobile-language-selector">
                                        <LanguageSelector />
                                    </div>
                                    <Link to="/contact" className="professional-mobile-cta">
                                        <i className="fas fa-envelope"></i>
                                        <span>Get in Touch</span>
                                    </Link>
                                </div>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            </div>
        </>
    )
}

export default Menu