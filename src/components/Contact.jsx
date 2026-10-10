import { useState } from 'react';
import SizeCalculator from './SizeCalculator';
import './Contact.css';

// ===================== EDIT THESE =====================
// Web3Forms: leave this link exactly as it is
const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
// Paste your Web3Forms access key between the quotes (the one emailed to you)
const ACCESS_KEY = '1d65e651-b3e4-4d3c-a73f-88256621d203';
// Contact details shown at the bottom of the section
const PHONE_DISPLAY = '+63 900 000 0000';
const PHONE_LINK = '+639000000000'; // digits only, no spaces
const EMAIL = 'dcpowersolar@gmail.com';
// ======================================================

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', message: '' });
  const [estimate, setEstimate] = useState(null); // filled in by the calculator
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Turns the calculator result into readable fields for the email
  const estimateFields = estimate
    ? {
        estimate_system_size: `${estimate.kwp} kWp`,
        estimate_panels: `${estimate.panels} panels (450W each)`,
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
          ...estimateFields,
        }),
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
              <label htmlFor="q-city">City / municipality</label>
              <input id="q-city" name="city" type="text" value={form.city} onChange={handleChange} required />
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