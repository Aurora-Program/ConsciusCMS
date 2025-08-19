import React from 'react';
import SocialLinks from '../components/SocialLinks/SocialLinks.tsx';
import AuroraLogo from '../components/Logo/AuroraLogo.tsx';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-section footer-brand">
          <AuroraLogo size="sm" />
          <p className="footer-description">
            Transformando ideas en realidad digital con el poder de la aurora.
          </p>
        </div>
        
        <div className="footer-section footer-links">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#templates">Templates</a></li>
            <li><a href="#settings">Configuración</a></li>
            <li><a href="#help">Ayuda</a></li>
          </ul>
        </div>
        
        <div className="footer-section footer-social">
          <SocialLinks variant="footer" size="md" />
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span className="copyright">
            © {currentYear} Aurora Program. Todos los derechos reservados.
          </span>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacidad</a>
            <a href="#terms">Términos</a>
            <a href="#contact">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
