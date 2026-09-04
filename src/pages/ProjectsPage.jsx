import Gallery from '../components/Gallery';
import './pages.css';

export default function ProjectsPage() {
  return (
    <>
      <div className="page-header">
        <div className="wrap">
          <div className="eyebrow">OUR PROJECTS</div>
          <h1>Recent installations</h1>
          <p>A sample of systems we've put up across Luzon.</p>
        </div>
      </div>
      <Gallery />
    </>
  );
}
