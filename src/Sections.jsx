import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowUp, Atom, Braces, Smartphone, Database, Terminal, Mail, Copy, Check, Code2, MapPin } from 'lucide-react';

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
    <section id="about" className="section about"><div className="inner about-grid">
      <div><Label>About me</Label><h2>Engineering with<br/><em>intent.</em></h2></div>
      <Reveal><p className="lead">I’m Pavithar, a software engineering undergraduate at Sabaragamuwa University of Sri Lanka.</p><p>I build web and mobile applications around the tasks people need to finish, from finding a lawyer to splitting a bill with friends. I’m drawn to the point where a clear interface meets a well-designed database.</p><div className="about-location"><MapPin size={15}/> Sri Lanka</div></Reveal>
    </div></section>
    <section id="skills" className="section skills"><div className="inner"><Label>Skills & technologies</Label><h2>My <em>toolkit.</em></h2>
      <div className="skill-list">{skills.map(([Icon,title,tools])=><Reveal className="skill" key={title}><Icon size={27} strokeWidth={1.4}/><h3>{title}</h3><p>{tools}</p></Reveal>)}</div></div></section>
    <section id="projects" className="section projects"><div className="inner"><Label>Featured projects</Label><div className="section-top"><h2>Selected <em>work.</em></h2><a href={github+'?tab=repositories'} target="_blank" rel="noreferrer">All repositories <ArrowUpRight size={16}/></a></div><div className="work-grid">{work.map(p=><Project key={p.name} project={p}/>)}</div></div></section>
    <section id="experience" className="section journey"><div className="inner journey-grid"><div><Label>Experience</Label><h2>My <em>journey.</em></h2></div><div className="timeline">{journey.map(([date,title,org,desc])=><Reveal className="milestone" key={title}><span className="micro">{date}</span><h3>{title}</h3><strong>{org}</strong><p>{desc}</p></Reveal>)}</div></div></section>
    <Contact/>
  </>;
}
