import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

// Palitan o dagdagan mo lang ito. Isang block = isang team.
const TEAMS = [
  { name: 'Techsolutions', city: 'Dagupan City' },
  { name: 'DC Power', city: 'Malasiqui' },
];

// action: 'teams' = clickable, magbubukas yung dropdown ng teams
const FACTS = [
  { label: 'Panels & inverters', value: 'Tier-1, 25-yr warranty' },
  { label: 'Install crew', value: 'In-house, licensed' },
  { label: 'Typical payback', value: '4–6 years' },
  { label: 'Service area', value: 'Luzon-wide', action: 'teams' },
];

export default function About() {
  const rootRef = useRef(null);
  const teamsRef = useRef(null);
  const [showTeams, setShowTeams] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once: true },
        }
      );
    }, rootRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = setTimeout(refresh, 300);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  // Habang bukas ang dropdown: Esc o click sa labas = isara
  useEffect(() => {
    if (!showTeams) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setShowTeams(false);
    };
    const onClickOutside = (e) => {
      if (teamsRef.current && !teamsRef.current.contains(e.target)) setShowTeams(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [showTeams]);

  return (
    <section id="about" ref={rootRef}>
      <div className="wrap about-grid">
        <div className="reveal-item">
          <div className="eyebrow">ABOUT DC POWER</div>
          <h2>Built for how the grid actually behaves here</h2>
        </div>
        <div className="about-copy reveal-item">
          <p>
            The Philippines gets some of the highest solar irradiance in Asia, and some of the
            most frequent brownouts. Most solar companies size for the first fact and ignore the
            second. We design for both — every system we install can run your essentials
            straight through an outage, not just lower your bill on a sunny day.
          </p>
          <p>
            We're a small crew of licensed electricians and installers, not a sales franchise.
            The person who quotes your system is the person who signs off on the install.
          </p>
          <div className="fact-list">
            {FACTS.map((f) =>
              f.action === 'teams' ? (
                <div className="fact-group" key={f.label} ref={teamsRef}>
                  <div className="fact-row">
                    <span className="fact-label">{f.label}</span>
                    <button
                      type="button"
                      className={`fact-num fact-link mono ${showTeams ? 'open' : ''}`}
                      onClick={() => setShowTeams((v) => !v)}
                      aria-expanded={showTeams}
                      aria-controls="teams-dropdown"
                    >
                      {f.value}
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="fact-caret" aria-hidden="true">
                        <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <div
                    id="teams-dropdown"
                    className={`teams-dropdown ${showTeams ? 'open' : ''}`}
                  >
                    <ul className="teams-list">
                      {TEAMS.map((t) => (
                        <li className="team-item" key={`${t.name}-${t.city}`}>
                          <span className="team-pin" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                              <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
                            </svg>
                          </span>
                          <span className="team-name">{t.name}</span>
                          <span className="team-city">{t.city}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="fact-row" key={f.label}>
                  <span className="fact-label">{f.label}</span>
                  <span className="fact-num mono">{f.value}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}