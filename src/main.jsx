import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, ArrowDown, Globe2, Scale } from 'lucide-react';
import Navigation, { MagneticLink } from './Navigation';
import Portrait from './Portrait';
import Sections from './Sections';
import './style.css';
import './hero.css';

function Hero() {
  const hero = useRef(null);
  const reduced = useReducedMotion();
  return <section className="hero" id="home" ref={hero} aria-labelledby="hero-name">
    <div className="atmosphere" aria-hidden="true"/>
    <svg className="profession" viewBox="0 0 1400 195" preserveAspectRatio="none" role="img" aria-label="Software Engineer">
      <defs><linearGradient id="headline-mist" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#fbfdff" stopOpacity=".85"/>
        <stop offset="53%" stopColor="#f1faff" stopOpacity=".47"/>
        <stop offset="100%" stopColor="#e8f6ff" stopOpacity=".03"/>
      </linearGradient></defs>
      <text x="700" y="180" textAnchor="middle" textLength="1390" lengthAdjust="spacingAndGlyphs" fill="url(#headline-mist)">SOFTWARE ENGINEER</text>
    </svg>
    <Portrait hero={hero} reduced={reduced}/>
    <div className="portrait-soft" aria-hidden="true"/>
    <div className="portrait-light" aria-hidden="true"/>
    <div className="hero-intro">
      <p className="intro-label">Hello, I’m Pavithar</p>
      <h1 id="hero-name">PAVITHAR M</h1>
      <p className="hero-description">Software Engineer crafting thoughtful digital experiences through code, creativity, and modern technology.</p>
      <div className="hero-actions">
        <MagneticLink className="primary" href="#projects">Explore My Work <span><ChevronRight size={18}/></span></MagneticLink>
        <MagneticLink className="secondary" href="#contact">Let’s Connect</MagneticLink>
      </div>
    </div>
    <a href="#projects" className="feature-card" aria-label="Explore featured project LawLink">
      <span className="feature-crest" aria-hidden="true"><span className="glass-emblem"><Scale size={28} strokeWidth={1.4}/></span></span>
      <span className="feature-body"><span className="card-label">Featured project</span>
        <span className="card-arrow"><ArrowUpRight size={17}/></span>
        <strong>LawLink</strong><span className="card-caption">Legal consultations<br/>for Sri Lanka</span>
      </span>
    </a>
    <a className="scroll-down" href="#about"><ArrowDown size={14}/> Scroll to explore</a>
  </section>;
}

function App() {
  return <MotionConfig reducedMotion="user"><Navigation/><main id="main"><Hero/><Sections/></main></MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App/>);
