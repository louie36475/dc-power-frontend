import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
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

// Edit the text here if you want to change the wording.
const STEPS = [
  {
    num: '01',
    title: 'Find your system size',
    desc: 'Enter your monthly bill or kWh usage in our calculator. You instantly see the recommended kWp, the number of panels, and whether you need a battery.',
    icon: <CalcIcon />,
  },
  {
    num: '02',
    title: 'Send us your details',
    desc: 'Fill out the short form with your name, contact info, email, and when you want to install. Your calculator estimate is sent along with your request.',
    icon: <SendIcon />,
  },
  {
    num: '03',
    title: 'We reach out to you',
    desc: 'Our team reviews your request and gets in touch, usually within one business day, to set up a free site visit.',
    icon: <PhoneIcon />,
  },
  {
    num: '04',
    title: 'Install and switch on',
    desc: 'Our own licensed crew does the installation, typically in 1–3 days. Then you start seeing the drop in your electric bill.',
    icon: <BoltIcon />,
  },
];

export default function Services() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.step-card',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
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

  return (
    <section id="services" ref={rootRef}>
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">OUR PROCESS</div>
          <h2>Four steps from bill to solar</h2>
          <p>
            Start with the calculator and see your numbers right away. We only reach out
            when you're ready.
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map((s) => (
            <div className="step-card" key={s.num}>
              <div className="step-top">
                <span className="step-icon">{s.icon}</span>
                <span className="step-num mono">{s.num}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="steps-cta">
          <a href="#contact" className="btn btn-primary">
            Try the Calculator
          </a>
        </div>
      </div>
    </section>
  );
}