import Hero from '../components/Hero';
import Showcase from '../components/Showcase';
import Services from '../components/Services';
import Packages from '../components/Packages';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Showcase />
      <Services />
      <Packages />
      <Contact />
    </>
  );
}