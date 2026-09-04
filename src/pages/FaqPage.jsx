import { useState } from 'react';
import './pages.css';
import './FaqPage.css';

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

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button type="button" className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        {q}
        <span className="faq-icon" aria-hidden="true">{isOpen ? '\u2212' : '+'}</span>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <div className="page-header">
        <div className="wrap">
          <div className="eyebrow">FAQ</div>
          <h1>Frequently asked questions</h1>
          <p>Answers to common questions about solar systems and financing.</p>
        </div>
      </div>

      <section className="faq-section">
        <div className="wrap faq-wrap">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
