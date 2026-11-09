import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);
const total = 11;
const frameUrl = (index, width) => `/portrait/frame-${String(index + 1).padStart(2, '0')}-${width}.webp`;

export default function Portrait({ hero, reduced }) {
  const canvas = useRef(null);
  const player = useRef(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const replay = useCallback(() => player.current?.(), []);

  useEffect(() => {
    const surface = canvas.current;
    const ctx = surface.getContext('2d');
    if (!ctx) return;
    const size = window.matchMedia('(max-width: 700px)').matches ? 500 : 900;
    const cache = new Map();
    let live = true, ticket = 0, playback = 0, timer, drawn = -1;
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
    const stop = () => { playback++; window.clearTimeout(timer); if (live) setPlaying(false); };
    const play = () => {
      stop();
      setPlaying(true);
      const run = playback;
      let i = 0;
      const advance = async () => {
        await show(i);
        if (!live || run !== playback) return;
        if (++i < total) timer = window.setTimeout(advance, 105);
        else setPlaying(false);
      };
      advance();
    };
    player.current = play;
    show(0);
    if (!reduced && window.scrollY < 5) timer = window.setTimeout(play, 560);
    const trigger = reduced ? null : ScrollTrigger.create({
      trigger: hero.current, start: 'top top', end: 'bottom 10%',
      onUpdate: self => {
        stop();
        show(Math.round((1 - self.progress) * (total - 1)));
      },
    });
    return () => { live = false; ++ticket; clearTimeout(timer); trigger?.kill(); player.current = null; cache.clear(); };
  }, [hero, reduced]);

  return <>
    <div className="portrait-layer">
      <img className="portrait-fallback" src={frameUrl(0, 900)} srcSet={`${frameUrl(0,500)} 500w, ${frameUrl(0,900)} 900w`} sizes="(max-width: 700px) 68vw, 42vw" alt="Pavithar M wearing a black jacket and white shirt" fetchPriority="high" style={{opacity: ready ? 0 : 1}}/>
      <canvas ref={canvas} aria-hidden="true"/>
    </div>
    <button className="portrait-control glass-card" type="button" onClick={replay}
      disabled={!ready || playing} aria-label="Replay portrait sequence">
      <span className="card-label">Motion portrait</span>
      <span className="card-arrow">{frame === 0 ? <Play size={15}/> : <RotateCcw size={15}/>}</span>
      <span className="motion-content">
        <span className="portrait-stamps" aria-hidden="true">
          {[0,5,10].map(index => <span key={index} style={{backgroundImage:`url(${frameUrl(index,500)})`}}/>)}
        </span>
        <span className="motion-caption"><strong>{playing ? 'Playing' : 'Replay'}</strong>
          <span className="card-caption frame-count">Frame {String(frame + 1).padStart(2,'0')} / 11</span>
        </span>
      </span>
    </button>
  </>;
}
