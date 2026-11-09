import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { House, UserRound, Layers3, FolderOpen, BriefcaseBusiness, Mail, Sun, Moon, ArrowUpRight } from 'lucide-react';

const links = [
  ['home', 'Home', House], ['about', 'About', UserRound], ['skills', 'Skills', Layers3],
  ['projects', 'Projects', FolderOpen], ['experience', 'Experience', BriefcaseBusiness], ['contact', 'Contact', Mail],
];

export function MagneticLink({ children, className, ...props }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const spring = { stiffness: 290, damping: 23, mass: .4 };
  const tx = useSpring(x, spring), ty = useSpring(y, spring);
  return <motion.a {...props} className={className} style={{x:tx,y:ty}} whileHover={reduced ? undefined : {scale:1.025}}
    onPointerMove={e => {
      if (reduced || e.pointerType !== 'mouse') return;
      const box = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - box.left - box.width / 2) * .11);
      y.set((e.clientY - box.top - box.height / 2) * .17);
    }} onPointerLeave={() => { x.set(0); y.set(0); }}>{children}</motion.a>;
}

export default function Navigation() {
  const [section,setSection] = useState('home');
  const [scrolled,setScrolled] = useState(false);
  const [theme,setTheme] = useState(document.documentElement.dataset.theme);
  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => { let saved; try { saved=localStorage.getItem('pm-theme'); } catch {} if (!saved) setTheme(system.matches?'dark':'light'); };
    system.addEventListener('change',sync);
    return () => system.removeEventListener('change',sync);
  },[]);
  useEffect(() => {
    document.documentElement.dataset.theme=theme;
    document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#0b1826':'#eaf4fb';
  },[theme]);
  useEffect(() => {
    const sections = links.map(([id]) => document.getElementById(id));
    let raf = 0;
    function update() {
      raf = 0;
      const current = sections.filter(s => s && s.getBoundingClientRect().top <= innerHeight * .46).at(-1);
      setSection(innerHeight + scrollY >= document.documentElement.scrollHeight-3 ? 'contact' : current?.id || 'home');
      setScrolled(scrollY > 28);
    }
    const schedule = () => { if (!raf) raf=requestAnimationFrame(update); };
    update(); window.addEventListener('scroll',schedule,{passive:true}); window.addEventListener('resize',schedule);
    return () => { cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule); };
  },[]);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); try { localStorage.setItem('pm-theme',next); } catch {}
  }
  return <>
    <a href="#main" className="skip">Skip to content</a>
    <header className={scrolled?'header scrolled':'header'}>
      <div className="brand-group"><a href="#home" className="brand" aria-label="Pavithar M, home">PM<span>.</span></a><span className="brand-caption micro">Personal portfolio</span></div>
      <div className="header-actions"><span className="available"><i/>Open to connect</span>
        <button className="theme-switch" onClick={toggle} aria-label={`Switch to ${theme==='light'?'dark':'light'} theme`}><Sun size={15} className={theme==='light'?'selected':''}/><Moon size={15} className={theme==='dark'?'selected':''}/></button>
        <a className="header-contact" href="#contact">Contact <ArrowUpRight size={15}/></a>
      </div>
    </header>
    <nav className="dock" aria-label="Portfolio sections">{links.map(([id,label,Icon]) =>
      <MagneticLink href={'#'+id} key={id} aria-label={label} aria-current={section===id?'location':undefined} className={'dock-item '+(section===id?'active':'')}>
        {section===id && <motion.span layoutId="nav-current" className="nav-current" transition={{type:'spring',stiffness:350,damping:32}}/>}
        <Icon size={18} strokeWidth={1.65}/><span className="tooltip">{label}</span>
      </MagneticLink>)}</nav>
  </>;
}
