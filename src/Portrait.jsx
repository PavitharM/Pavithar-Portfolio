import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);
const total = 11;
const replayInterval = 4000;
const frameUrl = (index, width) => `/portrait/frame-${String(index + 1).padStart(2, '0')}-${width}.webp`;

export default function Portrait({ hero, reduced }) {
  const canvas = useRef(null);
  const player = useRef(null);
  const loopPaused = useRef(false);
  const [paused, setPaused] = useState(false);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  function toggleLoop() {
    loopPaused.current = !loopPaused.current;
    setPaused(loopPaused.current);
    player.current?.sync();
  }

  useEffect(() => {
    const surface = canvas.current;
    const ctx = surface.getContext('2d');
    if (!ctx) return;
    const size = window.matchMedia('(max-width: 700px)').matches ? 500 : 900;
    const cache = new Map();
    let live = true, ticket = 0, playback = 0, drawn = -1;
    let frameTimer, loopTimer, inView = false;
    const canLoop = () => inView && !document.hidden && !reduced && !loopPaused.current;
    const get = index => {
      if (cache.has(index)) return cache.get(index);
      const image = new Image();
      image.decoding = 'async';
      image.src = frameUrl(index, size);
      const decoded = image.decode().then(() => image);
      cache.set(index, decoded);
      if (cache.size > 5) cache.delete(cache.keys().next().value);
      return decoded;
    };
    const show = async index => {
      const stamp = ++ticket;
      try {
        const image = await get(index);
        if (!live || ticket !== stamp) return;
        if (drawn !== index) {
          if (surface.width !== image.width || surface.height !== image.height) {
            surface.width = image.width;
            surface.height = image.height;
          }
          ctx.clearRect(0, 0, surface.width, surface.height);
          ctx.drawImage(image, 0, 0);
          drawn = index;
          setFrame(index);
          hero.current?.style.setProperty('--frame-mask', `url("${image.src}")`);
          setReady(true);
        }
        if (!reduced && index < total - 1) get(index + 1).catch(() => {});
      } catch { cache.delete(index); }
    };
    function stop() {
      playback++;
      ticket++;
      clearTimeout(frameTimer);
      clearTimeout(loopTimer);
      setPlaying(false);
    }
    function schedule(delay) {
      clearTimeout(loopTimer);
      if (canLoop()) loopTimer = window.setTimeout(play, delay);
    }
    function play() {
      stop();
      if (document.hidden || !inView) return;
      setPlaying(true);
      const run = playback;
      const started = performance.now();
      let index = 0;
      async function advance() {
        await show(index);
        if (!live || run !== playback) return;
        if (++index < total) {
          frameTimer = window.setTimeout(advance, 105);
        } else {
          setPlaying(false);
          schedule(Math.max(0, replayInterval - (performance.now() - started)));
        }
      }
      advance();
    }
    function sync() {
      stop();
      if (drawn < 0) show(0);
      schedule(400);
    }
    player.current = { play, sync };
    show(0);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(hero.current);
    document.addEventListener('visibilitychange', sync);
    const trigger = reduced ? null : ScrollTrigger.create({
      trigger: hero.current, start: 'top top', end: 'bottom 10%',
      onUpdate: self => {
        if (!inView || document.hidden || loopPaused.current) return;
        stop();
        show(Math.round((1 - self.progress) * (total - 1)));
        schedule(replayInterval);
      },
    });
    return () => {
      live = false;
      clearTimeout(frameTimer);
      clearTimeout(loopTimer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      trigger?.kill();
      player.current = null;
      cache.clear();
    };
  }, [hero, reduced]);

  return <>
    <div className="portrait-layer">
      <img className="portrait-fallback" src={frameUrl(0, 900)} srcSet={`${frameUrl(0,500)} 500w, ${frameUrl(0,900)} 900w`} sizes="(max-width: 700px) 68vw, 42vw" alt="Pavithar M wearing a black jacket and white shirt" fetchPriority="high" style={{opacity: ready ? 0 : 1}}/>
      <canvas ref={canvas} aria-hidden="true"/>
    </div>
    <div className="portrait-control glass-card">
      <button className="portrait-replay" type="button" onClick={() => player.current?.play()}
        disabled={!ready || playing} aria-label="Replay portrait sequence">
      <span className="card-label">Motion portrait</span>
      {reduced && <span className="card-arrow"><RotateCcw size={15}/></span>}
      <span className="motion-content">
        <span className="portrait-stamps" aria-hidden="true">
          {[0,5,10].map(index => <span key={index} style={{backgroundImage:`url(${frameUrl(index,500)})`}}/>)}
        </span>
        <span className="motion-caption"><strong>{playing ? 'Playing' : 'Replay'}</strong>
          <span className="card-caption frame-count">Frame {String(frame + 1).padStart(2,'0')} / 11</span>
        </span>
      </span>
      </button>
      {!reduced && <button className="loop-switch" type="button" onClick={toggleLoop}
        aria-label={paused ? 'Resume automatic portrait playback' : 'Pause automatic portrait playback'}
        title={paused ? 'Resume automatic playback' : 'Pause automatic playback'}>
        {paused ? <Play size={14}/> : <Pause size={14}/>}
      </button>}
    </div>
  </>;
}
