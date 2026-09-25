import { useState } from 'react';
import SizeCalculator from './SizeCalculator';
import './Contact.css';

// 1. Sign up free at https://formspree.io
// 2. Create a form, copy its endpoint (looks like https://formspree.io/f/xxxxxxxx)
// 3. Paste it below, replacing the placeholder
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', phone: '', city: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">SIZE YOUR SYSTEM</div>
          <h2>See what size solar system you need</h2>
          <p>Get an instant estimate below, then send us your details and we'll follow up.</p>
        </div>

        <SizeCalculator />

        <div className="quote-card">
          <div className="calc-head">
            <div className="eyebrow">REQUEST A QUOTE</div>
            <h3>Want us to reach out?</h3>
            <p>Leave your details and we'll get back to you — usually within one business day.</p>
          </div>

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
              <label htmlFor="q-city">City / municipality</label>
              <input id="q-city" name="city" type="text" value={form.city} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="q-message">Anything else we should know?</label>
              <textarea id="q-message" name="message" placeholder="Roof type, monthly bill, interested in battery backup..." value={form.message} onChange={handleChange} />
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
          <a href="tel:+639000000000" className="contact-info-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C10.5 21 3 13.5 3 6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            +63 900 000 0000
          </a>
          <a href="mailto:hello@dcpower.ph" className="contact-info-item">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 6l8 6 8-6M4 6v12h16V6H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            hello@dcpower.ph
          </a>
        </div>
      </div>
    </section>
  );
}