import SizeCalculator from './SizeCalculator';
import './Contact.css';

export default function Contact() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">SIZE YOUR SYSTEM</div>
          <h2>See what size solar system you need</h2>
          <p>Get an instant estimate below, then call or email us and we'll help you plan the rest.</p>
        </div>

        <SizeCalculator />

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
