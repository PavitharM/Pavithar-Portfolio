import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Award, Smartphone, Layers } from 'lucide-react';
import './collection-dialog.css';

function collectionItems(tone, projects) {
  if (tone === 'web') return projects;
  if (tone === 'design') return projects.map(project => ({
    ...project,
    name: `${project.name} — Interface`,
    type: 'Interface showcase',
    tags: ['Interface design', 'Web experience'],
  }));
  if (tone === 'mobile') return [
    { name: 'LawLink Mobile', type: 'Mobile application', tags: ['React Native', 'Expo'], repo: 'LawLink_Consulatation', visual: 'phone',
      blurb: 'The mobile side of LawLink connects clients and lawyers to a shared legal consultation service.', sample: false },
    { name: 'Daily Focus', type: 'Sample project', tags: ['App concept', 'Productivity'], visual: 'phone', sample: true,
      blurb: 'A sample mobile concept for organizing daily priorities and tracking small, consistent wins.' },
  ];
  return [
    { name: 'Web Development', type: 'Sample certificate', visual: 'certificate', sample: true, tags: ['Sample', 'Web development'],
      blurb: 'An example of how a web development certificate will appear in this collection. This is a demonstration, not an earned credential.' },
    { name: 'UI/UX Design', type: 'Sample certificate', visual: 'certificate', sample: true, tags: ['Sample', 'Design'],
      blurb: 'An example design certificate layout. Actual certificate details and verification links can be added when available.' },
  ];
}

function ItemVisual({ item }) {
  if (item.image) return <div className={`layer-visual layer-visual--${item.image}`}><img src={`/projects/${item.image}.jpg`} alt={`${item.name} application interface`} loading="lazy"/></div>;
  if (item.visual === 'certificate') return <div className="layer-visual layer-certificate"><div className="certificate-paper">
    <span className="certificate-sample">Sample · Not a credential</span><Award size={36} strokeWidth={1.2} aria-hidden="true"/>
    <span className="certificate-label">Certificate of completion</span><strong>{item.name}</strong><span className="certificate-rule"/><span>Demonstration preview</span>
  </div></div>;
  return <div className="layer-visual layer-mobile"><div className="mobile-preview" aria-hidden="true">
    <span className="mobile-speaker"/><Smartphone size={24} strokeWidth={1.4}/><strong>{item.name}</strong><span>{item.sample ? 'Sample concept' : 'Project overview'}</span>
    <div className="mobile-summary">{item.sample ? 'Make room for what matters.' : 'Legal support, within reach.'}</div><i/><i/><i/>
  </div></div>;
}

export default function CollectionDialog({ collection, projects, onDismiss }) {
  const dialog = useRef(null);
  const viewport = useRef(null);
  const anchors = useRef([]);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const items = collectionItems(collection.tone, projects);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    const element = viewport.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const lastCard = element.querySelector('.work-layer:last-child');
      element.style.setProperty('--stack-tail', `${Math.max(42, element.clientHeight - lastCard.offsetHeight - 30)}px`);
      let index = 0;
      anchors.current.forEach((anchor, i) => {
        if (anchor.offsetTop <= element.scrollTop + element.clientHeight * .45) index = i;
      });
      setActive(index);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    element.addEventListener('scroll', queue, { passive: true });
    const resize = new ResizeObserver(queue);
    resize.observe(element);
    resize.observe(element.querySelector('.work-layer:last-child'));
    update();
    return () => { element.removeEventListener('scroll', queue); resize.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  function goTo(index) {
    viewport.current.scrollTo({ top: anchors.current[index].offsetTop - 16 - index * 14, behavior: reduced ? 'instant' : 'smooth' });
  }
  function backdrop(event) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onDismiss();
  }
  return createPortal(<dialog className="collection-dialog" ref={dialog} aria-labelledby="collection-dialog-title" aria-describedby="collection-dialog-description" onCancel={event => { event.preventDefault(); onDismiss(); }} onClick={backdrop}>
    <header className="collection-dialog-header"><div><span className="collection-dialog-label"><Layers size={15} aria-hidden="true"/>The collection</span><h2 id="collection-dialog-title">{collection.title}</h2><p id="collection-dialog-description">Scroll inside to reveal each piece.</p></div><button type="button" className="collection-close" aria-label="Close collection" onClick={onDismiss} autoFocus><X size={22}/></button></header>
    <div className="layer-viewport" ref={viewport} tabIndex={0} role="region" aria-label={`${collection.title} layered gallery`}>
      <div className="layer-stack">{items.map((item, index) => <Fragment key={item.name}>
        <span className="layer-anchor" ref={node => { anchors.current[index] = node; }} aria-hidden="true"/>
        <article className={`work-layer ${active > index ? 'work-layer--past' : ''}`} style={{ '--layer-index': index }}>
          <div className="work-layer-surface"><ItemVisual item={item}/><div className="layer-details">
            <span className={`layer-type ${item.sample ? 'layer-type--sample' : ''}`}>{item.type}</span><h3>{item.name}</h3><p>{item.blurb}</p>
            <div className="layer-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            {(item.repo || item.live) && <div className="layer-links">{item.repo && <a href={`https://github.com/PavitharM/${item.repo}`} target="_blank" rel="noreferrer">Source code</a>}{item.live && <a href={item.live} target="_blank" rel="noreferrer">Live project</a>}</div>}
          </div></div>
        </article>
        {index < items.length - 1 && <div className="layer-gap" aria-hidden="true"/>}
      </Fragment>)}</div>
    </div>
    <div className="collection-dialog-footer"><span aria-live="polite">{active + 1} / {items.length}<span className="collection-current">{items[active].name}</span></span><div className="layer-controls"><button type="button" aria-label="Previous collection item" disabled={active === 0} onClick={() => goTo(active - 1)}><ChevronUp size={19}/></button><button type="button" aria-label="Next collection item" disabled={active === items.length - 1} onClick={() => goTo(active + 1)}><ChevronDown size={19}/></button></div></div>
  </dialog>, document.body);
}
