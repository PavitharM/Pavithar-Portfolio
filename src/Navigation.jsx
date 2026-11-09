import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

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

