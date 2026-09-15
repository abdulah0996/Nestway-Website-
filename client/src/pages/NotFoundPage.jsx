import { motion } from 'framer-motion';
import heroEarth from '../assets/hero-earth.jpg';
import { Button } from '../components/ui/Button.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { useSeo } from '../hooks/useSeo.js';

export function NotFoundPage() {
  useSeo({ title: 'Page not found', description: 'The requested Nestway Immigration page could not be found.' });
  return <section className="relative isolate grid min-h-[82svh] place-items-center overflow-hidden bg-brand py-32 text-center text-white"><img src={heroEarth} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-25" /><div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand/50 to-brand" /><PageContainer><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><p className="font-display text-[clamp(8rem,24vw,17rem)] font-semibold leading-[.65] text-gold">404</p><h1 className="mt-10 font-display text-5xl font-semibold">This path leads elsewhere.</h1><p className="mx-auto mt-5 max-w-lg leading-7 text-white/60">The page may have moved, but your next destination is still within reach.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Button to="/" variant="accent">Return home</Button><Button to="/contact" className="border border-white/20 bg-transparent hover:bg-white/10">Contact Nestway</Button></div></motion.div></PageContainer></section>;
}
