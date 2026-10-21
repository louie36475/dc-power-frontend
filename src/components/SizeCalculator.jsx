import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
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

const MAX_KWP = 15; // para sa ring gauge
const MAX_BATTERY = 30; // para sa battery bar
const MAX_CELLS = 24; // pinakamaraming panel na ipapakita sa grid
const RING = 2 * Math.PI * 44;

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Numero na umaakyat/bumababa nang smooth gamit ang GSAP
function useTween(target, duration = 0.8) {
  const [value, setValue] = useState(target);
  const obj = useRef({ v: target });
  useEffect(() => {
    if (reduceMotion()) {
      obj.current.v = target;
      setValue(target);
      return;
    }
    const tw = gsap.to(obj.current, {
      v: target,
      duration,
      ease: 'power3.out',
      onUpdate: () => setValue(obj.current.v),
    });
    return () => tw.kill();
  }, [target, duration]);
  return value;
}

export default function SizeCalculator({ onEstimate }) {
  const outRef = useRef(null);
  const popped = useRef(false);
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
  const installedKwp = (numPanels * PANEL_WATTAGE) / 1000; // totoong laki ng mga panel
  const roofArea = numPanels * PANEL_AREA_SQM;

  const dayPercent = 100 - nightPercent;
  const nightlyKwh = dailyKwh * (nightPercent / 100);
  const rawBatteryKwh = nightlyKwh / BATTERY_USABLE_FRACTION;
  const suggestedBatteryKwh = Math.ceil(rawBatteryKwh / BATTERY_STEP_KWH) * BATTERY_STEP_KWH;

  let batteryTier;
  if (nightPercent < 20) {
    batteryTier = {
      label: 'Optional',
      tone: 'low',
      note: 'Most of your usage happens during the day, so solar alone covers the bulk of your load. A battery would mainly be for brownout backup rather than savings.',
    };
  } else if (nightPercent <= 40) {
    batteryTier = {
      label: 'Worth adding',
      tone: 'mid',
      note: 'A meaningful chunk of your usage happens at night. A battery would cut what you still pull from the grid after sunset.',
    };
  } else {
    batteryTier = {
      label: 'Recommended',
      tone: 'high',
      note: 'Most of your usage happens at night, when panels alone generate nothing. We\u2019d strongly recommend pairing this system with a battery.',
    };
  }

  // Animated na numero
  const shownKwp = useTween(hasInput ? installedKwp : 0);
  const shownPanels = useTween(hasInput ? numPanels : 0);
  const shownRoof = useTween(hasInput ? roofArea : 0);
  const shownBattery = useTween(hasInput ? suggestedBatteryKwh : 0);

  // Report the current result up to the quote form so it can be sent along
  // with the customer's request (null when nothing has been entered yet).
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

  // Maliit na "pop" ng result panel pagkatapos ng unang input
  useEffect(() => {
    if (!hasInput || popped.current || reduceMotion()) return;
    popped.current = true;
    const el = outRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll('.cc-pop'),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
    );
  }, [hasInput]);

  // Spotlight na sumusunod sa mouse
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const cells = Math.min(hasInput ? numPanels : 0, MAX_CELLS);
  const extra = hasInput ? Math.max(0, numPanels - MAX_CELLS) : 0;
  const ringFill = hasInput ? Math.min(1, installedKwp / MAX_KWP) : 0;
  const batteryFill = hasInput ? Math.min(1, suggestedBatteryKwh / MAX_BATTERY) : 0;

  return (
    <div className="calc-card">
      <div className="calc-head">
        <div className="eyebrow">QUICK ESTIMATE</div>
        <h3>Not sure what size you need?</h3>
        <p>Enter your electric bill (or your usage in kWh, if you know it) and get an instant ballpark.</p>
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

        {/* Kanan: result panel */}
        <div className={`calc-out ${hasInput ? 'show' : ''}`} ref={outRef} onMouseMove={onMove}>
          <div className="cc-spot" aria-hidden="true" />

          <div className="cc-label cc-pop">Recommended system</div>

          <div className="cc-top cc-pop">
            <div className="cc-ring">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="44" className="cc-ring-bg" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="cc-ring-fg"
                  style={{
                    strokeDasharray: RING,
                    strokeDashoffset: RING * (1 - ringFill),
                  }}
                />
              </svg>
              <div className="cc-ring-text">
                <strong className="mono">{hasInput ? shownKwp.toFixed(1) : '—'}</strong>
                <span>kWp</span>
              </div>
            </div>

            <div className="cc-mini">
              <div>
                <strong className="mono">{hasInput ? Math.round(shownPanels) : '—'}</strong>
                <span>panels ({PANEL_WATTAGE}W each)</span>
              </div>
              <div>
                <strong className="mono">{hasInput ? `${Math.round(shownRoof)} m²` : '—'}</strong>
                <span>roof area needed</span>
              </div>
            </div>
          </div>

          {/* Panel grid */}
          <div className="cc-pop">
            <div className="cc-panels" aria-hidden="true">
              {Array.from({ length: cells }).map((_, i) => (
                <span className="cc-cell" key={i} style={{ '--i': i }} />
              ))}
              {extra > 0 && <span className="cc-more mono">+{extra}</span>}
              {!hasInput &&
                Array.from({ length: 8 }).map((_, i) => <span className="cc-cell ghost" key={`g${i}`} />)}
            </div>
          </div>

          {/* Battery */}
          <div className={`calc-battery-box calc-battery-box--${batteryTier.tone} cc-pop`}>
            <div className="calc-battery-head">
              <span>Battery storage</span>
              <span className="calc-battery-tier">{batteryTier.label}</span>
            </div>
            <div className="cc-battery" aria-hidden="true">
              <span style={{ width: `${batteryFill * 100}%` }} />
            </div>
            {hasInput && (
              <div className="calc-battery-size mono">
                ~{Math.round(shownBattery)} kWh suggested
              </div>
            )}
            <p className="calc-battery-note">{batteryTier.note}</p>
          </div>

          {!hasInput && <p className="cc-hint">Type your bill or usage to see your system appear here.</p>}
        </div>
      </div>

      <p className="calc-note">
        Rough estimate based on {PEAK_SUN_HOURS} peak sun hours/day and typical system losses — we'll
        confirm the exact size during a free site visit.
      </p>
    </div>
  );
}