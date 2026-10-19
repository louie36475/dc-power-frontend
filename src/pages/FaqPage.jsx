import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageHeader from '../components/PageHeader';
import './pages.css';
import './FaqPage.css';

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: 'How much does a solar system cost?',
    a: 'It depends on your household\u2019s usage and roof size, but most homes fall between a 5kW and 10kW hybrid system. Use the calculator on our homepage for a quick estimate, or request a free assessment for an exact quote.',
  },
  {
    q: 'How long does installation take?',
    a: 'Most residential installs are done in 1\u20133 days once permits and materials are ready, depending on system size and roof complexity.',
  },
  {
    q: 'What happens to my power when the grid goes down?',
    a: 'Systems with battery backup switch over automatically \u2014 your essentials (lights, fridge, router, fans) keep running through a brownout without you noticing.',
  },
  {
    q: 'Do I need net metering?',
    a: 'Not required, but it lets you export excess solar power back to the grid for bill credits. We can help you apply if you want it.',
  },
  {
    q: 'How many years before the system pays for itself?',
    a: 'Typical payback is 4\u20136 years depending on your electricity usage and local rates, with the system continuing to save you money well beyond that.',
  },
  {
    q: 'Is there a warranty on panels and inverters?',
    a: 'Yes \u2014 panels carry a 25-year warranty, inverters and batteries are typically covered for 5 years, and our own installation workmanship is guaranteed for 2 years.',
  },
  {
    q: 'Can I expand my system later?',
    a: 'Yes, most of our installs are designed with room to add panels or battery capacity later as your usage grows.',
  },
  {
    q: 'Do you install outside Luzon?',
    a: 'We currently serve Luzon-wide. Reach out and we\u2019ll let you know if we can accommodate your area.',
  },
];

function FaqItem({ q, a, num, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button type="button" className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        <span className="faq-num mono" aria-hidden="true">{num}</span>
        <span className="faq-q">{q}</span>
        <span className="faq-icon" aria-hidden="true">+</span>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const rootRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const s = query.trim().toLowerCase();
    return FAQS.map((f, i) => ({ ...f, id: i })).filter(
      (f) => !s || f.q.toLowerCase().includes(s) || f.a.toLowerCase().includes(s)
    );
  }, [query]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-search',
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.faq-search', start: 'top 92%', once: true },
        }
      );
      gsap.fromTo(
        '.faq-item',
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.faq-list', start: 'top 90%', once: true },
        }
      );
      gsap.fromTo(
        '.faq-cta',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.faq-cta', start: 'top 95%', once: true },
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
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        text="Answers to common questions about solar systems and financing."
      />

      <section className="faq-section" ref={rootRef}>
        <div className="wrap faq-wrap">
          <div className="faq-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search a question..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenIndex(-1);
              }}
              aria-label="Search questions"
            />
          </div>

          <div className="faq-list">
            {list.map((item, i) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
                num={String(item.id + 1).padStart(2, '0')}
                isOpen={openIndex === item.id}
                onToggle={() => setOpenIndex(openIndex === item.id ? -1 : item.id)}
              />
            ))}
            {list.length === 0 && (
              <p className="faq-empty">No questions match "{query}". Try another word.</p>
            )}
          </div>

          <div className="faq-cta">
            <div>
              <h3>Still have a question?</h3>
              <p>Send us a message and we'll get back to you, usually within one business day.</p>
            </div>
            <a href="/#contact" className="btn btn-primary">Contact us</a>
          </div>
        </div>
      </section>
    </>
  );
}