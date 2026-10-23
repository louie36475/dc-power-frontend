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
  const isAboutActive = ABOUT_DROPDOWN.some((i) => i.to === location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menus whenever the page changes
  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
  }, [location.pathname]);

  // Home: glass over the video, turns more solid after scrolling.
  // Other pages: always solid, since there's no video behind it.
  const solid = scrolled || !isHome;

  const closeAll = () => {
    setOpen(false);
    setAboutOpen(false);
  };

  return (
    <header
      className={`header ${solid ? 'solid' : 'transparent'} ${isHome ? 'is-home' : 'is-page'}`}
    >
      <nav className="nav">
        <Link to="/" className="brand" onClick={closeAll}>
          <img src={logo} alt="DC Power logo" className="brand-mark" />
          <span className="brand-text">DC Power</span>
        </Link>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          <div className="nav-center">
            <Link to="/#services" onClick={closeAll}>Get Started</Link>
            <Link to="/#packages" onClick={closeAll}>Packages</Link>

            <div
              className={`nav-dropdown ${aboutOpen ? 'open' : ''}`}
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button
                type="button"
                className={`nav-dropdown-trigger ${isAboutActive ? 'active' : ''}`}
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
                  <Link
                    key={item.to}
                    to={item.to}
                    className={location.pathname === item.to ? 'active' : ''}
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/#footer" onClick={closeAll}>Contact Us</Link>
          </div>

          <div className="nav-actions">
            <Link to="/#footer" className="btn btn-primary nav-quote" onClick={closeAll}>
  Request a Free Quote
</Link>
          </div>
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