import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import panorama from '../../assets/destinations-panorama.jpg';
import { countryImages, serviceImages } from '../../assets/editorialImages.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';
import { JourneyIcon } from './JourneyIcon.jsx';

const defaults = [
  { name: 'Study Visa', slug: 'study-visa', shortDescription: 'Turn admission into arrival with end-to-end study guidance.', category: 'study', imageUrl: serviceImages['study-visa'] },
  { name: 'Visit Visa', slug: 'visit-visa', shortDescription: 'Travel with a clear, carefully prepared application.', category: 'visitor', imageUrl: serviceImages['visit-visa'] },
  { name: 'Skilled Immigration', slug: 'skilled-immigration', shortDescription: 'Translate your experience into a credible global pathway.', category: 'work', imageUrl: serviceImages['skilled-immigration'] },
  { name: 'Business Immigration', slug: 'business-immigration', shortDescription: 'Build your next venture in the market that fits your ambition.', category: 'business', imageUrl: serviceImages['business-immigration'] },
];

const supportingServices = [
  { name: 'Personal counselling', description: 'Talk through your ambitions and find a direction that fits your life.', to: '/appointment', icon: 'chat', phase: 'Find your direction' },
  { name: 'Admission planning', description: 'Connect your course choice with the requirements of your application.', to: '/universities', icon: 'graduation', phase: 'Shape your future' },
  { name: 'University shortlist', description: 'Compare courses, locations and intakes around what matters to you.', to: '/universities', icon: 'university', phase: 'Explore your options' },
  { name: 'Application support', description: 'Know which documents to prepare and how the pieces come together.', to: '/appointment', icon: 'file', phase: 'Prepare with care' },
  { name: 'Test preparation', description: 'Build your readiness for IELTS, TOEFL or OET with focused support.', to: '/training', icon: 'language', phase: 'Build your confidence' },
  { name: 'Australia support', description: 'Connect with our team in Seven Hills, NSW for your next steps.', to: '/contact', icon: 'pin', phase: 'Stay connected' },
];

export function ServicesShowcase({ apiServices = [] }) {
  const services = defaults.map((item) => ({ ...item, ...(apiServices.find((service) => service.slug === item.slug || service.category === item.category) || {}) }));
  return (
    <section className="relative overflow-hidden bg-brand py-24 text-white sm:py-32">
      <div className="absolute -right-48 top-20 size-[38rem] rounded-full border border-gold/10" /><div className="absolute -right-24 top-44 size-[24rem] rounded-full border border-gold/10" />
      <PageContainer>
        <Reveal><p className="eyebrow text-gold-light">Expertise, made personal</p><h2 className="display-title max-w-4xl text-white">Not paperwork. <em className="text-gold-light">A strategy for your life.</em></h2></Reveal>
        <div className="mt-14 grid auto-rows-[340px] gap-4 md:grid-cols-2 lg:grid-cols-4">{services.map((service, index) => <motion.article key={service.name} className="group relative isolate overflow-hidden rounded-[1.6rem] border border-white/15 bg-white/[.06] p-6 shadow-card md:first:col-span-2 lg:first:col-span-1" whileHover={{ y: -3 }} transition={{ duration: .25, ease: 'easeOut' }}><img src={service.imageUrl || serviceImages[service.slug] || panorama} alt={`${service.name} consultation`} className="absolute inset-0 -z-20 size-full scale-[1.03] object-cover opacity-55 transition duration-700 group-hover:scale-100 group-hover:opacity-65" style={{ objectPosition: service.imageUrl ? 'center' : `${index * 28}% center` }} loading="lazy" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand via-brand/65 to-brand/15" /><div className="flex h-full flex-col"><span className="text-xs font-bold tracking-[.2em] text-gold-light">0{index + 1}</span><div className="mt-auto"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/60">{service.category}</p><h3 className="font-display text-3xl font-semibold leading-tight sm:text-[2rem]">{service.name}</h3><p className="mt-4 text-sm leading-6 text-white/80">{service.shortDescription}</p><Link to={`/services/${service.slug}`} className="mt-5 inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-brand/20 transition hover:border-gold hover:bg-gold hover:text-brand" aria-label={`Explore ${service.name}`}>↗</Link></div></div></motion.article>)}</div>
        <div className="support-section">
          <Reveal className="support-intro"><div><p className="eyebrow">Complete journey support</p><h3>Every detail.<br /><em>Thoughtfully connected.</em></h3><p className="support-description">The right course. A stronger application. A familiar team when you need one. Support that connects each part of your journey.</p></div><div className="support-visual"><img src={countryImages.australia} alt="Sydney harbour in Australia" loading="lazy" /><div /><span className="support-visual-tag"><JourneyIcon name="globe" />Local understanding. Global perspective.</span><p>From possibility<br /><em>to a plan.</em></p></div></Reveal>
          <div className="support-grid">{supportingServices.map(({ name, description, to, icon, phase }) => <Link key={name} to={to} className="support-card"><div className="support-card-top"><span className="support-icon"><JourneyIcon name={icon} /></span><JourneyIcon name="arrow" className="support-arrow" /></div><p className="support-phase">{phase}</p><h4>{name}</h4><p className="support-card-description">{description}</p></Link>)}</div>
          <div className="support-note"><JourneyIcon name="route" /><p>One connected journey, with guidance at every turn.</p></div>
        </div>
      </PageContainer>
    </section>
  );
}
