import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SizeCalculator from './SizeCalculator';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

// ===================== EDIT THESE =====================
const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = '1d65e651-b3e4-4d3c-a73f-88256621d203';
const PHONE_DISPLAY = '+63 900 000 0000';
const PHONE_LINK = '+639000000000'; // digits only, no spaces
const EMAIL = 'dcpowersolar@gmail.com';
const TIMELINES = [
  'As soon as possible',
  'Within 1 month',
  'In 1–3 months',
  'In 3–6 months',
  'Just exploring',
];
const VISIT_TIMES = ['Morning', 'Afternoon', 'Anytime'];
// ======================================================

const EMPTY_FORM = { name: '', phone: '', email: '', city: '', message: '' };

const todayStr = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export default function Contact() {
  const rootRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [timeline, setTimeline] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const hasEstimate = !!estimate;
  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Scroll animations (isang beses bawat isa)
  useEffect(() => {
    if (reduceMotion()) return;

    const ctx = gsap.context(() => {
      const once = (trigger, start = 'top 88%') => ({ trigger, start, once: true });

      // Heading: sunod-sunod
      gsap.fromTo(
        '.ct-head > *',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: once('.ct-head'),
        }
      );

      // Gold na linya
      gsap.fromTo(
        '.ct-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          delay: 0.4,
          ease: 'power3.out',
          scrollTrigger: once('.ct-head'),
        }
      );

      // Calculator at quote card
      gsap.fromTo(
        '.calc-card',
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: once('.calc-card', 'top 90%') }
      );
      gsap.fromTo(
        '.quote-card',
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: once('.quote-card', 'top 90%') }
      );

      // Mga field ng form: isa-isa
      gsap.fromTo(
        '.quote-card form > .field, .quote-card form > .field-row',
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: once('.quote-card form', 'top 85%'),
        }
      );

      // Phone at email
      gsap.fromTo(
        '.contact-info-item',
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: once('.contact-info', 'top 95%'),
        }
      );

      // Mahinang parallax ng ilaw sa background
      gsap.to('.ct-glow', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, rootRef);

    const refresh = () => ScrollTrigger.refresh();
window.addEventListener('load', refresh);
const timer = setTimeout(refresh, 400);
const timer2 = setTimeout(refresh, 1500);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  // Maliit na "pop" kapag lumabas ang estimate
  useEffect(() => {
    if (!hasEstimate || reduceMotion()) return;
    const el = rootRef.current?.querySelector('.quote-estimate');
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 10, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }
    );
  }, [hasEstimate]);

  // Success / error message
  useEffect(() => {
    if (status !== 'success' && status !== 'error') return;
    if (reduceMotion()) return;
    const el = rootRef.current?.querySelector('.form-success, .form-error');
    if (!el) return;
    gsap.fromTo(el, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, [status]);

  const estimateFields = estimate
    ? {
        estimate_system_size: `${estimate.kwp} kWp`,
        estimate_panels: `${estimate.panels} panels (600W each)`,
        estimate_roof_area: `${estimate.roofArea} m2`,
        estimate_monthly_usage: `${estimate.monthlyKwh} kWh per month`,
        ...(estimate.monthlyBill ? { estimate_monthly_bill: `PHP ${estimate.monthlyBill}` } : {}),
        estimate_day_night_split: `${estimate.dayPercent}% day / ${estimate.nightPercent}% night`,
        estimate_battery: `${estimate.batteryLabel} (about ${estimate.batteryKwh} kWh)`,
      }
    : { estimate_system_size: 'Customer did not use the calculator' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
          subject: 'New quote request - DC Power',
          ...form,
          ocular_visit_date: visitDate || 'Not specified',
          ocular_visit_time: visitTime || 'Not specified',
          install_timeline: timeline || 'Not specified',
          ...estimateFields,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm(EMPTY_FORM);
      setVisitDate('');
      setVisitTime('');
      setTimeline('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" ref={rootRef}>
      <div className="ct-glow" aria-hidden="true" />

      <div className="wrap">
        <div className="section-head ct-head">
          <div className="eyebrow">SIZE YOUR SYSTEM</div>
          <h2>See what size solar system you need</h2>
          <span className="ct-line" aria-hidden="true" />
          <p>Get an instant estimate below, then send us your details and we'll follow up.</p>
        </div>

        <SizeCalculator onEstimate={setEstimate} />

        <div className="quote-card">
          <div className="calc-head">
            <div className="eyebrow">REQUEST A QUOTE</div>
            <h3>Want us to reach out?</h3>
            <p>Leave your details and we'll get back to you — usually within one business day.</p>
          </div>

          {estimate ? (
            <div className="quote-estimate">
              <div className="quote-estimate-title">Your estimate (sent with your request)</div>
              <div className="quote-estimate-grid">
                <div>
                  <span className="quote-estimate-num mono">{estimate.kwp} kWp</span>
                  <span className="quote-estimate-label">system size</span>
                </div>
                <div>
                  <span className="quote-estimate-num mono">{estimate.panels}</span>
                  <span className="quote-estimate-label">panels</span>
                </div>
                <div>
                  <span className="quote-estimate-num mono">
                    {estimate.batteryLabel} · ~{estimate.batteryKwh} kWh
                  </span>
                  <span className="quote-estimate-label">battery</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="quote-estimate-hint">
              Tip: fill in the calculator above first, and we'll receive your system size with your request.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label htmlFor="q-name">Full name</label>
                <input id="q-name" name="name" type="text" value={form.name} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="q-phone">Phone number</label>
                <input id="q-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="q-email">Email</label>
              <input
                id="q-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="e.g. juan@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="q-city">City / municipality</label>
              <input id="q-city" name="city" type="text" value={form.city} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="q-visit-date">When can we do the ocular visit?</label>
              <input
                id="q-visit-date"
                type="date"
                min={todayStr()}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
              <div
                className="quote-chips quote-chips--time"
                role="radiogroup"
                aria-label="Preferred time of ocular visit"
              >
                {VISIT_TIMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={visitTime === t}
                    className={`quote-chip ${visitTime === t ? 'active' : ''}`}
                    onClick={() => setVisitTime(visitTime === t ? '' : t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label id="q-timeline-label">When do you want us to install?</label>
              <div className="quote-chips" role="radiogroup" aria-labelledby="q-timeline-label">
                {TIMELINES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={timeline === t}
                    className={`quote-chip ${timeline === t ? 'active' : ''}`}
                    onClick={() => setTimeline(timeline === t ? '' : t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="q-message">Anything else we should know?</label>
              <textarea id="q-message" name="message" placeholder="Roof type, interested in battery backup..." value={form.message} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary quote-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Request my quote'}
            </button>

            {status === 'success' && (
              <div className="form-success show">Thanks — we've got your details and will reach out soon.</div>
            )}
            {status === 'error' && (
              <div className="form-error show">Something went wrong. Please try again, or call/email us directly below.</div>
            )}
          </form>
        </div>

        <div className="contact-info">
          <a href={`tel:${PHONE_LINK}`} className="contact-info-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10.5 21 3 13.5 3 6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="contact-info-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 6l8 6 8-6M4 6v12h16V6H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}