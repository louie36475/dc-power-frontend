import { useEffect, useMemo, useState } from 'react';
import { PACKAGES } from '../data/packages';
import './BuildPicker.css';

// ===================== EDIT THESE =====================
const PANEL_WATTAGE = 600;
const PANEL_PRICE = 7000; // ₱ bawat panel
const PANEL_AREA_SQM = 2.7;
// kwh = 51.2V x Ah / 1000. Ilagay ang price kapag alam mo na (null = "price on quote")
const BATTERIES = [
  { ah: 100, kwh: 5.12, price: null },
  { ah: 200, kwh: 10.24, price: null },
  { ah: 314, kwh: 16.08, price: null },
];
// Parehong assumptions ng calculator
const PEAK_SUN_HOURS = 4.5;
const SYSTEM_DERATE = 0.8;
const BATTERY_USABLE_FRACTION = 0.9;
const BATTERY_STEP_KWH = 5;
const MAX_PANELS = 60;
const MAX_PER_BATTERY = 8;
// ======================================================

const fmt = (n) => '₱' + Math.round(n).toLocaleString('en-PH');
const countOf = (p) => p.panelCount ?? (parseInt(p.panels, 10) || 0);

function Stepper({ value, onChange, max, label }) {
  return (
    <div className="bp-step" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Less ${label}`}>−</button>
      <span className="mono">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`More ${label}`}>+</button>
    </div>
  );
}

export default function BuildPicker({ estimate, onChange }) {
  const [mode, setMode] = useState('package'); // 'package' | 'custom'
  const [pkgId, setPkgId] = useState(PACKAGES[0].id);
  const [extraStr, setExtraStr] = useState('');
  const [panelQty, setPanelQty] = useState(0);
  const [touched, setTouched] = useState(false);
  const [batt, setBatt] = useState({ 100: 0, 200: 0, 314: 0 });

  const extra = Math.max(0, parseFloat(String(extraStr).replace(/,/g, '')) || 0);

  // Target base sa calculator + dagdag na appliances
  const target = useMemo(() => {
    if (!estimate) return null;
    const monthly = estimate.monthlyKwh + extra;
    const daily = monthly / 30;
    const panels = Math.ceil(((daily / (PEAK_SUN_HOURS * SYSTEM_DERATE)) * 1000) / PANEL_WATTAGE);
    const battery =
      Math.ceil((daily * (estimate.nightPercent / 100)) / BATTERY_USABLE_FRACTION / BATTERY_STEP_KWH) *
      BATTERY_STEP_KWH;
    return { panels, battery };
  }, [estimate, extra]);

  // Default ng custom panels = target, hangga't hindi pa ginagalaw ng customer
  useEffect(() => {
    if (target && !touched) setPanelQty(Math.min(MAX_PANELS, target.panels));
  }, [target, touched]);

  const pkg = PACKAGES.find((p) => p.id === pkgId) || PACKAGES[0];

  // Kinukuwenta ang piniling setup
  const view = useMemo(() => {
    let panels, batteryKwh, total, unpriced = false, lines = [];

    if (mode === 'package') {
      panels = countOf(pkg);
      batteryKwh = pkg.battery || 0;
      total = pkg.price;
      lines = [`${pkg.name} (${pkg.panels}, ${pkg.kwp}, ${pkg.battery ? pkg.battery + ' kWh battery' : 'no battery'})`];
    } else {
      panels = panelQty;
      batteryKwh = 0;
      total = panelQty * PANEL_PRICE;
      lines = [`${panelQty} x ${PANEL_WATTAGE}W panels = ${fmt(panelQty * PANEL_PRICE)}`];
      BATTERIES.forEach((b) => {
        const q = batt[b.ah];
        if (!q) return;
        batteryKwh += q * b.kwh;
        if (b.price == null) unpriced = true;
        else total += q * b.price;
        lines.push(`${q} x ${b.ah}Ah battery (51.2V, ${(q * b.kwh).toFixed(2)} kWh)`);
      });
    }

    // Mga babala (hindi hinaharang ang pinili)
    const warnings = [];
    if (target) {
      if (panels < target.panels) {
        warnings.push(`Mas kaunti sa kailangan mo: mga ${target.panels} panels ang estimate, ${panels} lang ang pinili. Maaaring may bayarin ka pa rin sa grid.`);
      } else if (panels > target.panels + 2) {
        warnings.push(`Mas malaki kaysa kailangan mo ngayon (${target.panels} panels). Okay ito kung magdadagdag ka ng appliances.`);
      }
      const wantsBattery = estimate.nightPercent >= 20;
      if (wantsBattery && batteryKwh < target.battery * 0.8) {
        warnings.push(`Maliit ang battery para sa gabi: mga ${target.battery} kWh ang suggested, ${batteryKwh.toFixed(1)} kWh ang pinili.`);
      } else if (batteryKwh > target.battery * 1.5 && batteryKwh > 0) {
        warnings.push(`Mas malaki ang battery (${batteryKwh.toFixed(1)} kWh) kaysa suggested (mga ${target.battery} kWh).`);
      }
    }
    return { panels, batteryKwh, total, unpriced, lines, warnings };
  }, [mode, pkg, panelQty, batt, target, estimate]);

  // Ipasa sa Contact form (para sa email)
  const key = JSON.stringify([mode, view.lines, view.total, view.unpriced, view.warnings, extra]);
  useEffect(() => {
    onChange?.({
      mode: mode === 'package' ? 'Ready-made package' : 'Custom build',
      details: view.lines.join(' | '),
      total: view.total,
      unpriced: view.unpriced,
      warnings: view.warnings,
      extraKwh: extra,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setBattQty = (ah, q) => setBatt((b) => ({ ...b, [ah]: q }));

  return (
    <div className="bp">
      <div className="bp-title">What would you like?</div>

      <div className="bp-tabs" role="tablist" aria-label="Choose how to build">
        <button type="button" role="tab" aria-selected={mode === 'package'} className={mode === 'package' ? 'active' : ''} onClick={() => setMode('package')}>
          Pick a package
        </button>
        <button type="button" role="tab" aria-selected={mode === 'custom'} className={mode === 'custom' ? 'active' : ''} onClick={() => setMode('custom')}>
          Custom build
        </button>
      </div>

      {estimate ? (
        <p className="bp-est">
          Your estimate: about <b>{estimate.panels} panels</b> ({estimate.kwp} kWp)
          {estimate.batteryKwh ? <> and <b>~{estimate.batteryKwh} kWh</b> battery</> : null}.
        </p>
      ) : (
        <p className="bp-est">Tip: fill in the calculator above first so we can check your choice against your usage.</p>
      )}

      {/* Future appliances */}
      <div className="bp-field">
        <label htmlFor="bp-extra">Planning to add appliances later? (extra kWh per month)</label>
        <input
          id="bp-extra"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 150 (aircon, EV charger...)"
          value={extraStr}
          onChange={(e) => setExtraStr(e.target.value)}
        />
        {extra > 0 && target && (
          <small>Updated target: about {target.panels} panels and {target.battery} kWh battery.</small>
        )}
      </div>

      {mode === 'package' ? (
        <div className="bp-field">
          <label htmlFor="bp-pkg">Package</label>
          <select id="bp-pkg" value={pkgId} onChange={(e) => setPkgId(e.target.value)}>
            {PACKAGES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {fmt(p.price)}
              </option>
            ))}
          </select>
          <small>{pkg.panels} · {pkg.kwp} · {pkg.battery ? `${pkg.battery} kWh battery` : 'no battery'}</small>
        </div>
      ) : (
        <div className="bp-custom">
          <div className="bp-row">
            <div>
              <strong>{PANEL_WATTAGE}W solar panels</strong>
              <small>{fmt(PANEL_PRICE)} each · about {Math.round(panelQty * PANEL_AREA_SQM)} m² of roof</small>
            </div>
            <Stepper value={panelQty} max={MAX_PANELS} label="panels" onChange={(v) => { setTouched(true); setPanelQty(v); }} />
          </div>

          {BATTERIES.map((b) => (
            <div className="bp-row" key={b.ah}>
              <div>
                <strong>{b.ah}Ah battery</strong>
                <small>
                  51.2V · {b.kwh} kWh · {b.price == null ? 'price on quote' : `${fmt(b.price)} each`}
                </small>
              </div>
              <Stepper value={batt[b.ah]} max={MAX_PER_BATTERY} label={`${b.ah}Ah batteries`} onChange={(v) => setBattQty(b.ah, v)} />
            </div>
          ))}
        </div>
      )}

      {view.warnings.length > 0 && (
        <ul className="bp-warn" role="status">
          {view.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <div className="bp-total">
        <span>Estimated total{mode === 'custom' && view.unpriced ? ' (without batteries)' : ''}</span>
        <strong className="mono">{fmt(view.total)}</strong>
      </div>
      <p className="bp-fine">
        {mode === 'custom' && view.unpriced && 'Battery price will be confirmed in your quote. '}
        {mode === 'custom' && 'Inverter and installation are quoted separately. '}
        You can change this anytime. We confirm everything during the free site visit.
      </p>
    </div>
  );
}