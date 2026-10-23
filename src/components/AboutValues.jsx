import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutValues.css';

gsap.registerPlugin(ScrollTrigger);

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

// Palitan mo lang ang text dito kung gusto mong baguhin.
const VALUES = [
  {
    num: '01',
    title: 'Built for brownouts',
    text: 'Every system is designed to keep your essentials running through an outage, not just to lower your bill on a sunny day.',
    icon: (
      <svg {...iconProps}>
        <path d="M13 2L5 13.5h6L10 22l9-12h-6.2L13 2z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Our own crew',
    text: 'Licensed electricians and installers on our own team. The person who quotes your system signs off on the install.',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Sized to your usage',
    text: 'We size the system to what you actually use, so you pay for what you need and nothing extra.',
    icon: (
      <svg {...iconProps}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <rect x="8" y="6" width="8" height="3" rx="0.6" />
        <path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" strokeWidth="2.2" />
      </svg>
    ),
  },
];

export default function AboutValues() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const once = (trigger, start = 'top 88%') => ({ trigger, start, once: true });

      gsap.fromTo(
        '.av-head > *',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: once('.av-head') }
      );
      gsap.fromTo(
        '.av-card',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: 'power3.out', scrollTrigger: once('.av-grid', 'top 90%') }
      );
      gsap.fromTo(
        '.av-cta',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: once('.av-cta', 'top 95%') }
      );
    }, rootRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = setTimeout(refresh, 400);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section className="av-section" ref={rootRef}>
      <div className="wrap">
        <div className="av-head">
          <div className="eyebrow">WHAT WE STAND FOR</div>
          <h2>How we work</h2>
          <span className="av-line" aria-hidden="true" />
        </div>

        <div className="av-grid">
          {VALUES.map((v) => (
            <div className="av-card" key={v.num}>
              <span className="av-bignum mono" aria-hidden="true">{v.num}</span>
              <div className="av-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>

        <div className="av-cta">
          <div>
            <h3>Ready to see your numbers?</h3>
            <p>Try the calculator, then send us your details. We usually reply within one business day.</p>
          </div>
          <Link to="/#contact" className="btn btn-primary">Get a free quote</Link>
        </div>
      </div>
    </section>
  );
}