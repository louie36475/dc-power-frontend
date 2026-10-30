import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PACKAGES } from '../data/packages';
import './SizeCalculator.css';

// Rough planning assumptions for the Philippines — good enough for a
// ballpark estimate. The real number comes from a site visit.
const RATE_PER_KWH = 12; // ₱ per kWh, typical residential rate
const PEAK_SUN_HOURS = 4.5; // average usable sun hours/day, PH-wide
const SYSTEM_DERATE = 0.8; // inverter/wiring/soiling/temperature losses
const PANEL_WATTAGE = 600; // W per panel
const PANEL_AREA_SQM = 2.7; // roof area per panel incl. spacing
const BATTERY_USABLE_FRACTION = 0.9; // usable depth-of-discharge, LiFePO4
const BATTERY_STEP_KWH = 5; // round suggested battery size to this step
const BATTERY_MODULE_KWH = 5.12; // Extra Battery Module

const HINTS = ['₱5,000 a month', '₱8,000 a month', '₱12,000 a month', '650 kWh a month'];

const fmt = (n) => '₱' + Math.round(n).toLocaleString('en-PH');
const countOf = (p) => p.panelCount ?? (parseInt(p.panels, 10) || 0);

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Animated na empty state ---------- */
function EmptyState() {
  const rootRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const reduce = reduceMotion();
    const ctx = gsap.context(() => {
      if (reduce) {
        if (textRef.current) textRef.current.textContent = HINTS[0];
        return;
      }

      // Pasok
      gsap.from('.em-fade', { y: 18, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });

      // Typing ng mga halimbawa
      const el = textRef.current;
      const tl = gsap.timeline({ repeat: -1 });
      HINTS.forEach((h) => {
        const o = { n: 0 };
        tl.to(o, {
          n: h.length,
          duration: h.length * 0.06,
          ease: 'none',
          onUpdate: () => { if (el) el.textContent = h.slice(0, Math.round(o.n)); },
        })
          .to({}, { duration: 1.1 })
          .to(o, {
            n: 0,
            duration: h.length * 0.03,
            ease: 'none',
            onUpdate: () => { if (el) el.textContent = h.slice(0, Math.round(o.n)); },
          })
          .to({}, { duration: 0.25 });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
  <div className="cc-empty" ref={rootRef}>
    <div className="em-eyebrow em-fade">Waiting for your numbers</div>

    <div className="em-title em-fade">
      Let's find <span className="em-hl">your system</span>
    </div>

    <div className="em-type em-fade">
      <span className="em-type-label">Try</span>
      <span className="em-type-text mono" ref={textRef} />
      <span className="em-caret" />
    </div>

    <p className="em-sub em-fade">
      Type your bill or usage on the left and the packages that fit you will show up here.
    </p>
  </div>
);
}

export default function SizeCalculator({ onEstimate }) {
  const listRef = useRef(null);
  const [mode, setMode] = useState('bill'); // 'bill' | 'kwh'
  const [bill, setBill] = useState('');
  const [kwh, setKwh] = useState('');
  const [nightPercent, setNightPercent] = useState(30);

  const billNum = parseFloat(String(bill).replace(/,/g, '')) || 0;
  const kwhNum = parseFloat(String(kwh).replace(/,/g, '')) || 0;

  const monthlyKwh = mode === 'bill' ? billNum / RATE_PER_KWH : kwhNum;
  const hasInput = monthlyKwh > 0;

  const dailyKwh = monthlyKwh / 30;
  const recommendedKwp = dailyKwh / (PEAK_SUN_HOURS * SYSTEM_DERATE);
  const numPanels = Math.ceil((recommendedKwp * 1000) / PANEL_WATTAGE);
  const installedKwp = (numPanels * PANEL_WATTAGE) / 1000;
  const roofArea = numPanels * PANEL_AREA_SQM;

  const dayPercent = 100 - nightPercent;
  const nightlyKwh = dailyKwh * (nightPercent / 100);
  const rawBatteryKwh = nightlyKwh / BATTERY_USABLE_FRACTION;
  const suggestedBatteryKwh = Math.ceil(rawBatteryKwh / BATTERY_STEP_KWH) * BATTERY_STEP_KWH;

  let batteryTier;
  if (nightPercent < 20) {
    batteryTier = {
      label: 'Optional',
      note: 'Most of your usage is during the day, so solar alone covers the bulk of your load.',
    };
  } else if (nightPercent <= 40) {
    batteryTier = {
      label: 'Worth adding',
      note: 'A good part of your usage is at night. A battery cuts what you still pull from the grid after sunset.',
    };
  } else {
    batteryTier = {
      label: 'Recommended',
      note: 'Most of your usage is at night, when panels generate nothing. We strongly recommend a battery.',
    };
  }

  // ---------- Packages na tugma ----------
  const wantsBattery = nightPercent >= 20;
  const pickFor = (type) =>
    PACKAGES.filter((p) => p.type === type)
      .sort((a, b) => countOf(a) - countOf(b))
      .find((p) => countOf(p) >= numPanels) || null;
  const maxPanels = Math.max(...PACKAGES.map(countOf));
  const tooBig = hasInput && numPanels > maxPanels;

  const hybridPick = hasInput && !tooBig ? pickFor('hybrid') : null;
  const gridPick = hasInput && !tooBig ? pickFor('grid') : null;
  const matches = [hybridPick, gridPick]
    .filter(Boolean)
    .map((p) => ({ pkg: p, best: wantsBattery ? p.type === 'hybrid' : p.type === 'grid' }))
    .sort((a, b) => Number(b.best) - Number(a.best));

  const extraModules =
    hybridPick && suggestedBatteryKwh > hybridPick.battery
      ? Math.ceil((suggestedBatteryKwh - hybridPick.battery) / BATTERY_MODULE_KWH)
      : 0;

  const goToPackage = (id) => {
    window.dispatchEvent(new CustomEvent('dc:select-package', { detail: { id } }));
    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Report the current result up to the quote form
  useEffect(() => {
    if (!onEstimate) return;
    if (!hasInput) {
      onEstimate(null);
      return;
    }
    onEstimate({
      monthlyBill: mode === 'bill' ? Math.round(billNum) : null,
      monthlyKwh: Math.round(monthlyKwh),
      kwp: Number(installedKwp.toFixed(1)),
      panels: numPanels,
      roofArea: Math.round(roofArea),
      nightPercent,
      dayPercent,
      batteryLabel: batteryTier.label,
      batteryKwh: suggestedBatteryKwh,
    });
  }, [mode, billNum, kwhNum, nightPercent, onEstimate]);

  // Maliit na pasok ng mga card kapag nagbago ang tugmang package
  const matchKey = matches.map((m) => m.pkg.id).join('|');
  useEffect(() => {
    if (!matchKey || reduceMotion() || !listRef.current) return;
    gsap.fromTo(
      listRef.current.querySelectorAll('.cc-match'),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
    );
  }, [matchKey]);

  return (
    <div className="calc-card">
      <div className="calc-head">
        <div className="eyebrow">QUICK ESTIMATE</div>
        <h3>Not sure what size you need?</h3>
        <p>Enter your electric bill (or your usage in kWh, if you know it) and we'll show the packages that fit.</p>
      </div>

      <div className="calc-body">
        {/* Kaliwa: inputs */}
        <div className="calc-inputs">
          <div className="calc-mode-toggle" role="tablist" aria-label="Calculator input mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'bill'}
              className={`calc-mode-btn ${mode === 'bill' ? 'active' : ''}`}
              onClick={() => setMode('bill')}
            >
              By monthly bill
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'kwh'}
              className={`calc-mode-btn ${mode === 'kwh' ? 'active' : ''}`}
              onClick={() => setMode('kwh')}
            >
              By kWh usage
            </button>
          </div>

          {mode === 'bill' ? (
            <div className="field">
              <label htmlFor="calc-bill">Average monthly electric bill (₱)</label>
              <input
                id="calc-bill"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 8,000"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
              />
            </div>
          ) : (
            <div className="field">
              <label htmlFor="calc-kwh">Average monthly usage (kWh)</label>
              <input
                id="calc-kwh"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 650"
                value={kwh}
                onChange={(e) => setKwh(e.target.value)}
              />
            </div>
          )}

          <div className="field calc-slider-field">
            <label htmlFor="calc-night">
              How much of your electricity use happens at night (6pm–6am)?
            </label>
            <input
              id="calc-night"
              type="range"
              min="0"
              max="100"
              step="5"
              value={nightPercent}
              onChange={(e) => setNightPercent(Number(e.target.value))}
              className="calc-slider"
            />
            <div className="calc-split-bar">
              <div className="calc-split-day" style={{ width: `${dayPercent}%` }} />
              <div className="calc-split-night" style={{ width: `${nightPercent}%` }} />
            </div>
            <div className="calc-split-labels">
              <span className="calc-split-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" fill="#f5c518" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Day — {dayPercent}%
              </span>
              <span className="calc-split-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" fill="#1f6fd1" />
                </svg>
                Night — {nightPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Kanan: resulta */}
        <div className={`calc-out ${hasInput ? 'show' : ''}`}>
          {!hasInput ? (
            <EmptyState />
          ) : (
            <>
              <div className="cc-label">Your estimate</div>
              <div className="cc-stats">
                <div>
                  <strong className="mono">{installedKwp.toFixed(1)}</strong>
                  <span>kWp system</span>
                </div>
                <div>
                  <strong className="mono">{numPanels}</strong>
                  <span>panels ({PANEL_WATTAGE}W)</span>
                </div>
                <div>
                  <strong className="mono">{Math.round(roofArea)} m²</strong>
                  <span>roof area</span>
                </div>
              </div>

              <p className="cc-battery-line">
                <b>Battery: {batteryTier.label}</b> (about {suggestedBatteryKwh} kWh). {batteryTier.note}
              </p>

              <div className="cc-label cc-label-gap">Packages that fit you</div>

              {tooBig && (
                <p className="cc-note">
                  Your system is bigger than our largest standard package ({maxPanels} panels).
                  Send us your details below and we'll size a custom system for you.
                </p>
              )}

              <div className="cc-matches" ref={listRef}>
                {matches.map(({ pkg, best }) => (
                  <button
                    type="button"
                    key={pkg.id}
                    className={`cc-match ${best ? 'best' : ''}`}
                    onClick={() => goToPackage(pkg.id)}
                  >
                    <span className="cc-match-top">
                      <span className={`cc-kind ${pkg.type}`}>
                        {pkg.type === 'hybrid' ? 'Hybrid' : 'Grid-Tie'}
                      </span>
                      {best && <span className="cc-best">Best match</span>}
                    </span>
                    <span className="cc-match-name">{pkg.name}</span>
                    <span className="cc-match-meta">
                      {pkg.panels} · {pkg.kwp}
                      {pkg.battery ? ` · ${pkg.battery} kWh battery` : ' · no battery'}
                    </span>
                    <span className="cc-match-bottom">
                      <span className="cc-match-price mono">{fmt(pkg.price)}</span>
                      <span className="cc-match-go">View package →</span>
                    </span>
                    {pkg.type === 'hybrid' && extraModules > 0 && (
                      <span className="cc-match-note">
                        Add {extraModules} Extra Battery Module{extraModules > 1 ? 's' : ''} to reach about {suggestedBatteryKwh} kWh.
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="calc-note">
        Rough estimate based on {PEAK_SUN_HOURS} peak sun hours/day and typical system losses — we'll
        confirm the exact size during a free site visit.
      </p>
    </div>
  );
}