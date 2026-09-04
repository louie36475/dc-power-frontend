import { useState } from 'react';
import './SizeCalculator.css';

// Rough planning assumptions for the Philippines — good enough for a
// ballpark estimate. The real number comes from a site visit.
const RATE_PER_KWH = 12; // ₱ per kWh, typical residential rate
const PEAK_SUN_HOURS = 4.5; // average usable sun hours/day, PH-wide
const SYSTEM_DERATE = 0.8; // inverter/wiring/soiling/temperature losses
const PANEL_WATTAGE = 450; // W per panel
const PANEL_AREA_SQM = 2.3; // roof area per panel incl. spacing

export default function SizeCalculator() {
  const [mode, setMode] = useState('bill'); // 'bill' | 'kwh'
  const [bill, setBill] = useState('');
  const [kwh, setKwh] = useState('');

  const billNum = parseFloat(String(bill).replace(/,/g, '')) || 0;
  const kwhNum = parseFloat(String(kwh).replace(/,/g, '')) || 0;

  const monthlyKwh = mode === 'bill' ? billNum / RATE_PER_KWH : kwhNum;
  const hasInput = monthlyKwh > 0;

  const dailyKwh = monthlyKwh / 30;
  const recommendedKwp = dailyKwh / (PEAK_SUN_HOURS * SYSTEM_DERATE);
  const numPanels = Math.ceil((recommendedKwp * 1000) / PANEL_WATTAGE);
  const roofArea = numPanels * PANEL_AREA_SQM;

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
        <p className="calc-note">
          Rough estimate based on {PEAK_SUN_HOURS} peak sun hours/day and typical system losses — we'll
          confirm the exact size during a free site visit.
        </p>
      </div>
    </div>
  );
}
