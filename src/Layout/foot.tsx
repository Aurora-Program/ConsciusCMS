
import { Link } from 'react-router-dom';

const Foot = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="modern-footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-links">
                        <Link to="/site/avisolegal" className="footer-link">
                            Privacy Policy
                        </Link>
                        <Link to="/site/terms" className="footer-link">
                            Terms of Service
                        </Link>
                    </div>
                    
                    <div className="footer-brand">
                        <span className="footer-text">
                            © {currentYear} Aurora CMS - Professional Web Design
                        </span>
                    </div>
                    
                    <div className="footer-social">
                        <span className="footer-version">v2.0</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Foot
    