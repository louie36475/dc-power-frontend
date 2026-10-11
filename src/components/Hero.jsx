import { useRef, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Belt-and-suspenders fix for autoplay getting silently blocked:
    // explicitly re-assert muted (some browsers check the live property,
    // not just the HTML attribute) and call play() ourselves, catching
    // the rejected promise that some browsers throw instead of playing.
    video.muted = true;
    video.setAttribute('muted', ''); // belt-and-suspenders: some mobile
    // browsers check the literal HTML attribute, not just the JS property

    const tryPlay = () => video.play().catch(() => {});
    tryPlay();

    // If autoplay was blocked outright (common on mobile data-saver modes,
    // or iOS Low Power Mode), retry on the first real user interaction —
    // covers both mouse (click) and touch (touchstart) input.
    const retry = () => {
      tryPlay();
      document.removeEventListener('click', retry);
      document.removeEventListener('touchstart', retry);
    };
    document.addEventListener('click', retry, { once: true });
    document.addEventListener('touchstart', retry, { once: true, passive: true });

    // Some mobile browsers pause background video when the tab/app isn't
    // visible — resume automatically when the page becomes visible again.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('click', retry);
      document.removeEventListener('touchstart', retry);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <>
      <section className="hero" id="home">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />

        <div className="hero-main">
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
        </div>

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
      </section>
    </>
  );
}