import { useEffect, useRef, useState } from 'react';
import { PACKAGES } from '../data/packages';
import './Packages.css';

const TITLE = 'Package Pricing';

const INCLUDES = {
  hybrid: [
    'Solar panels',
    'Hybrid inverter',
    'Battery storage',
    'Installation by our crew',
    'After-sales support',
  ],
  grid: [
    'Solar panels',
    'Grid-tie inverter',
    'Net metering assistance',
    'Installation by our crew',
    'After-sales support',
  ],
};

const ADDONS = [
  { id: 'battery', name: 'Extra Battery Module',    specs: '5.12kWh LiFePO4',                             price: 95000, from: true,  hybridOnly: true },
  { id: 'panels',  name: 'Additional Solar Panels', specs: '2 × 600W, mounting + cable + labor included', price: 22000, from: false, hybridOnly: false },
];

const fmt = (n) => '₱' + Math.round(n).toLocaleString('en-PH');
const batteryText = (b) => (b ? `${b} kWh` : 'None');

const popularIndex = (list) => Math.max(0, list.findIndex((p) => p.popular));

export default function Packages() {
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const touchX = useRef(null);
  const [active, setActive] = useState(popularIndex(PACKAGES));
  const [picked, setPicked] = useState([]);
  const [shown, setShown] = useState(false);

  const list = PACKAGES;
  const n = list.length;

  const go = (dir) => {
    setActive((i) => (i + dir + n) % n);
    setPicked([]);
  };
  const selectPkg = (i) => {
    setActive(i);
    setPicked([]);
  };

  // Makapili ang calculator ng package
  useEffect(() => {
    const onSelect = (e) => {
      const i = PACKAGES.findIndex((p) => p.id === e.detail?.id);
      if (i >= 0) {
        setActive(i);
        setPicked([]);
      }
    };
    window.addEventListener('dc:select-package', onSelect);
    return () => window.removeEventListener('dc:select-package', onSelect);
  }, []);

  // Title reveal: nagsisimula kapag nakita na ang heading mismo
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const offsetOf = (i) => {
    let d = (i - active + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const toggleAddon = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // 3D tilt + glare na sumusunod sa mouse (gitnang card lang)
  const tilt = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
    el.style.setProperty('--rx', `${-(py - 0.5) * 10}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };
  const untilt = (e) => {
    e.currentTarget.style.setProperty('--ry', '0deg');
    e.currentTarget.style.setProperty('--rx', '0deg');
  };

  const pkg = list[active];
  const addons = ADDONS.filter((a) => !a.hybridOnly || pkg.type === 'hybrid');
  const chosen = addons.filter((a) => picked.includes(a.id));
  const addonTotal = chosen.reduce((s, a) => s + a.price, 0);
  const total = pkg.price + addonTotal;
  const hasFrom = chosen.some((a) => a.from);

  const requestPackage = () => {
    const detail = {
      package: pkg.name,
      addons: chosen.map((a) => a.name),
      total,
    };
    try { sessionStorage.setItem('dc-package', JSON.stringify(detail)); } catch (e) { /* okay lang */ }
    window.dispatchEvent(new CustomEvent('dc:package-selected', { detail }));
  };

  return (
    <section id="packages" ref={rootRef}>
      <svg className="pk-waves" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
        <path className="pk-wave w1" d="M-100 180 C 200 80, 420 280, 720 170 S 1240 90, 1560 200" />
        <path className="pk-wave w2" d="M-100 420 C 180 330, 460 520, 760 410 S 1240 340, 1560 450" />
        <path className="pk-wave w3" d="M-100 650 C 240 570, 480 730, 800 640 S 1260 560, 1560 670" />
      </svg>

      <div className="wrap">
        <div className={`pk-head ${shown ? 'in' : ''}`} ref={headRef}>
          <div>
            <div className="pk-eyebrow">SYSTEM PACKAGES</div>
            <h2 className="pk-title" aria-label={TITLE}>
              {TITLE.split(' ').map((w, i) => (
                <span key={i}>
                  <span className="pk-word" aria-hidden="true">
                    <span style={{ '--i': i }}>{w}</span>
                  </span>{' '}
                </span>
              ))}
            </h2>
            <span className="pk-underline" aria-hidden="true" />
            <p className="pk-sub">
              All-in pricing includes panels, inverter, and installation. Your final quote
              depends on brand availability, add-ons, and a site assessment.
            </p>
          </div>
          <a href="#pk-compare" className="pk-more">Compare packages ↓</a>
        </div>

        {/* Coverflow: Hybrid at Grid-Tie sa iisang carousel */}
        <div
          className="pk-stage"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-roledescription="carousel"
          aria-label="Solar packages"
        >
          {list.map((p, i) => {
            const d = offsetOf(i);
            const abs = Math.abs(d);
            const isActive = d === 0;
            return (
              <div
                key={p.id}
                className={`pk-card has-art ${p.type === 'grid' ? 'art-grid' : 'art-hybrid'} ${isActive ? 'is-active' : ''} ${p.popular ? 'is-popular' : ''}`}
                style={{
                  '--d': d,
                  '--abs': Math.min(abs, 3),
                  zIndex: 10 - abs,
                  opacity: abs > 2 ? 0 : isActive ? 1 : 0.6,
                  pointerEvents: abs > 2 ? 'none' : 'auto',
                }}
                onClick={() => !isActive && selectPkg(i)}
                onMouseMove={isActive ? tilt : undefined}
                onMouseLeave={isActive ? untilt : undefined}
                onKeyDown={(e) => {
                  if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    selectPkg(i);
                  }
                }}
                role={isActive ? 'group' : 'button'}
                tabIndex={abs > 2 ? -1 : isActive ? -1 : 0}
                aria-label={isActive ? p.name : `Show ${p.name}`}
              >
                {p.popular && <div className="pk-badge">Popular</div>}
                <span className={`pk-kind ${p.type}`}>
                  {p.type === 'hybrid' ? 'Hybrid · with battery' : 'Grid-Tie · no battery'}
                </span>

                <h3>{p.name}</h3>
                <p className="pk-specs">
                  {p.panels} panels · {p.kwp}
                  {p.battery ? ` · ${p.battery} kWh battery` : ' · no battery'}
                </p>
                <p className="pk-blurb">{p.blurb}</p>

                <ul className="pk-includes">
                  {INCLUDES[p.type].map((x) => (
                    <li key={x}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {x}
                    </li>
                  ))}
                </ul>

                <div className="pk-price">
                  <span className="pk-price-label">All-in installed</span>
                  <span className="pk-price-num mono">{fmt(p.price)}</span>
                </div>

                <span className="pk-glare" aria-hidden="true" />
              </div>
            );
          })}
        </div>

        <div className="pk-dots" role="tablist" aria-label="Choose package">
          {list.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={p.name}
              className={`pk-dot ${i === active ? 'active' : ''}`}
              onClick={() => selectPkg(i)}
            />
          ))}
        </div>

        {/* Customize: add-ons + total */}
        <div className="pk-build">
          <div className="pk-build-col">
            <h4>Add-ons</h4>
            <div className="pk-addons">
              {addons.map((a) => (
                <label key={a.id} className={`pk-addon ${picked.includes(a.id) ? 'on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={picked.includes(a.id)}
                    onChange={() => toggleAddon(a.id)}
                  />
                  <span className="pk-addon-box" aria-hidden="true" />
                  <span className="pk-addon-info">
                    <strong>{a.name}</strong>
                    <small>{a.specs}</small>
                  </span>
                  <span className="pk-addon-price mono">{a.from ? 'from ' : '+'}{fmt(a.price)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pk-summary">
            <div className="pk-summary-title">Your setup</div>
            <div className="pk-summary-name">{pkg.name}</div>
            {chosen.map((a) => (
              <div className="pk-summary-line" key={a.id}>+ {a.name}</div>
            ))}

            <div className="pk-summary-total">
              <span className="pk-price-label">Estimated total{hasFrom ? ' (from)' : ''}</span>
              <span className="pk-total-num mono">{fmt(total)}</span>
            </div>

            <a href="#contact" className="btn btn-primary pk-cta" onClick={requestPackage}>
              Request this package
            </a>
          </div>
        </div>

        {/* Compare */}
        <div className="pk-compare" id="pk-compare">
          <h4>Compare all packages</h4>
          <div className="pk-table-wrap">
            <table className="pk-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Type</th>
                  <th>Panels</th>
                  <th>System size</th>
                  <th>Battery</th>
                  <th>All-in price</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p, i) => (
                  <tr
                    key={p.id}
                    className={i === active ? 'on' : ''}
                    onClick={() => selectPkg(i)}
                  >
                    <td>
                      {p.name}
                      {p.popular && <span className="pk-mini">Popular</span>}
                    </td>
                    <td>{p.type === 'hybrid' ? 'Hybrid' : 'Grid-Tie'}</td>
                    <td>{p.panels}</td>
                    <td>{p.kwp}</td>
                    <td>{batteryText(p.battery)}</td>
                    <td className="mono">{fmt(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="pk-note">
          All systems include  After-sales support. Prices shown are placeholders — swap
          in your real package lineup and figures before launch.
        </p>
      </div>
    </section>
  );
}