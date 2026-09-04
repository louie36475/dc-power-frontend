import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const FACTS = [
  ['Panels & inverters', 'Tier-1, 25-yr warranty'],
  ['Install crew', 'In-house, licensed'],
  ['Typical payback', '4–6 years'],
  ['Service area', 'Luzon-wide'],
];

export default function About() {
  const rootRef = useRef(null);

  useEffect(() => {
    const anim = gsap.from(rootRef.current.querySelectorAll('.reveal-item'), {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
    });
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

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
            {FACTS.map(([label, value]) => (
              <div className="fact-row" key={label}>
                <span className="fact-label">{label}</span>
                <span className="fact-num mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
