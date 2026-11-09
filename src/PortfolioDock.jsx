import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { House, UserRound, Layers3, FolderOpen, BriefcaseBusiness, Mail } from 'lucide-react';

const sections = [
  ['home', 'Home', House], ['about', 'About', UserRound], ['skills', 'Skills', Layers3],
  ['projects', 'Projects', FolderOpen], ['experience', 'Experience', BriefcaseBusiness], ['contact', 'Contact', Mail],
];
const spring = { type: 'spring', stiffness: 390, damping: 24, mass: .55 };

export default function PortfolioDock() {
  const [section, setSection] = useState('home');
  const [point, setPoint] = useState(null);
  const [horizontal, setHorizontal] = useState(() => matchMedia('(max-width: 700px)').matches);
  const release = useRef();
  const reduced = useReducedMotion();

  useEffect(() => {
    const media = matchMedia('(max-width: 700px)');
    const elements = sections.map(([id]) => document.getElementById(id));
    let frame;
    function update() {
      frame = 0;
      setHorizontal(media.matches);
      const current = elements.filter(el => el?.getBoundingClientRect().top <= innerHeight * .46).at(-1);
      const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 3;
      setSection(atEnd ? 'contact' : current?.id || 'home');
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      clearTimeout(release.current);
    };
  }, []);

  function track(event) {
    clearTimeout(release.current);
    const [first, second] = event.currentTarget.children;
    const a = first.getBoundingClientRect(), b = second.getBoundingClientRect();
    // Measure fixed hit targets, so growing icons cannot move the pointer's reference point.
    const distance = horizontal ? event.clientX - a.left - a.width / 2 : event.clientY - a.top - a.height / 2;
    const pitch = horizontal ? b.left - a.left : b.top - a.top;
    setPoint(Math.max(0, Math.min(sections.length - 1, distance / pitch)));
  }
  function settle(event) {
    if (event.pointerType === 'mouse') return;
    clearTimeout(release.current);
    release.current = setTimeout(() => setPoint(null), 260);
  }
  return createPortal(<nav className="dock" aria-label="Portfolio sections"
    onPointerDown={track} onPointerMove={track} onPointerUp={settle}
    onPointerCancel={() => setPoint(null)}
    onPointerLeave={event => { if (event.pointerType === 'mouse') setPoint(null); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPoint(null); }}>
    {sections.map(([id, label, Icon], index) => {
      const distance = point === null ? Infinity : Math.abs(index - point);
      const weight = reduced ? 0 : Math.exp(-1.3 * distance * distance);
      const spread = point === null || reduced ? 0 : Math.sign(index - point) * Math.min(distance, 1) * Math.exp(-distance / 2) * 9;
      const lift = weight * 10;
      const active = section === id;
      return <a key={id} className={'dock-item' + (active ? ' active' : '')}
        href={'#' + id} aria-label={label} aria-current={active ? 'location' : undefined}
        onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setPoint(index); }}>
        <motion.span className="dock-face" animate={{
          scale: 1 + weight * .45,
          x: horizontal ? spread : lift, y: horizontal ? -lift : spread,
        }} transition={reduced ? {duration: 0} : spring}>
          {active && <motion.span className="nav-current" layoutId="nav-current" transition={spring}/>}
          <Icon size={24} strokeWidth={1.75}/>
        </motion.span>
        <span className="tooltip">{label}</span>
      </a>;
    })}
  </nav>, document.body);
}
