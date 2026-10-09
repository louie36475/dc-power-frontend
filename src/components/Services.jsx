import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import plugIcon from '../assets/logo/plug.png';
import leafIcon from '../assets/logo/leaf.png';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

// Line-art icons redrawn to match the site's style (thin strokes, brand
// colors) — used for sun and house instead of the flat logo tiles.
function SunIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="service-icon svg-icon">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ffe9b8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f2a93b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sunBody" x1="20%" y1="10%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#ffe6a1" />
          <stop offset="45%" stopColor="#f7b93f" />
          <stop offset="100%" stopColor="#d4801a" />
        </linearGradient>
        <linearGradient id="rayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd77a" />
          <stop offset="100%" stopColor="#e8952b" />
        </linearGradient>
        <filter id="sunShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3a2205" floodOpacity="0.35" />
        </filter>
      </defs>

      <circle cx="32" cy="32" r="30" fill="url(#sunGlow)" />

      <g filter="url(#sunShadow)">
        <g stroke="url(#rayGrad)" strokeWidth="4.5" strokeLinecap="round">
          <path d="M32 6v7M32 51v7M6 32h7M51 32h7" />
          <path d="M14.3 14.3l4.9 4.9M44.8 44.8l4.9 4.9M49.7 14.3l-4.9 4.9M18.2 44.8l-4.9 4.9" />
        </g>
        <circle cx="32" cy="32" r="14.5" fill="url(#sunBody)" />
        <ellipse cx="27" cy="26" rx="6" ry="4" fill="#fff6df" opacity="0.55" />
      </g>
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="service-icon svg-icon">
      <defs>
        <linearGradient id="roofGrad" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#5fb3f5" />
          <stop offset="100%" stopColor="#2b7fc9" />
        </linearGradient>
        <linearGradient id="wallFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f7fa" />
          <stop offset="100%" stopColor="#c7ceda" />
        </linearGradient>
        <linearGradient id="wallSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#aab4c4" />
          <stop offset="100%" stopColor="#8b96a8" />
        </linearGradient>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd77a" />
          <stop offset="100%" stopColor="#e8952b" />
        </linearGradient>
        <filter id="houseShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="3.2" floodColor="#0a1420" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#houseShadow)">
        {/* roof */}
        <path d="M8 28L32 8l24 20-3.5 4.2L32 15.3 11.5 32.2z" fill="url(#roofGrad)" />
        {/* side wall (implies depth) */}
        <path d="M44 26v22a2 2 0 0 1-2 2H34V32z" fill="url(#wallSide)" />
        {/* front wall */}
        <path d="M14 26h30v22a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z" fill="url(#wallFront)" />
        {/* backup bolt */}
        <path d="M30 34l-6 9h5l-2 7 8-10h-5l2-6z" fill="url(#boltGrad)" />
      </g>
    </svg>
  );
}

const SERVICES = [
  {
    title: 'Solar installation',
    desc: 'Rooftop panel systems sized to your actual usage and installed by our own crew — never subcontracted out.',
    icon: <SunIcon />,
    image: null, // e.g. '/images/solar-installation.jpg'
  },
  {
    title: 'Battery storage',
    desc: 'Store daytime sun for nighttime use, or hold enough charge to ride out a brownout without noticing it.',
    icon: <img src={plugIcon} alt="" className="service-icon" />,
    image: null, // e.g. '/images/battery-storage.jpg'
  },
  {
    title: 'Automatic backup',
    desc: 'Whole-home backup that switches on the instant the grid drops — no manual transfer switch, no generator startup.',
    icon: <HouseIcon />,
    image: null, // e.g. '/images/automatic-backup.jpg'
  },
  {
    title: 'Right-sizing & consulting',
    desc: "We'd rather undersell you a system that pays for itself than oversell one that doesn't. Every quote shows the math.",
    icon: <img src={leafIcon} alt="" className="service-icon" />,
    image: null, // e.g. '/images/consulting.jpg'
  },
];

export default function Services() {
  const gridRef = useRef(null);

  useEffect(() => {
    // gsap.context + revert() cleans up fully, so cards can never be left
    // stuck invisible (React dev mode runs effects twice, which breaks a
    // plain gsap.from()). fromTo() sets the end state explicitly.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-card',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 88%', once: true },
        }
      );
    }, gridRef);

    // fonts/images loading can shift the layout, so recalculate trigger positions
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = setTimeout(refresh, 300);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section id="services">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">WHAT WE DO</div>
          <h2>Four parts of one system</h2>
          <p>
            Each install is one connected system — generation, storage, backup, and a design
            that fits how much power you actually need.
          </p>
        </div>

        <div className="service-grid" ref={gridRef}>
          {SERVICES.map((s) => (
            <div className="service-card" key={s.title}>
              {s.image && <img src={s.image} alt={s.title} className="service-photo" />}
              {s.icon}
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}