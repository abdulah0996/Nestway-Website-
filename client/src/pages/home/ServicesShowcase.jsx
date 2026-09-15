import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import panorama from '../../assets/destinations-panorama.jpg';
import { serviceImages } from '../../assets/editorialImages.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';

const defaults = [
  { name: 'Study Visa', slug: 'study-visa', shortDescription: 'Turn admission into arrival with end-to-end study guidance.', category: 'study', imageUrl: serviceImages['study-visa'] },
  { name: 'Visit Visa', slug: 'visit-visa', shortDescription: 'Travel with a clear, carefully prepared application.', category: 'visitor', imageUrl: serviceImages['visit-visa'] },
  { name: 'Skilled Immigration', slug: 'skilled-immigration', shortDescription: 'Translate your experience into a credible global pathway.', category: 'work', imageUrl: serviceImages['skilled-immigration'] },
  { name: 'Business Immigration', slug: 'business-immigration', shortDescription: 'Build your next venture in the market that fits your ambition.', category: 'business', imageUrl: serviceImages['business-immigration'] },
];

const supportingServices = [
  ['Counselling', 'Personal guidance shaped around your goals and circumstances.', '/appointment'],
  ['Admission Guidance', 'A clear path from course selection to a complete admission file.', '/universities'],
  ['University Selection', 'Compare institutions, programs, destinations and intakes with purpose.', '/universities'],
  ['Visa Application Assistance', 'Careful preparation from the first document to submission.', '/appointment'],
  ['Language Test Preparation', 'Focused IELTS, TOEFL and OET preparation for the milestone ahead.', '/training'],
  ['Australia Office Support', 'Destination-side support from our Seven Hills, NSW presence.', '/contact'],
];

export function ServicesShowcase({ apiServices = [] }) {
  const services = defaults.map((item) => ({ ...item, ...(apiServices.find((service) => service.slug === item.slug || service.category === item.category) || {}) }));
  return (
    <section className="relative overflow-hidden bg-brand py-24 text-white sm:py-32">
      <div className="absolute -right-48 top-20 size-[38rem] rounded-full border border-gold/10" /><div className="absolute -right-24 top-44 size-[24rem] rounded-full border border-gold/10" />
      <PageContainer>
        <Reveal><p className="eyebrow text-gold-light">Expertise, made personal</p><h2 className="display-title max-w-4xl text-white">Not paperwork. <em className="text-gold-light">A strategy for your life.</em></h2></Reveal>
        <div className="mt-14 grid auto-rows-[340px] gap-4 md:grid-cols-2 lg:grid-cols-4">{services.map((service, index) => <motion.article key={service.name} className="group relative isolate overflow-hidden rounded-[1.6rem] border border-white/15 bg-white/[.06] p-6 shadow-card md:first:col-span-2 lg:first:col-span-1" whileHover={{ y: -3 }} transition={{ duration: .25, ease: 'easeOut' }}><img src={service.imageUrl || serviceImages[service.slug] || panorama} alt={`${service.name} consultation`} className="absolute inset-0 -z-20 size-full scale-[1.03] object-cover opacity-55 transition duration-700 group-hover:scale-100 group-hover:opacity-65" style={{ objectPosition: service.imageUrl ? 'center' : `${index * 28}% center` }} loading="lazy" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand via-brand/65 to-brand/15" /><div className="flex h-full flex-col"><span className="text-xs font-bold tracking-[.2em] text-gold-light">0{index + 1}</span><div className="mt-auto"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-white/60">{service.category}</p><h3 className="font-display text-3xl font-semibold leading-tight sm:text-[2rem]">{service.name}</h3><p className="mt-4 text-sm leading-6 text-white/80">{service.shortDescription}</p><Link to={`/services/${service.slug}`} className="mt-5 inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-brand/20 transition hover:border-gold hover:bg-gold hover:text-brand" aria-label={`Explore ${service.name}`}>↗</Link></div></div></motion.article>)}</div>
        <Reveal><div className="mt-16 border-t border-white/12 pt-12"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Complete journey support</p><h3 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Expert help between every milestone.</h3></div><p className="max-w-md text-sm leading-6 text-white/50">From the first shortlist to destination-side support, every detail is connected into one considered plan.</p></div><div className="mt-9 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">{supportingServices.map(([name, description, to]) => <Link key={name} to={to} className="group bg-brand/75 p-6 transition hover:bg-white/[.07]"><div className="flex items-start justify-between gap-4"><h4 className="font-display text-3xl font-semibold">{name}</h4><span className="text-gold transition group-hover:translate-x-1" aria-hidden="true">&rarr;</span></div><p className="mt-4 text-sm leading-6 text-white/50">{description}</p></Link>)}</div></div></Reveal>
      </PageContainer>
    </section>
  );
}
