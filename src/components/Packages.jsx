import './Packages.css';

const PACKAGES = [
  {
    name: '5kW Hybrid System',
    specs: '8 × 550W panels · 4.4 kWp · 10 kWh battery',
    blurb: 'Entry-level hybrid for smaller homes.',
    price: '₱320,000',
    popular: false,
  },
  {
    name: '6kW Hybrid System',
    specs: '10 × 550W panels · 5.5 kWp · 10 kWh battery',
    blurb: 'Our most popular size for Filipino homes.',
    price: '₱365,000',
    popular: true,
  },
  {
    name: '8kW Hybrid System',
    specs: '14 × 550W panels · 7.7 kWp · 10 kWh battery',
    blurb: 'For medium homes running air conditioning.',
    price: '₱452,000',
    popular: false,
  },
  {
    name: '10kW Hybrid System',
    specs: '16 × 550W panels · 8.8 kWp · 16 kWh battery',
    blurb: 'Larger households or small businesses.',
    price: '₱518,000',
    popular: false,
  },
];

const ADDONS = [
  {
    name: 'Extra Battery Module',
    specs: '5.12kWh LiFePO4',
    blurb: 'Add storage for heavier nighttime use.',
    price: 'from ₱95,000',
  },
  {
    name: 'Additional Solar Panels (per pair)',
    specs: '2 × 550W panels, mounting + cable + labor included',
    blurb: 'Add generation capacity to your setup.',
    price: '₱22,000',
  },
];

export default function Packages() {
  return (
    <section id="packages">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">SYSTEM PACKAGES</div>
          <h2>Package pricing</h2>
          <p>
            All-in pricing includes panels, inverter, battery, and installation. Your final quote
            depends on brand availability, add-ons, and a site assessment — use the calculator
            above or request a quote for your exact figure.
          </p>
        </div>

        <div className="package-grid">
          {PACKAGES.map((pkg) => (
            <div className={`package-card ${pkg.popular ? 'popular' : ''}`} key={pkg.name}>
              {pkg.popular && <div className="package-badge">Popular</div>}
              <h3>{pkg.name}</h3>
              <p className="package-specs">{pkg.specs}</p>
              <p className="package-blurb">{pkg.blurb}</p>
              <div className="package-price">
                <span className="package-price-label">All-in installed</span>
                <span className="package-price-num mono">{pkg.price}</span>
              </div>
              <a href="#contact" className="btn btn-primary package-cta">
                Request Quote
              </a>
            </div>
          ))}
        </div>

        <div className="addon-head">
          <h3>Add-ons &amp; upgrades</h3>
        </div>
        <div className="addon-grid">
          {ADDONS.map((addon) => (
            <div className="addon-card" key={addon.name}>
              <div className="addon-info">
                <h4>{addon.name}</h4>
                <p className="package-specs">{addon.specs}</p>
                <p className="package-blurb">{addon.blurb}</p>
              </div>
              <div className="addon-price">
                <span className="package-price-num mono">{addon.price}</span>
                <a href="#contact" className="btn btn-ghost addon-cta">
                  Add to Quote
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="package-note">
          All systems include lifetime after-sales support. Prices shown are placeholders — swap
          in your real package lineup and figures before launch.
        </p>
      </div>
    </section>
  );
}
