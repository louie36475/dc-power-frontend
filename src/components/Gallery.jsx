import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  { kwp: '6.4 kWp · rooftop', place: 'Urdaneta, Pangasinan', from: '#1c2a1c', to: '#0f1a12' },
  { kwp: '10.2 kWp + battery', place: 'San Fernando, Pampanga', from: '#241a0d', to: '#12100a' },
  { kwp: '18 kWp · commercial', place: 'Batangas City', from: '#0d1c24', to: '#0a1218' },
  { kwp: '4.8 kWp · rooftop', place: 'Dagupan City', from: '#1c1418', to: '#120d10' },
  { kwp: '7.6 kWp + backup', place: 'Baguio City', from: '#101c22', to: '#0a1216' },
  { kwp: '12 kWp · rooftop', place: 'Tarlac City', from: '#1e1a0d', to: '#12100a' },
];

export default function Gallery() {
  const gridRef = useRef(null);

  useEffect(() => {
    const anim = gsap.from(gridRef.current.querySelectorAll('.gallery-item'), {
      scale: 0.94,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
    });
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <section id="gallery">
      <div className="circuit-bg" />
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">RECENT WORK</div>
          <h2>A few systems we've put up</h2>
          <p>A sample of recent installs. Swap these placeholders for real project photos before launch.</p>
        </div>

        <div className="gallery-grid" ref={gridRef}>
          {PROJECTS.map((p) => (
            <div className="gallery-item" key={p.place}>
              <div className="swatch" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }} />
              <div className="info">
                <div className="kwp mono">{p.kwp}</div>
                <div className="place">{p.place}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="gallery-note">Placeholder blocks — drop in real project photography here.</p>
      </div>
    </section>
  );
}
