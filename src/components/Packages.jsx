import { useEffect, useRef, useState } from 'react';
import './Packages.css';

const TITLE = 'Package Pricing';

// Placeholder lang ito. 0 = walang interes. Palitan kapag alam mo na ang totoong financing.
const INTEREST_RATE = 0; // taunang interes, hal. 0.12 = 12%
const TERMS = [0, 12, 24, 36]; // 0 = cash

const TYPES = [
  { id: 'hybrid', label: 'Hybrid (with battery)' },
  { id: 'grid', label: 'Grid-Tie' },
];

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

// price = numero lang (walang ₱ o comma). battery: 0 = walang battery
const PACKAGES = [
  // Hybrid
  { id: '6kw',  type: 'hybrid', name: '6kW Hybrid System',  panels: '8 × 600W',  kwp: '4.8 kWp', battery: 10, blurb: 'Entry-level hybrid for smaller homes.',        price: 320000, popular: true },
  { id: '8kw',  type: 'hybrid', name: '8kW Hybrid System',  panels: '10 × 600W', kwp: '6 kWp', battery: 10, blurb: 'Our most popular size for Filipino homes.',    price: 370000, popular: false },
  { id: '10kw', type: 'hybrid', name: '10kW Hybrid System', panels: '14 × 600W', kwp: '8.4 kWp', battery: 10, blurb: 'For medium homes running air conditioning.',   price: 340000, popular: false },
  { id: '12kw', type: 'hybrid', name: '12kW Hybrid System', panels: '16 × 600W', kwp: '9.6 kWp', battery: 16, blurb: 'Larger households or small businesses.',       price: 450000, popular: false },
  // Grid-tie (placeholder: parehong presyo ng hybrid)
  { id: 'g6',   type: 'grid',   name: '6kW Grid-Tie System',  panels: '8 × 600W',  kwp: '4.8 kWp', battery: 0, blurb: 'Lower your bill with solar, no battery.',      price: 160000, popular: true },
  { id: 'g8',   type: 'grid',   name: '8kW Grid-Tie System',  panels: '10 × 600W', kwp: '6 kWp', battery: 0, blurb: 'A popular size for homes with daytime use.',   price: 200000, popular: false },
  { id: 'g10',  type: 'grid',   name: '10kW Grid-Tie System', panels: '14 × 600W', kwp: '8.4 kWp', battery: 0, blurb: 'For medium homes running air conditioning.',   price: 250000, popular: false },
  { id: 'g12',  type: 'grid',   name: '12kW Grid-Tie System', panels: '16 × 600W', kwp: '9.6 kWp', battery: 0, blurb: 'Larger households or small businesses.',       price: 300000, popular: false },
];

const ADDONS = [
  { id: 'battery', name: 'Extra Battery Module',    specs: '5.12kWh LiFePO4', price: 95000, from: true,  hybridOnly: true },
  { id: 'panels',  name: 'Additional Solar Panels', specs: '1 × 600W', price: 7000, from: false, hybridOnly: false },
];

const fmt = (n) => '₱' + Math.round(n).toLocaleString('en-PH');
const batteryText = (b) => (b ? `${b} kWh` : 'None');

const monthly = (total, months) => {
  if (!months) return total;
  const r = INTEREST_RATE / 12;
  if (!r) return total / months;
  return (total * r) / (1 - Math.pow(1 + r, -months));
};

const popularIndex = (list) => Math.max(0, list.findIndex((p) => p.popular));

export default function Packages() {
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const touchX = useRef(null);
  const [type, setType] = useState('hybrid');
  const [active, setActive] = useState(popularIndex(PACKAGES.filter((p) => p.type === 'hybrid')));
  const [term, setTerm] = useState(0);
  const [picked, setPicked] = useState([]);
  const [shown, setShown] = useState(false);

  const list = PACKAGES.filter((p) => p.type === type);
  const n = list.length;
  const addons = ADDONS.filter((a) => !a.hybridOnly || type === 'hybrid');

  const go = (dir) => setActive((i) => (i + dir + n) % n);

  const changeType = (t) => {
    if (t === type) return;
    setType(t);
    setActive(popularIndex(PACKAGES.filter((p) => p.type === t)));
    setPicked([]);
  };

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

  const pkg = list[active];
  const chosen = addons.filter((a) => picked.includes(a.id));
  const addonTotal = chosen.reduce((s, a) => s + a.price, 0);
  const total = pkg.price + addonTotal;
  const hasFrom = chosen.some((a) => a.from);

  const requestPackage = () => {
    const detail = {
      package: pkg.name,
      addons: chosen.map((a) => a.name),
      total,
      term: term ? `${term} months` : 'Cash',
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

        {/* Type toggle */}
        <div className="pk-type" role="tablist" aria-label="System type">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={type === t.id}
              className={`pk-type-btn ${type === t.id ? 'active' : ''}`}
              onClick={() => changeType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Coverflow */}
        <div
          className="pk-stage"
          key={type}
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
                className={`pk-card ${isActive ? 'is-active' : ''} ${p.popular ? 'is-popular' : ''}`}
                style={{
                  '--d': d,
                  '--abs': Math.min(abs, 3),
                  zIndex: 10 - abs,
                  opacity: abs > 2 ? 0 : isActive ? 1 : 0.6,
                  pointerEvents: abs > 2 ? 'none' : 'auto',
                }}
                onClick={() => !isActive && setActive(i)}
                onKeyDown={(e) => {
                  if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                role={isActive ? 'group' : 'button'}
                tabIndex={abs > 2 ? -1 : isActive ? -1 : 0}
                aria-label={isActive ? p.name : `Show ${p.name}`}
              >
                {p.popular && <div className="pk-badge">Popular</div>}
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
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        {/* Customize: financing + add-ons + total */}
        <div className="pk-build">
          <div className="pk-build-col">
            <h4>Payment option</h4>
            <div className="pk-chips" role="radiogroup" aria-label="Payment option">
              {TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={term === t}
                  className={`pk-chip ${term === t ? 'active' : ''}`}
                  onClick={() => setTerm(t)}
                >
                  {t ? `${t} months` : 'Cash'}
                </button>
              ))}
            </div>
            <p className="pk-fine">
              Estimate lang ito{INTEREST_RATE ? ` (${Math.round(INTEREST_RATE * 100)}% interes kada taon)` : ' (walang interes)'}.
              Ang totoong financing ay depende sa provider at sa approval.
            </p>

            <h4 className="pk-h4-gap">Add-ons</h4>
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

            {term > 0 && (
              <div className="pk-monthly">
                ≈ <strong className="mono">{fmt(monthly(total, term))}</strong> / month for {term} months
              </div>
            )}

            <a href="#contact" className="btn btn-primary pk-cta" onClick={requestPackage}>
              Request this package
            </a>
          </div>
        </div>

        {/* Compare */}
        <div className="pk-compare" id="pk-compare">
          <h4>Compare {type === 'hybrid' ? 'hybrid' : 'grid-tie'} packages</h4>
          <div className="pk-table-wrap">
            <table className="pk-table">
              <thead>
                <tr>
                  <th>Package</th>
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
                    onClick={() => setActive(i)}
                  >
                    <td>
                      {p.name}
                      {p.popular && <span className="pk-mini">Popular</span>}
                    </td>
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
          All systems include lifetime after-sales support. Prices shown are placeholders — swap
          in your real package lineup and figures before launch.
        </p>
      </div>
    </section>
  );
}