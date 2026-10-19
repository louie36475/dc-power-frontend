import { useEffect, useRef, useState } from 'react';
import './Services.css';

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function CalcIcon() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <rect x="8" y="6" width="8" height="3" rx="0.6" />
      <path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" strokeWidth="2.2" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 3L10 14" />
      <path d="M21 3l-7 18-4-7-7-4 18-7z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10.5 21 3 13.5 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg {...iconProps}>
      <path d="M13 2L5 13.5h6L10 22l9-12h-6.2L13 2z" />
    </svg>
  );
}

// Palitan mo lang ang text dito kung gusto mong baguhin.
const STEPS = [
  {
    num: '01',
    tag: 'Instant result',
    title: 'Find your system size',
    desc: 'Enter your monthly bill or kWh usage in our calculator. You instantly see the recommended kWp, the number of panels, and whether you need a battery.',
    icon: <CalcIcon />,
  },
  {
    num: '02',
    tag: 'Short form',
    title: 'Send us your details',
    desc: 'Fill out the short form with your name, contact info, email, and when you want to install. Your calculator estimate is sent along with your request.',
    icon: <SendIcon />,
  },
  {
    num: '03',
    tag: 'Usually within 1 business day',
    title: 'We reach out to you',
    desc: 'Our team reviews your request and gets in touch to set up a free site visit.',
    icon: <PhoneIcon />,
  },
  {
    num: '04',
    tag: 'Typically 1–3 days',
    title: 'Install and switch on',
    desc: 'Our own licensed crew does the installation. Then you start seeing the drop in your electric bill.',
    icon: <BoltIcon />,
  },
];

export default function Services() {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const list = listRef.current;
      if (!list) return;
      const mid = window.innerHeight * 0.55;
      const r = list.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, (mid - r.top) / r.height)));

      let current = 0;
      itemRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      setActive(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="services">
      <div className="wrap sv-layout">
        {/* Kaliwa: sticky panel */}
        <aside className="sv-side">
          <div className="sv-panel">
            <div className="sv-eyebrow">
              <span className="sv-pulse" /> OUR PROCESS
            </div>
            <h2>Four steps from bill to solar</h2>
            <p>
              Start with the calculator and see your numbers right away. We only reach out when
              you're ready.
            </p>

            <div className="sv-counter" aria-hidden="true">
              <span className="mono sv-counter-now">0{active + 1}</span>
              <span className="mono sv-counter-all">/ 0{STEPS.length}</span>
            </div>

            <a href="#contact" className="btn btn-primary sv-btn">
              Try the Calculator
            </a>
          </div>
        </aside>

        {/* Kanan: timeline */}
        <ol className="sv-list" ref={listRef}>
          <div className="sv-line" aria-hidden="true">
            <div className="sv-line-fill" style={{ height: `${progress * 100}%` }} />
          </div>

          {STEPS.map((s, i) => (
            <li
              key={s.num}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`sv-item ${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`}
            >
              <span className="sv-node" aria-hidden="true">
                {i < active ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  s.icon
                )}
              </span>

              <div className="sv-card">
                <span className="sv-bignum mono" aria-hidden="true">{s.num}</span>
                <span className="sv-tag">{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}