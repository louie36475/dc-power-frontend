import './Hero.css';

export default function Hero() {
  return (
    <>
    <section className="hero" id="home">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />

      <div className="wrap">
        <div className="hero-content">
        <div className="eyebrow hero-eyebrow hero-anim hero-anim--1">
          <span className="dot" />
          NOW BOOKING Q4 INSTALLS
        </div>

        <h1 className="hero-anim hero-anim--2">
          Every roof here already
          <br />
          catches enough sun. <span className="hero-gradient-text">We wire it home.</span>
        </h1>

        <p className="lead hero-anim hero-anim--3">
          DC Power designs and installs rooftop solar and battery backup systems for homes and
          businesses across the Philippines — sized to what you actually use, installed by our
          own crew, wired to survive a brownout.
        </p>

        <div className="hero-cta hero-anim hero-anim--4">
          <a href="#contact" className="btn btn-primary hero-btn-primary">
            Get a free assessment
          </a>
          <a href="#services" className="btn btn-ghost hero-btn-ghost">
            See how it works
          </a>
        </div>
        </div>
      </div>
    </section>

    <div className="hero-stats-bar">
      <div className="wrap stat-row">
        <div className="stat-card">
          <div className="stat-num mono">500+ kWp</div>
          <div className="stat-label">installed capacity</div>
        </div>
        <div className="stat-card">
          <div className="stat-num mono">1,200+</div>
          <div className="stat-label">homes &amp; businesses powered</div>
        </div>
        <div className="stat-card">
          <div className="stat-num mono">8 yrs</div>
          <div className="stat-label">in the field</div>
        </div>
        <div className="stat-card">
          <div className="stat-num mono">1–3 days</div>
          <div className="stat-label">typical install time</div>
        </div>
      </div>
    </div>
    </>
  );
}