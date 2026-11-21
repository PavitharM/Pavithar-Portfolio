import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import CollectionDialog from './CollectionDialog';
import { ArrowUpRight, ArrowUp, Atom, Braces, Smartphone, Database, Terminal, Mail, Copy, Check, Code2, MapPin, UserRound, GraduationCap, HeartHandshake, Sparkles, PenTool, PanelsTopLeft, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const github = 'https://github.com/PavitharM';
const email = 'pavitharmangaleswaran@gmail.com';
const work = [
  {name:'LawLink', type:'Legal technology',blurb:'A legal consultation platform for Sri Lanka. Clients can find a lawyer, submit a complaint, and follow their case across web and mobile.',tags:['React','Express','Expo','MySQL'],repo:'LawLink_Consulatation',live:'https://law-link-consulatation.vercel.app',image:'lawlink'},
  {name:'SplitCalc',type:'Personal finance',blurb:'An expense calculator for friends. Add people and transactions, then see how shared costs settle as the numbers change.',tags:['React','JavaScript','Vite'],repo:'SplitCalc_Calculator',live:'https://split-calc-calculator.vercel.app',image:'splitcalc'},
];
const skills = [
  [Atom,'Frontend development','React · JavaScript · Tailwind CSS'],
  [Braces,'Backend development','Node.js · Express · Flask'],
  [Smartphone,'Mobile development','React Native · Expo Router'],
  [Database,'Databases','MySQL · SQLite · Prisma'],
  [Terminal,'Development tools','Git · GitHub · Vite · VS Code'],
];
const journey = [
  ['Present','Software engineering undergraduate','Sabaragamuwa University of Sri Lanka','Studying software engineering with a focus on web development, databases, and problem solving.'],
  ['July 2026','Web and mobile engineering','LawLink','Connected client, lawyer, and administrator workflows to a shared API across a React web app and an Expo mobile app.'],
  ['April 2026','Attendance tracking','Tuto Tracker','Built a QR attendance workflow with student records, a scanning interface, and attendance reports.'],
];
function Reveal({children,className=''}) {
  const reduced=useReducedMotion();
  return <motion.div className={className} initial={reduced?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:.48,ease:'easeOut'}}>{children}</motion.div>;
}
function Label({children}) {return <div className="eyebrow"><i/>{children}</div>;}
const collections = [
  {title:'Design Projects', label:'Visual thinking', Icon:PenTool, tone:'design'},
  {title:'Web Development', label:'Built for the browser', Icon:PanelsTopLeft, tone:'web'},
  {title:'Mobile App Development', label:'Experiences on the go', Icon:Smartphone, tone:'mobile'},
  {title:'Certifications', label:'Learning & credentials', Icon:Award, tone:'certifications'},
];
function SkillCollections() {
  const track=useRef(null);
  const current=useRef(1);
  const reduced=useReducedMotion();
  const [active,setActive]=useState(1);
  const [opened,setOpened]=useState(null);
  function select(index,behavior=reduced?'instant':'smooth') {
    const element=track.current;
    const card=element.children[index];
    element.scrollTo({left:card.offsetLeft+card.offsetWidth/2-element.clientWidth/2,behavior});
  }
  useEffect(()=>{
    const element=track.current;
    const native=CSS.supports('animation-timeline: view(inline)');
    let frame=0;
    const update=()=>{
      frame=0;
      const center=element.scrollLeft+element.clientWidth/2;
      let nearest=0, distance=Infinity;
      Array.from(element.children).forEach((card,index)=>{
        const delta=card.offsetLeft+card.offsetWidth/2-center;
        if(Math.abs(delta)<distance){distance=Math.abs(delta);nearest=index;}
        if(!native && !reduced){
          const position=Math.max(-1,Math.min(1,delta/(card.offsetWidth*.8)));
          card.style.zIndex=String(Math.round(100-Math.abs(position)*90));
          card.firstElementChild.style.transform=`rotateY(${-position*50}deg) scale(${1-Math.abs(position)*.18})`;
        } else {
          card.style.removeProperty('z-index');
          card.firstElementChild.style.removeProperty('transform');
        }
      });
      current.current=nearest;
      setActive(nearest);
    };
    const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const resize=new ResizeObserver(()=>{
      const card=element.children[current.current];
      element.scrollTo({left:card.offsetLeft+card.offsetWidth/2-element.clientWidth/2,behavior:'instant'});
      queue();
    });
    resize.observe(element);
    element.addEventListener('scroll',queue,{passive:true});
    return ()=>{resize.disconnect();element.removeEventListener('scroll',queue);cancelAnimationFrame(frame);};
  },[reduced]);
  function keyboard(event) {
    const index=event.key==='ArrowRight'?Math.min(3,active+1):event.key==='ArrowLeft'?Math.max(0,active-1):event.key==='Home'?0:event.key==='End'?3:null;
    if(index!==null){event.preventDefault();select(index);}
  }
  return <div className="skill-collections">
    <div className="collection-heading"><h3>Craft. Build. <em>Grow.</em></h3><div className="collection-controls">
      <button type="button" onClick={()=>select(active-1)} disabled={active===0} aria-label="Previous skill card" aria-controls="skill-collection-track"><ChevronLeft size={20}/></button>
      <button type="button" onClick={()=>select(active+1)} disabled={active===3} aria-label="Next skill card" aria-controls="skill-collection-track"><ChevronRight size={20}/></button>
    </div></div>
    <div className="collection-track" id="skill-collection-track" ref={track} tabIndex={0} onKeyDown={keyboard} role="region" aria-roledescription="carousel" aria-label="Project categories and certifications">
      {collections.map(({title,label,Icon,tone},index)=><div className="collection-cover" key={title}>
        <article className={`collection-card collection-card--${tone}`}>
          <div className="collection-art" aria-hidden="true"><span className="collection-orbit"/><span className="collection-symbol"><Icon strokeWidth={1.1}/></span></div>
          <div className="collection-caption"><p>{label}</p><h4>{title}</h4><span className="collection-open-label">Open collection</span></div>
          <button className="collection-select" type="button" onClick={()=>{select(index);setOpened(index);}} aria-label={`Open ${title}`} aria-haspopup="dialog"/>
        </article>
      </div>)}
    </div>
    <div className="collection-footer"><p className="collection-hint">Swipe to browse · Select a card to explore</p><div className="collection-dots" aria-label="Choose a skill card">
      {collections.map(({title},index)=><button type="button" key={title} onClick={()=>select(index)} aria-label={`Show ${title}`} aria-pressed={active===index}><span/></button>)}
    </div></div>
    {opened!==null && <CollectionDialog collection={collections[opened]} projects={work} onDismiss={()=>setOpened(null)}/>}
  </div>;
}
function AboutCard({title, icon:Icon, children}) {
  const reduced=useReducedMotion();
  const item={hidden:{opacity:0,y:16},visible:{opacity:1,y:0}};
  return <motion.article className={`about-card about-card--${title.toLowerCase()}`} initial={reduced?false:'hidden'} whileInView="visible"
    viewport={{once:true,amount:.18}}
    variants={{hidden:{opacity:0,y:48,scale:.97},visible:{opacity:1,y:0,scale:1,transition:{duration:.65,ease:[.22,1,.36,1],delayChildren:.12,staggerChildren:.09}}}}>
    <motion.div className="about-card-heading" variants={reduced?undefined:item}>
      <span className="about-card-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true"/></span><h3>{title}</h3>
    </motion.div>
    <motion.div className="about-card-content" variants={reduced?undefined:item}>{children}</motion.div>
  </motion.article>;
}
function About() {
  return <section id="about" className="section about"><div className="inner about-layout">
    <div className="about-intro"><Label>About me</Label><h2>The person<br/>behind the<br/><em>code.</em></h2><p>A little about my journey, the work I care about, and what keeps me curious.</p><div className="about-location"><MapPin size={16} aria-hidden="true"/>Sri Lanka</div></div>
    <div className="about-cards">
      <AboutCard title="Biography" icon={UserRound}><p>I am a dedicated software engineer with a deep passion for creating innovative digital solutions.</p><p>My journey in technology is driven by an insatiable curiosity and a commitment to excellence. I thrive in dynamic environments where I can leverage my multidisciplinary skills in full-stack development, UI/UX design, and project management to deliver products that exceed expectations.</p></AboutCard>
      <AboutCard title="Education" icon={GraduationCap}>
        <div className="about-entry"><span className="about-badge">In progress</span><h4>Undergraduate</h4><p>Sabaragamuwa University of Sri Lanka</p></div>
        <div className="about-entry"><h4>GCE Advanced Level</h4><p>Completed at: BT/KK/KATHIRAVELY V.M.V</p></div>
        <div className="about-entry"><h4>GCE Ordinary Level</h4><p>Completed at: BT/KK/KATHIRAVELY V.M.V</p></div>
      </AboutCard>
      <AboutCard title="Experience" icon={HeartHandshake}>
        <div className="about-entry"><h4>Volunteer Teaching</h4><p>Duration: 6 Months</p></div>
        <div className="about-entry"><h4>Data Collecting Volunteer Officer</h4><p>Divisional Secretary Office <span aria-hidden="true">·</span> 3 Months</p></div>
      </AboutCard>
      <AboutCard title="Interests" icon={Sparkles}><ul className="about-interests">
        {['Researching business-related topics','Exploring emerging technologies','Reading books','Playing football'].map(interest=><li key={interest}>{interest}</li>)}
      </ul></AboutCard>
    </div>
  </div></section>;
}
function Project({project:p}) {
  return <Reveal className="project">
    <a className={'project-preview '+p.image} href={p.live} target="_blank" rel="noreferrer" aria-label={'Open '+p.name+' live demo'}>
      <div className="browser-window"><div className="window-bar"><i/><i/><i/><span>{new URL(p.live).hostname}</span></div><img src={'/projects/'+p.image+'.jpg'} alt={p.name+' application preview'} width="1180" height="820" loading="lazy"/></div>
      <span className="preview-arrow"><ArrowUpRight size={20}/></span>
    </a>
    <div className="project-caption"><div className="micro">{p.type}</div><h3>{p.name}</h3><p>{p.blurb}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
      <div className="project-links"><a href={github+'/'+p.repo} target="_blank" rel="noreferrer"><Code2/>Source code</a><a href={p.live} target="_blank" rel="noreferrer">Live preview <ArrowUpRight/></a></div>
    </div>
  </Reveal>;
}
function Contact() {
  const [copied,setCopied]=useState(false);
  const [copyError,setCopyError]=useState(false);
  async function copy() {
    try {await navigator.clipboard.writeText(email);setCopied(true);setCopyError(false);setTimeout(()=>setCopied(false),2000);}
    catch {setCopyError(true);}
  }
  return <section id="contact" className="section contact"><div className="inner">
    <Label>Contact</Label><h2>LET’S BUILD SOMETHING<br/><em>REMARKABLE.</em></h2>
    <div className="email-row"><a href={'mailto:'+email}><Mail size={20}/>{email}</a><button onClick={copy} aria-label={copied?'Email copied':'Copy email address'} title="Copy email address">{copied?<Check size={16}/>:<Copy size={16}/>}</button><span aria-live="polite" className="copy-status">{copied?'Copied':copyError?'Select the address to copy it.':''}</span></div>
    <div className="socials"><a href={github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight/></a><a href="https://www.linkedin.com/in/pavithar81" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight/></a></div>
    <footer><span>© {new Date().getFullYear()} Pavithar M</span><a href="#home">Back to top <ArrowUp size={15}/></a></footer>
  </div></section>;
}
export default function Sections() {
  return <>
    <About/>
    <section id="skills" className="section skills"><div className="inner"><Label>Skills & technologies</Label><h2>My <em>toolkit.</em></h2>
      <div className="skill-list">{skills.map(([Icon,title,tools])=><Reveal className="skill" key={title}><Icon size={27} strokeWidth={1.4}/><h3>{title}</h3><p>{tools}</p></Reveal>)}</div><SkillCollections/></div></section>
    <section id="projects" className="section projects"><div className="inner"><Label>Featured projects</Label><div className="section-top"><h2>Selected <em>work.</em></h2><a href={github+'?tab=repositories'} target="_blank" rel="noreferrer">All repositories <ArrowUpRight size={16}/></a></div><div className="work-grid">{work.map(p=><Project key={p.name} project={p}/>)}</div></div></section>
    <section id="experience" className="section journey"><div className="inner journey-grid"><div><Label>Experience</Label><h2>My <em>journey.</em></h2></div><div className="timeline">{journey.map(([date,title,org,desc])=><Reveal className="milestone" key={title}><span className="micro">{date}</span><h3>{title}</h3><strong>{org}</strong><p>{desc}</p></Reveal>)}</div></div></section>
    <Contact/>
  </>;
}
