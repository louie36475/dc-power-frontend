import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Gallery.css';

gsap.registerPlugin(ScrollTrigger);

// Nasaan ang photos sa "public" folder. '/' = directly sa public.
const FOLDER = '/';

// Placeholder specs. Palitan mo kada project ng totoong details.
// Kung ayaw mong ulit-ulitin, pwede mong palitan ang `specs` ng sariling list.
const DEFAULT_SPECS = [
  { label: 'Inverter', value: 'Isulat dito' },
  { label: 'Panels', value: 'Isulat dito' },
  { label: 'Battery', value: 'Isulat dito' },
  { label: 'Location', value: 'Lokasyon, Siyudad' },
  { label: 'Duration', value: '1 Day' },
  { label: 'Commissioned', value: 'Buwan Araw, Taon' },
];

const DEFAULT_ABOUT =
  'Isulat dito ang maikling kwento ng project: ano ang kailangan ng client, anong system ang ni-install, at ano ang naging resulta.';

// ---------------------------------------------------------------------------
// Isang block = isang project card. Para magdagdag ng pictures sa isang
// project, idagdag lang sa `photos`, hal.  photos: ['image 1.png', 'image 13.png']
// Yung unang photo ang cover sa grid.
// ---------------------------------------------------------------------------
const PROJECTS = [
  { id: 'project-1',  badge: '', place: '', title: '',  specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 1.png'] },
  { id: 'project-2',  badge: '', place: '', title: '',  specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 2.png'] },
  { id: 'project-3',  badge: '', place: '', title: '',  specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 3.png'] },
  { id: 'project-4',  badge: '', place: '', title: '',  specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 4.png'] },
  { id: 'project-5',  badge: '', place: '', title: '',  specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 5.png'] },
  { id: 'project-6',  badge: '', place: '', title: '',  specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 6.png'] },
  { id: 'project-7',  badge: '', place: '', title: '',  specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 7.png'] },
  { id: 'project-8',  badge: '', place: '', title: '',      specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 8.png'] },
  { id: 'project-9',  badge: '', place: '', title: '',      specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 9.png'] },
  { id: 'project-10', badge: '', place: '', title: '',      specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 10.png'] },
  { id: 'project-11', badge: '', place: '', title: '',      specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 11.png'] },
  { id: 'project-12', badge: '', place: '', title: '',      specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 12.png'] },
  { id: 'project-13', badge: '', place: '', title: '',              specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 13.png'] },
  { id: 'project-14', badge: '', place: '', title: '',              specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 14.png'] },
  { id: 'project-15', badge: '', place: '', title: '',              specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 15.png'] },
  { id: 'project-16', badge: '', place: '', title: '',              specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 16.png'] },
  { id: 'project-17', badge: '', place: '', title: '',              specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 17.png'] },
  { id: 'project-18', badge: '', place: '', title: '',              specs: DEFAULT_SPECS, about: DEFAULT_ABOUT, photos: ['image 18.png'] },
];

const src = (file) => encodeURI(FOLDER + file);

export default function Gallery() {
  const gridRef = useRef(null);
  const thumbsRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null); // index or null
  const [activePhoto, setActivePhoto] = useState(0);

  const project = activeProject !== null ? PROJECTS[activeProject] : null;

  const openProject = (i) => {
    setActiveProject(i);
    setActivePhoto(0);
  };
  const close = () => setActiveProject(null);

  const nextPhoto = () =>
    setActivePhoto((i) => (project ? (i + 1) % project.photos.length : 0));
  const prevPhoto = () =>
    setActivePhoto((i) =>
      project ? (i - 1 + project.photos.length) % project.photos.length : 0
    );

  // Habang bukas ang modal: Esc = close, arrow keys = palit photo, naka-lock ang scroll ng page
  useEffect(() => {
    if (activeProject === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [activeProject]);

  // I-scroll yung thumbnail strip para laging kita yung napiling photo
  useEffect(() => {
    if (activeProject === null || !thumbsRef.current) return;
    const el = thumbsRef.current.querySelector('.pm-thumb.active');
    if (el) el.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  }, [activePhoto, activeProject]);

  useEffect(() => {
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
          {PROJECTS.map((p, i) => (
            <figure
              className="gallery-item"
              key={p.id}
              role="button"
              tabIndex={0}
              aria-label={`View details of ${p.title}`}
              onClick={() => openProject(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openProject(i);
                }
              }}
            >
              <img
                src={src(p.photos[0])}
                alt={p.title}
                className="gallery-img"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="info">
                <div className="kwp mono">{p.badge} · {p.place}</div>
                <div className="place">{p.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {project &&
        createPortal(
          <div className="pm-overlay" onClick={close}>
            <div
              className="pm-modal"
              role="dialog"
              aria-modal="true"
              aria-label={project.title}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="pm-header">
                <div className="pm-header-text">
                  <div className="pm-meta">
                    <span className="pm-badge">{project.badge}</span>
                    <span className="pm-place">{project.place}</span>
                  </div>
                  <h3 className="pm-title">{project.title}</h3>
                </div>
                <button type="button" className="pm-close" onClick={close} aria-label="Close">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="pm-body">
                {/* Kaliwa: photos */}
                <div className="pm-left">
                  <div className="pm-stage">
                    <img
                      className="pm-main-img"
                      src={src(project.photos[activePhoto])}
                      alt={`${project.title} – photo ${activePhoto + 1}`}
                    />
                    {project.photos.length > 1 && (
                      <>
                        <button type="button" className="pm-arrow pm-arrow-prev" onClick={prevPhoto} aria-label="Previous photo">‹</button>
                        <button type="button" className="pm-arrow pm-arrow-next" onClick={nextPhoto} aria-label="Next photo">›</button>
                      </>
                    )}
                  </div>

                  {project.photos.length > 1 && (
                    <div className="pm-thumbs" ref={thumbsRef}>
                      {project.photos.map((file, i) => (
                        <button
                          type="button"
                          key={file}
                          className={`pm-thumb ${i === activePhoto ? 'active' : ''}`}
                          onClick={() => setActivePhoto(i)}
                          aria-label={`Show photo ${i + 1}`}
                        >
                          <img src={src(file)} alt="" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kanan: details */}
                <div className="pm-right">
                  <div className="pm-specs">
                    <h4 className="pm-heading">System Specifications</h4>
                    {project.specs.map((s) => (
                      <div className="pm-spec" key={s.label}>
                        <div className="pm-spec-label">{s.label}</div>
                        <div className="pm-spec-value">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <h4 className="pm-heading pm-about-heading">About this project</h4>
                  <p className="pm-about">{project.about}</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}