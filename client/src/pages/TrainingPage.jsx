import { Link, useParams } from 'react-router-dom';
import panorama from '../assets/destinations-panorama.jpg';
import { trainingImages } from '../assets/editorialImages.js';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { useSeo } from '../hooks/useSeo.js';

const courses = [
  { slug: 'ielts', code: 'IELTS', title: 'International English Language Testing System', detail: 'Structured preparation across listening, reading, writing and speaking for study and migration goals.', tag: 'Academic + General', imageUrl: trainingImages.IELTS },
  { slug: 'toefl', code: 'TOEFL', title: 'Test of English as a Foreign Language', detail: 'Skills-led preparation for candidates targeting English-medium academic environments.', tag: 'Academic English', imageUrl: trainingImages.TOEFL },
  { slug: 'oet', code: 'OET', title: 'Occupational English Test', detail: 'Profession-specific English preparation designed around communication in healthcare settings.', tag: 'Healthcare English', imageUrl: trainingImages.OET },
  { slug: 'citizenship', code: 'CT', title: 'Citizenship Test', detail: 'Focused preparation covering civic knowledge, national values and confident test technique.', tag: 'Settlement support', imageUrl: trainingImages.CT },
];

export function TrainingPage() {
  const { courseSlug } = useParams();
  const selectedCourse = courses.find((course) => course.slug === courseSlug);
  useSeo({ title: selectedCourse ? `${selectedCourse.code} training` : 'Training and certification', description: selectedCourse ? `${selectedCourse.title} preparation and consultation from Nestway Immigration.` : 'Prepare for IELTS, TOEFL, OET and citizenship testing with focused, goal-led training from Nestway.' });
  return (
    <article>
      <PublicHero eyebrow="Training and certification" title={selectedCourse ? selectedCourse.title : 'Professional test preparation for your next step.'} description={selectedCourse?.detail || 'Targeted preparation for the language and knowledge milestones that move international plans forward.'} backgroundImage={selectedCourse?.imageUrl || panorama}>
        <Link to="/contact" className="inline-flex rounded-full bg-gold px-7 py-4 text-sm font-bold text-brand transition hover:bg-gold-light">Ask about the next intake <span className="ml-4" aria-hidden="true">&rarr;</span></Link>
      </PublicHero>

      <section className="bg-cream py-20 sm:py-28"><PageContainer><Reveal><div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Course overview</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-brand">Training connected to the outcome that matters.</h2></div><p className="font-display text-3xl font-medium leading-tight text-brand sm:text-5xl">Build test readiness, practical skill and confidence through structured preparation.</p></div></Reveal><div className="mt-14 grid gap-4 md:grid-cols-2">{courses.map((course, index) => <Reveal key={course.code} delay={index * .06}><Link to={`/training/${course.slug}`} aria-current={selectedCourse?.slug === course.slug ? 'page' : undefined} className={`group flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card-hover ${selectedCourse?.slug === course.slug ? 'border-gold shadow-card' : 'border-brand/10'}`}><div className="relative h-52 overflow-hidden bg-brand"><img src={course.imageUrl} alt={`${course.code} preparation`} className="size-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-brand/55 via-transparent to-transparent" /><span className="absolute bottom-5 left-6 rounded-lg bg-white/95 px-3 py-2 font-display text-lg font-semibold text-brand shadow">{course.code}</span></div><div className="flex flex-1 flex-col p-7 sm:p-8"><span className="text-xs font-bold uppercase tracking-[.15em] text-gold-dark">{course.tag}</span><h3 className="mt-auto pt-8 font-display text-3xl font-semibold leading-tight text-brand">{course.title}</h3><p className="mt-5 leading-7 text-ink-muted">{course.detail}</p><span className="mt-6 text-sm font-bold text-brand">View course details <span className="ml-2 text-gold-dark" aria-hidden="true">&rarr;</span></span></div></Link></Reveal>)}</div></PageContainer></section>

      <section className="bg-brand py-20 text-white sm:py-28"><PageContainer><Reveal><p className="eyebrow text-gold-light">Why prepare with us</p><h2 className="display-title max-w-4xl text-white">Practical preparation with measurable progress.</h2></Reveal><div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">{['Diagnostic starting point', 'Focused study plan', 'Actionable feedback', 'Goal-aligned test strategy'].map((benefit, index) => <Reveal key={benefit} className="bg-brand-light"><div className="min-h-48 p-7"><span className="text-xs font-bold text-gold">0{index + 1}</span><p className="mt-14 font-display text-2xl font-semibold leading-tight">{benefit}</p></div></Reveal>)}</div></PageContainer></section>

      <ConsultationCta eyebrow="Build your preparation plan" title="The right score starts before test day." description="Tell us the pathway you are targeting and we will help you identify the preparation route that fits." />
    </article>
  );
}
