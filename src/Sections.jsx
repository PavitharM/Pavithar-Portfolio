import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowUp, Atom, Braces, Smartphone, Database, Terminal, Mail, Copy, Check, Code2, MapPin } from 'lucide-react';

const github = 'https://github.com/PavitharM';
const email = 'pavitharmangaleswaran@gmail.com';
function Reveal({children,className=''}) {
  const reduced=useReducedMotion();
  return <motion.div className={className} initial={reduced?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:.48,ease:'easeOut'}}>{children}</motion.div>;
}
function Label({children}) {return <div className="eyebrow"><i/>{children}</div>;}
export default function Sections() {
  return <>
    <section id="about" className="section about"><div className="inner about-grid">
      <div><Label>About me</Label><h2>Engineering with<br/><em>intent.</em></h2></div>
      <Reveal><p className="lead">I’m Pavithar, a software engineering undergraduate at Sabaragamuwa University of Sri Lanka.</p><p>I build web and mobile applications around the tasks people need to finish, from finding a lawyer to splitting a bill with friends. I’m drawn to the point where a clear interface meets a well-designed database.</p><div className="about-location"><MapPin size={15}/> Sri Lanka</div></Reveal>
    </div></section>
  </>;
}
