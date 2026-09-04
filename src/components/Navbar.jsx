import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo/full-logo.png';
import './Navbar.css';

const ABOUT_DROPDOWN = [
  { to: '/about', label: 'About Us' },
  { to: '/projects', label: 'Our Projects' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On non-home pages there's no video behind the nav, so it should
  // always render solid rather than waiting for a scroll threshold.
  const solid = scrolled || !isHome;

  const closeAll = () => {
    setOpen(false);
    setAboutOpen(false);
  };

  return (
    <header className={`header ${solid ? 'solid' : 'transparent'}`}>
      <nav className="nav wrap">
        <Link to="/" className="brand" onClick={closeAll}>
          <img src={logo} alt="DC Power logo" className="brand-mark" />
          DC Power
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          <Link to="/#services" onClick={closeAll}>Services</Link>
          <Link to="/#packages" onClick={closeAll}>Packages</Link>

          <div
            className={`nav-dropdown ${aboutOpen ? 'open' : ''}`}
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              type="button"
              className="nav-dropdown-trigger"
              onClick={() => setAboutOpen((v) => !v)}
              aria-expanded={aboutOpen}
            >
              About
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="nav-caret">
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="nav-dropdown-menu">
              {ABOUT_DROPDOWN.map((item) => (
                <Link key={item.to} to={item.to} onClick={closeAll}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/#contact" onClick={closeAll}>Contact</Link>
          <Link to="/#contact" className="btn btn-primary" onClick={closeAll}>
            Get a Quote
          </Link>
        </div>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
