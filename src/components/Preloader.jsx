import logo from '../assets/logo/full-logo.png';
import './Preloader.css';

export default function Preloader({ visible }) {
  return (
    <div
      className={`preloader ${visible ? '' : 'hide'}`}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <div className="pl-glow" aria-hidden="true" />
      <div className="pl-center">
        <div className="pl-logo">
          <img src={logo} alt="" width="72" height="72" />
        </div>
        <div className="pl-name">DC Power</div>
        <div className="pl-bar" aria-hidden="true">
          <span />
        </div>
        <div className="pl-text">Powering up…</div>
      </div>
    </div>
  );
}