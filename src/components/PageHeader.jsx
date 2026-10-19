import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageHeader({ eyebrow, title, text }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.ph-eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          '.ph-word > span',
          { yPercent: 110, opacity: 0, filter: 'blur(10px)' },
          { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.14 },
          '-=0.3'
        )
        .fromTo('.ph-line', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '-=0.4')
        .fromTo('.ph-text', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.5');
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div className="page-header" ref={ref}>
      <svg className="ph-waves" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
        <path className="ph-wave w1" d="M-100 120 C 200 40, 440 220, 740 120 S 1240 40, 1560 140" />
        <path className="ph-wave w2" d="M-100 280 C 220 200, 460 360, 780 270 S 1250 200, 1560 300" />
      </svg>
      <div className="ph-glow" aria-hidden="true" />

      <div className="wrap ph-inner">
        <div className="ph-eyebrow">{eyebrow}</div>
        <h1 aria-label={title}>
          {title.split(' ').map((w, i) => (
            <span key={i}>
              <span className="ph-word" aria-hidden="true">
                <span>{w}</span>
              </span>{' '}
            </span>
          ))}
        </h1>
        <span className="ph-line" aria-hidden="true" />
        <p className="ph-text">{text}</p>
      </div>
    </div>
  );
}