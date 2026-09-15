import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { countryImages } from '../../assets/editorialImages.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';

const destinations = [
  { slug: 'australia', name: 'Australia', network: 'Australian University Network', image: countryImages.australia },
  { slug: 'uk', name: 'United Kingdom', network: 'United Kingdom University Network', image: countryImages['united-kingdom'] },
  { slug: 'canada', name: 'Canada', network: 'Canadian University Network', image: countryImages.canada },
  { slug: 'new-zealand', name: 'New Zealand', network: 'New Zealand University Network', image: countryImages['new-zealand'] },
  { slug: 'malaysia', name: 'Malaysia', network: 'Malaysian University Network', image: countryImages.malaysia },
  { slug: 'europe', name: 'Europe', network: 'European University Network', image: countryImages.europe },
];

export function UniversityPartnersSection({ query }) {
  const live = Array.isArray(query.data) ? query.data.filter((item) => item.isPublished !== false) : [];

  return (
    <section className="bg-cream py-24 sm:py-32">
      <PageContainer>
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <Reveal><p className="eyebrow">Partner universities</p><h2 className="display-title max-w-3xl">Choose the right institution for your study plan.</h2></Reveal>
          <Reveal delay={.08}><Link to="/universities" className="inline-flex items-center gap-3 text-sm font-bold text-brand">Explore universities <span className="text-gold-dark" aria-hidden="true">&rarr;</span></Link></Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">{destinations.map((destination, index) => { const count = live.filter((item) => { const country = typeof item.country === 'string' ? item.country : item.country?.name; return country?.toLowerCase() === destination.name.toLowerCase(); }).length; return <motion.div key={destination.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .04 }} whileHover={{ y: -5 }}><Link to={`/universities/${destination.slug}`} className="group flex min-h-72 h-full flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-card transition duration-300 hover:border-gold/60 hover:shadow-card-hover" aria-label={`Explore universities in ${destination.name}`}><div className="relative h-32 overflow-hidden bg-brand"><img src={destination.image} alt={`${destination.name} university destination`} className="size-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-brand/60 via-transparent to-transparent" /></div><div className="flex flex-1 flex-col p-5"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-gold-dark">{destination.name}</p><h3 className="mt-auto pt-6 font-display text-xl font-semibold leading-tight text-brand">{destination.network}</h3><p className="mt-4 text-xs font-semibold text-ink-muted">{count ? `${count} listed partner${count === 1 ? '' : 's'}` : 'Explore study options'} <span className="ml-1 text-gold-dark transition group-hover:translate-x-1" aria-hidden="true">&rarr;</span></p></div></Link></motion.div>; })}</div>
        {query.isError && <p className="mt-6 text-sm text-ink-muted">Live university data is temporarily unavailable; showing our destination networks.</p>}
      </PageContainer>
    </section>
  );
}
