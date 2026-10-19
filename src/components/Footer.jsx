import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo/full-logo.png';
import './Footer.css';

// ===================== EDIT THESE =====================
const PHONE_DISPLAY = '+63 900 000 0000';
const PHONE_LINK = '+639000000000'; // digits only
const EMAIL = 'dcpowersolar@gmail.com';
const HOURS = 'Mon to Sat, 8:00 AM to 5:00 PM'; // palitan ng totoong oras
const FACEBOOK_URL = ''; // ilagay ang link ng Facebook page mo; kapag walang laman, hindi lalabas
const TEAMS = [
  { name: 'Techsolutions', city: 'Dagupan City' },
  { name: 'DC Power', city: 'Malasiqui' },
];
// ======================================================

const EXPLORE = [
  { to: '/#services', label: 'How It Works' },
  { to: '/#packages', label: 'Packages' },
  { to: '/projects', label: 'Our Projects' },
  { to: '/about', label: 'About Us' },
  { to: '/faq', label: 'FAQ' },
  { to: '/#contact', label: 'Get a Quote' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [areaOpen, setAreaOpen] = useState(false);

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="DC Power logo" className="footer-mark" />
              <span>DC Power</span>
            </Link>
            <p className="footer-tagline">Solar that keeps your lights on.</p>
            <p className="footer-sub">
              Licensed installers building solar and battery systems for Philippine homes and
              businesses.
            </p>
            {FACEBOOK_URL && (
              <a
                href={FACEBOOK_URL}
                className="footer-social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
                </svg>
              </a>
            )}
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-item">
              <span className="footer-label">Phone</span>
              <a href={`tel:${PHONE_LINK}`}>{PHONE_DISPLAY}</a>
            </div>
            <div className="footer-item">
              <span className="footer-label">Email</span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </div>
            <div className="footer-item">
              <span className="footer-label">Hours</span>
              <span>{HOURS}</span>
            </div>
          </div>

          {/* Service area */}
          <div className="footer-col">
            <h4>Service area</h4>
            <div
              className={`area-dropdown ${areaOpen ? 'open' : ''}`}
              onMouseEnter={() => setAreaOpen(true)}
              onMouseLeave={() => setAreaOpen(false)}
            >
              <button
                type="button"
                className="area-trigger"
                onClick={() => setAreaOpen((v) => !v)}
                aria-expanded={areaOpen}
                aria-controls="area-list"
              >
                <span>
                  <span className="footer-label">Coverage</span>
                  <span className="area-value">Luzon-wide</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="area-caret" aria-hidden="true">
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div id="area-list" className="area-list-wrap">
                <ul className="area-list">
                  {TEAMS.map((t) => (
                    <li key={`${t.name}-${t.city}`}>
                      <span className="area-team">{t.name}</span>
                      <span className="area-city">{t.city}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {2012} DC Power. All rights reserved.</span>
          <span>Serving homes and businesses across Luzon.</span>
        </div>
      </div>
    </footer>
  );
}