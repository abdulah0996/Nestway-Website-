import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { trainingImages } from '../../assets/editorialImages.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';

const courses = [
  ['IELTS', 'Academic and General Training preparation', trainingImages.IELTS, 'ielts'],
  ['TOEFL', 'Focused preparation for international study', trainingImages.TOEFL, 'toefl'],
  ['OET', 'English preparation for healthcare professionals', trainingImages.OET, 'oet'],
  ['Citizenship Test', 'Structured preparation for the next milestone', trainingImages.CT, 'citizenship'],
];

export function TrainingSection() {
  return (
    <section className="relative overflow-hidden bg-gold-light py-24 sm:py-32">
      <div className="absolute -left-40 top-12 size-[30rem] rounded-full border border-brand/5" />
      <PageContainer>
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <Reveal><p className="eyebrow">Training &amp; certifications</p><h2 className="display-title">Focused preparation for every required test.</h2><p className="mt-6 max-w-lg leading-7 text-ink-muted">Practical language and citizenship preparation built around the score, profession, or settlement milestone you need.</p><Link to="/training" className="mt-8 inline-flex rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-light">Explore training</Link></Reveal>
          <div className="grid gap-4 sm:grid-cols-2">{courses.map(([name, description, imageUrl, slug], index) => <Reveal key={name} delay={index * .05}><motion.div whileHover={{ y: -4 }}><Link to={`/training/${slug}`} className="group flex min-h-72 flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-card transition hover:border-gold/60 hover:shadow-card-hover" aria-label={`Explore ${name} training`}><div className="relative h-32 overflow-hidden bg-brand"><img src={imageUrl} alt={`${name} preparation`} className="size-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-brand/35 to-transparent" /><span className="absolute left-5 top-5 text-xs font-bold text-white">0{index + 1}</span></div><div className="flex flex-1 flex-col p-6"><h3 className="mt-auto font-display text-3xl font-semibold text-brand">{name}</h3><p className="mt-3 text-sm leading-6 text-ink-muted">{description}</p><span className="mt-5 text-xs font-bold text-brand">View course <span className="ml-1 text-gold-dark" aria-hidden="true">&rarr;</span></span></div></Link></motion.div></Reveal>)}</div>
        </div>
      </PageContainer>
    </section>
  );
}
