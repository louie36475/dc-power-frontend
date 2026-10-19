import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Showcase.css';

// Nasaan ang photos sa "public" folder. '/' = directly sa public.
const FOLDER = '/';
const TITLE = 'Showcase';
const AUTOPLAY_MS = 4500;

// Palitan mo ang title at desc ng totoong details. Idagdag o bawasan mo lang ang list.
const SLIDES = [
  { file: 'image 8.png',  title: 'Rooftop Solar Installation', desc: 'Isulat dito ang maikling kwento ng project.' },
  { file: 'image 9.png',  title: 'Hybrid Inverter & Battery',  desc: 'Isulat dito ang maikling kwento ng project.' },
  { file: 'image 10.png', title: 'Residential Solar System',   desc: 'Isulat dito ang maikling kwento ng project.' },
  { file: 'image 11.png', title: 'Rooftop Panel Array',        desc: 'Isulat dito ang maikling kwento ng project.' },
  { file: 'image 12.png', title: 'Home Backup System',         desc: 'Isulat dito ang maikling kwento ng project.' },
  { file: 'image 13.png', title: 'Solar + Battery Setup',      desc: 'Isulat dito ang maikling kwento ng project.' },
];

const src = (file) => encodeURI(FOLDER + file);

export default function Showcase() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [typed, setTyped] = useState('');
  const n = SLIDES.length;

  const go = (dir) => setActive((i) => (i + dir + n) % n);

  // Typewriter: nagsisimula kapag nakita na ang section
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let timer;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      let i = 0;
      timer = setInterval(() => {
        i += 1;
        setTyped(TITLE.slice(0, i));
        if (i >= TITLE.length) clearInterval(timer);
      }, 90);
    };
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && start(),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, []);

  // Autoplay (humihinto kapag naka-hover, o kung naka-reduce motion ang device)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return;
    const t = setInterval(() => setActive((i) => (i + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, n]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  // Layo ng bawat card mula sa gitna (paikot, kaya walang dulo)
  const offsetOf = (i) => {
    let d = (i - active + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  const current = SLIDES[active];

  return (
    <section id="showcase" ref={rootRef}>
      {/* Wavy lines sa background */}
      <svg className="sc-waves" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
        <path className="wave w1" d="M-100 180 C 200 80, 420 280, 720 170 S 1240 90, 1560 200" />
        <path className="wave w2" d="M-100 420 C 180 330, 460 520, 760 410 S 1240 340, 1560 450" />
        <path className="wave w3" d="M-100 650 C 240 570, 480 730, 800 640 S 1260 560, 1560 670" />
      </svg>

      <div className="wrap">
        <div className="sc-head">
          <div>
            <div className="sc-eyebrow"></div>
            <h2 className="sc-title">
              {typed}
              <span className="sc-cursor" aria-hidden="true" />
            </h2>
            <p className="sc-sub">A collection of solar and battery systems we've installed.</p>
          </div>
          <Link to="/projects" className="sc-more">
            View More Projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Coverflow: pindutin ang picture para lumipat */}
        <div
          className="sc-stage"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Project photos"
        >
          {SLIDES.map((s, i) => {
            const d = offsetOf(i);
            const abs = Math.abs(d);
            return (
              <button
                type="button"
                key={s.file}
                className={`sc-card ${d === 0 ? 'is-active' : ''}`}
                style={{
                  '--d': d,
                  '--abs': Math.min(abs, 3),
                  zIndex: 10 - abs,
                  opacity: abs > 2 ? 0 : 1,
                  pointerEvents: abs > 2 ? 'none' : 'auto',
                }}
                onClick={() => (d === 0 ? go(1) : setActive(i))}
                aria-label={d === 0 ? 'Next photo' : `Show ${s.title}`}
                tabIndex={abs > 2 ? -1 : 0}
              >
                <img src={src(s.file)} alt={s.title} draggable="false" loading={i < 3 ? 'eager' : 'lazy'} />
              </button>
            );
          })}
        </div>

        {/* Caption ng napiling picture */}
        <div className="sc-caption" key={active}>
          <h3>{current.title}</h3>
          <p>{current.desc}</p>
        </div>

        {/* Dots */}
        <div className="sc-dots" role="tablist" aria-label="Choose photo">
          {SLIDES.map((s, i) => (
            <button
              key={s.file}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to photo ${i + 1}`}
              className={`sc-dot ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}