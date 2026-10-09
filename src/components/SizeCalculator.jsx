import { useState, useEffect } from 'react';
import './SizeCalculator.css';

// Rough planning assumptions for the Philippines — good enough for a
// ballpark estimate. The real number comes from a site visit.
const RATE_PER_KWH = 12; // ₱ per kWh, typical residential rate
const PEAK_SUN_HOURS = 4.5; // average usable sun hours/day, PH-wide
const SYSTEM_DERATE = 0.8; // inverter/wiring/soiling/temperature losses
const PANEL_WATTAGE = 450; // W per panel
const PANEL_AREA_SQM = 2.3; // roof area per panel incl. spacing
const BATTERY_USABLE_FRACTION = 0.9; // usable depth-of-discharge, LiFePO4
const BATTERY_STEP_KWH = 5; // round suggested battery size to this step

export default function SizeCalculator({ onEstimate }) {
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
      kwp: Number(recommendedKwp.toFixed(1)),
      panels: numPanels,
      roofArea: Math.round(roofArea),
      nightPercent,
      dayPercent,
      batteryLabel: batteryTier.label,
      batteryKwh: suggestedBatteryKwh,
    });
  }, [mode, billNum, kwhNum, nightPercent, onEstimate]);

  return (
    <div className="calc-card">
      <div className="calc-head">
        <div className="eyebrow">QUICK ESTIMATE</div>
        <h3>Not sure what size you need?</h3>
        <p>Enter your electric bill (or your usage in kWh, if you know it) and get an instant ballpark.</p>
      </div>

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
          <span><span className="calc-split-dot calc-split-dot--day" />Day — {dayPercent}%</span>
          <span><span className="calc-split-dot calc-split-dot--night" />Night — {nightPercent}%</span>
        </div>
      </div>

      <div className={`calc-result ${hasInput ? 'show' : ''}`}>
        <div className="calc-result-main">
          <span className="calc-result-num mono">{hasInput ? recommendedKwp.toFixed(1) : '—'}</span>
          <span className="calc-result-unit">kWp recommended</span>
        </div>
        <div className="calc-result-grid">
          <div>
            <span className="calc-result-sub mono">{hasInput ? numPanels : '—'}</span>
            <span className="calc-result-label">panels (450W each)</span>
          </div>
          <div>
            <span className="calc-result-sub mono">{hasInput ? `${roofArea.toFixed(0)} m²` : '—'}</span>
            <span className="calc-result-label">roof area needed</span>
          </div>
        </div>

        <div className={`calc-battery-box calc-battery-box--${batteryTier.tone}`}>
          <div className="calc-battery-head">
            <span>Battery storage</span>
            <span className="calc-battery-tier">{batteryTier.label}</span>
          </div>
          {hasInput && (
            <div className="calc-battery-size mono">
              ~{suggestedBatteryKwh} kWh suggested
            </div>
          )}
          <p className="calc-battery-note">{batteryTier.note}</p>
        </div>

        <p className="calc-note">
          Rough estimate based on {PEAK_SUN_HOURS} peak sun hours/day and typical system losses — we'll
          confirm the exact size during a free site visit.
        </p>
      </div>
    </div>
  );
}