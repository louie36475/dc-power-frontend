import { Link } from 'react-router-dom';
import logo from '../assets/logo/full-logo.png';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap footer-inner">
        <div className="brand">
          <img src={logo} alt="DC Power logo" className="footer-mark" />
          DC Power — {year}
        </div>
        <div className="foot-links">
          <Link to="/#services">Services</Link>
          <Link to="/#packages">Packages</Link>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/#contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
