import About from '../components/About';
import AboutValues from '../components/AboutValues';
import PageHeader from '../components/PageHeader';
import './pages.css';

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="ABOUT US"
        title="Who we are"
        text="A small, licensed crew installing solar and battery backup systems across the Philippines."
      />
      <About />
      <AboutValues />
    </>
  );
}