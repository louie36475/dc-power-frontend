import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

// The folder inside your project's "public" folder where the photos live
const FOLDER = '/public/';

// One line per photo. "caption" is optional: add text like
// 'Urdaneta, Pangasinan · 6.4 kWp' to show it on that photo, or leave it ''.
const PHOTOS = [
  { file: 'image 1.png', type: 'Inverter & battery', caption: '' },
  { file: 'image 2.png', type: 'Inverter & battery', caption: '' },
  { file: 'image 3.png', type: 'Inverter & battery', caption: '' },
  { file: 'image 4.png', type: 'Inverter & battery', caption: '' },
  { file: 'image 5.png', type: 'Inverter & battery', caption: '' },
  { file: 'image 6.png', type: 'Inverter & battery', caption: '' },
  { file: 'image 7.png', type: 'Inverter & battery', caption: '' },
  { file: 'image 8.png', type: 'Rooftop panels', caption: '' },
  { file: 'image 9.png', type: 'Rooftop panels', caption: '' },
  { file: 'image 10.png', type: 'Rooftop panels', caption: '' },
  { file: 'image 11.png', type: 'Rooftop panels', caption: '' },
  { file: 'image 12.png', type: 'Rooftop panels', caption: '' },
];

export default function Gallery() {
  const gridRef = useRef(null);
  const [active, setActive] = useState(null); // index of the enlarged photo, or null

  const close = () => setActive(null);
  const next = () => setActive((i) => (i + 1) % PHOTOS.length);
  const prev = () => setActive((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);

  // While a photo is enlarged: Esc closes, arrow keys flip, page scroll is locked
  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [active]);

  useEffect(() => {
    // gsap.context + revert() cleans up fully, so tiles can never be left
    // stuck invisible. fromTo() sets the end state explicitly.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 90%', once: true },
        }
      );
    }, gridRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = setTimeout(refresh, 300);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section id="gallery">
      <div className="circuit-bg" />
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">RECENT WORK</div>
          <h2>A few systems we've put up</h2>
          <p>Inverters, batteries and rooftop panels from our recent installations.</p>
        </div>

        <div className="gallery-grid" ref={gridRef}>
          {PHOTOS.map((p, i) => (
            <figure
              className="gallery-item"
              key={p.file}
              role="button"
              tabIndex={0}
              aria-label={`View ${p.type} photo ${i + 1} larger`}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActive(i);
                }
              }}
            >
              <img
                src={encodeURI(FOLDER + p.file)}
                alt={`${p.type} installation ${i + 1}`}
                className="gallery-img"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="info">
                <div className="kwp mono">{p.type}</div>
                {p.caption && <div className="place">{p.caption}</div>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {active !== null &&
        createPortal(
          <div className="lightbox" onClick={close} role="dialog" aria-modal="true" aria-label="Photo viewer">
            <button type="button" className="lightbox-close" onClick={close} aria-label="Close">
              ×
            </button>
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <img
              className="lightbox-img"
              src={encodeURI(FOLDER + PHOTOS[active].file)}
              alt={`${PHOTOS[active].type} installation ${active + 1}`}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
            >
              ›
            </button>
            <div className="lightbox-caption">
              {PHOTOS[active].type}
              {PHOTOS[active].caption ? ` · ${PHOTOS[active].caption}` : ''} — {active + 1} / {PHOTOS.length}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}