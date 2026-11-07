import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Xmas.css';

const KEY = 'dc-xmas';
const reduce = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Kusang on tuwing Nov at Dec, maliban kung pinili na ng user
const initial = () => {
  try {
    const s = localStorage.getItem(KEY);
    if (s !== null) return s === '1';
  } catch (e) { /* okay lang */ }
  return new Date().getMonth() >= 10;
};
if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('xmas', initial());
}

/* Sumasabog na ❄ ✨ */
export function burst(x, y, count = 10) {
  if (typeof document === 'undefined' || reduce()) return;
  const items = ['❄', '❄', '✨', '⭐', '🎄'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'xmas-particle';
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    gsap.fromTo(
      el,
      { scale: 0.3, opacity: 1 },
      {
        x: (Math.random() - 0.5) * 220,
        y: -30 - Math.random() * 100,
        rotation: (Math.random() - 0.5) * 300,
        scale: 0.8 + Math.random() * 0.7,
        duration: 0.55 + Math.random() * 0.25,
        ease: 'power2.out',
        onComplete: () =>
          gsap.to(el, {
            y: '+=150',
            opacity: 0,
            duration: 0.8,
            ease: 'power1.in',
            onComplete: () => el.remove(),
          }),
      }
    );
  }
}

const center = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
};

/* 🎄 On/off button */
export function XmasToggle() {
  const [on, setOn] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('xmas')
  );

  const toggle = (e) => {
    const next = !on;
    setOn(next);
    document.documentElement.classList.toggle('xmas', next);
    try { localStorage.setItem(KEY, next ? '1' : '0'); } catch (err) { /* okay lang */ }
    if (next) {
      burst(...center(e), 10);
      if (!reduce()) {
        gsap.fromTo(
          e.currentTarget,
          { y: 0 },
          { y: -6, duration: 0.18, yoyo: true, repeat: 3, ease: 'power1.inOut' }
        );
      }
    }
  };

  return (
    <button
      type="button"
      className={`xmas-toggle ${on ? 'on' : ''}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn off Christmas mode' : 'Turn on Christmas mode'}
      title="Christmas mode"
    >
      🎄
    </button>
  );
}

/* Santa hat sa logo */
export function XmasHat() {
  return (
    <svg className="xn-hat" viewBox="0 0 32 28" width="26" height="23" aria-hidden="true">
      <path d="M4 22C6 8 16 2 27 6c-5 1-7 5-7 9l8 7z" fill="#d32f2f" />
      <rect x="2" y="19" width="28" height="7" rx="3.5" fill="#fff" />
      <circle cx="27" cy="6" r="3.6" fill="#fff" />
    </svg>
  );
}

/* Lights, snow, at snow cap ng navbar (absolute overlay, hindi nakakagulo sa layout) */
const BULBS = 14;
const FLAKES = 10;

export function XmasNavDecor() {
  const rootRef = useRef(null);
  const [colors, setColors] = useState(() => Array.from({ length: BULBS }, (_, i) => i % 4));

  useEffect(() => {
    if (reduce()) return;
    const ctx = gsap.context(() => {
      // Kumukurap na bombilya
      gsap.to('.xn-bulb', {
        opacity: 0.4,
        duration: 0.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.12, from: 'random' },
      });

      // Bumabagsak na snow (kaunti lang)
      gsap.utils.toArray('.xn-flake').forEach((f) => {
        gsap.set(f, { x: gsap.utils.random(0, 100) + '%' , y: -8, opacity: 0 });
        gsap.to(f, {
          y: 76,
          x: '+=' + gsap.utils.random(-24, 24),
          opacity: 0.9,
          duration: gsap.utils.random(3.5, 6),
          delay: gsap.utils.random(0, 5),
          ease: 'none',
          repeat: -1,
          modifiers: {
            opacity: (v, t) => {
              const p = gsap.getProperty(t, 'y') / 76;
              return p < 0.1 ? p * 9 : p > 0.85 ? (1 - p) * 6 : 0.9;
            },
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const pop = (i, e) => {
    setColors((c) => c.map((v, idx) => (idx === i ? (v + 1) % 4 : v)));
    burst(...center(e), 8);
    if (!reduce()) {
      gsap.fromTo(e.currentTarget, { scale: 1.6 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    }
  };

  return (
    <div
      ref={rootRef}
      className="xn"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {/* Snow na nasa loob lang ng pill */}
      <div className="xn-snow" aria-hidden="true">
        {Array.from({ length: FLAKES }).map((_, i) => (
          <span key={i} className="xn-flake">❄</span>
        ))}
      </div>

      {/* Snow cap */}
      <div className="xn-cap" aria-hidden="true" />

      {/* String lights */}
      <div className="xn-lights">
        <svg className="xn-wire" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 2 Q50 14 100 2" fill="none" stroke="#5a3b2e" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        {colors.map((c, i) => {
          const t = (i + 0.5) / BULBS;
          const y = 2 + 24 * t * (1 - t);
          return (
            <button
              key={i}
              type="button"
              className="xn-bulb"
              data-c={c}
              style={{ left: `${t * 100}%`, top: `${y}px` }}
              onClick={(e) => pop(i, e)}
              aria-label="Christmas light"
              tabIndex={-1}
            />
          );
        })}
      </div>
    </div>
  );
}