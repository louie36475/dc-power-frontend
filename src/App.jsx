import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import FaqPage from './pages/FaqPage';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);
// Para hindi mag-refresh/tumalon ang scroll kapag bumukas ang keyboard sa phone
ScrollTrigger.config({ ignoreMobileResize: true });

const MIN_SHOW_MS = 900; // pinakamaikling oras na makikita ang loader
const MAX_WAIT_MS = 5000; // hindi maghihintay nang higit dito

function ScrollManager({ setCover }) {
  const { pathname, hash, key } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    const cameFromOtherPage = prevPath.current !== pathname;
    prevPath.current = pathname;

    if (hash) {
      // Nasa parehong page na: smooth scroll lang
      if (!cameFromOtherPage) {
        const el = document.querySelector(hash);
        if (el) {
          const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
          return () => clearTimeout(t);
        }
      } else {
        // Galing sa ibang page: takpan ng loader habang nag-a-align
        let cancelled = false;
        const timers = [];
        setCover(true);

        const align = () => {
          if (cancelled) return;
          const el = document.querySelector(hash);
          if (!el) return;
          const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          const top = el.getBoundingClientRect().top + window.scrollY - margin;
          window.scrollTo({ top, behavior: 'instant' });
        };
        const stop = () => { cancelled = true; setCover(false); };

        [60, 250, 600].forEach((ms) => timers.push(setTimeout(align, ms)));
        timers.push(setTimeout(() => setCover(false), 750));
        timers.push(setTimeout(align, 1200));

        window.addEventListener('wheel', stop, { once: true, passive: true });
        window.addEventListener('touchmove', stop, { once: true, passive: true });

        return () => {
          timers.forEach(clearTimeout);
          window.removeEventListener('wheel', stop);
          window.removeEventListener('touchmove', stop);
          setCover(false); // siguraduhing hindi mananatili ang loader
        };
      }
    }

    // Walang hash: umakyat sa taas (kasama ang pag-click sa logo habang nasa Home)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, hash, key, setCover]);

  return null;
}

export default function App() {
  const [booting, setBooting] = useState(true); // unang bukas ng site
  const [cover, setCover] = useState(false); // paglipat ng page papunta sa section

  // Hintayin ang page, fonts, at minimum na oras
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setBooting(false);
    };

    const minTime = new Promise((r) => setTimeout(r, MIN_SHOW_MS));
    const loaded = new Promise((r) => {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', r, { once: true });
    });
    const fonts = document.fonts?.ready ?? Promise.resolve();

    Promise.all([minTime, loaded, fonts]).then(finish);
    const fallback = setTimeout(finish, MAX_WAIT_MS);

    return () => clearTimeout(fallback);
  }, []);

  const visible = booting || cover;

  // Huwag payagang mag-scroll habang nakabukas ang loader
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    if (!visible) {
      // pagkatapos mawala ang loader, i-recalculate ang mga GSAP animation
      const t = setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  return (
    <>
      <Preloader visible={visible} />
      <ScrollManager setCover={setCover} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}