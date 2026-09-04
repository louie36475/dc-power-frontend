import About from '../components/About';
import './pages.css';

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <div className="wrap">
          <div className="eyebrow">ABOUT US</div>
          <h1>Who we are</h1>
          <p>A small, licensed crew installing solar and battery backup systems across the Philippines.</p>
        </div>
      </div>
      <About />
    </>
  );
}
