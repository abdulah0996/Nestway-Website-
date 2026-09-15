import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import panorama from '../assets/destinations-panorama.jpg';
import { countryImages } from '../assets/editorialImages.js';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { useCountries } from '../hooks/queries/useCountries.js';
import { useSeo } from '../hooks/useSeo.js';

const destinations = [
  { name: 'Australia', slug: 'australia', imageUrl: countryImages.australia, summary: 'International education, graduate opportunities and skills-led migration pathways.' },
  { name: 'United Kingdom', slug: 'united-kingdom', imageUrl: countryImages['united-kingdom'], summary: 'Globally recognised education with graduate, work and family visa options.' },
  { name: 'Canada', slug: 'canada', imageUrl: countryImages.canada, summary: 'Study and professional pathways shaped by federal and provincial opportunities.' },
  { name: 'New Zealand', slug: 'new-zealand', imageUrl: countryImages['new-zealand'], summary: 'Quality education, skilled employment and an outstanding student lifestyle.' },
  { name: 'Malaysia', slug: 'malaysia', imageUrl: countryImages.malaysia, summary: 'Accessible international education in a connected Southeast Asian destination.' },
  { name: 'Europe', slug: 'europe', imageUrl: countryImages.europe, summary: 'Compare country-specific study routes across diverse European education systems.' },
];

export function CountriesPage() {
  const countriesQuery = useCountries();
  const liveCountries = Array.isArray(countriesQuery.data) ? countriesQuery.data : [];
  const countries = destinations.map((destination) => ({
    ...destination,
    ...(liveCountries.find((country) => country.slug === destination.slug) || {}),
    imageUrl: liveCountries.find((country) => country.slug === destination.slug)?.imageUrl || destination.imageUrl,
  }));
  useSeo({ title: 'Study destinations', description: 'Compare international study destinations, education opportunities and visa pathways with Nestway Immigration.' });

  return <article>
    <PublicHero eyebrow="Study destinations" title="Choose a destination that supports your education and career." description="Compare universities, admissions, student experience and future opportunities before deciding where your international journey should begin." backgroundImage={panorama} compact>
      <Link to="/appointment" className="inline-flex rounded-full bg-gold px-7 py-4 text-sm font-bold text-brand transition hover:bg-gold-light">Discuss your study plans <span className="ml-3" aria-hidden="true">&rarr;</span></Link>
    </PublicHero>

    <section className="bg-cream py-20 sm:py-24"><PageContainer>
      <Reveal><div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow">Explore your options</p><h2 className="display-title">Six destinations. One informed decision.</h2></div><p className="max-w-2xl text-base leading-7 text-ink-muted">Each guide introduces the academic environment, popular institutions, general entry considerations and typical intake periods. Final requirements always depend on the institution and course.</p></div></Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{countries.map((country, index) => <Reveal key={country.slug} delay={index * .05}><motion.article whileHover={{ y: -5 }} className="group h-full overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-card transition-shadow hover:shadow-card-hover"><Link to={`/countries/${country.slug}`} className="flex h-full min-h-[27rem] flex-col"><div className="relative h-56 overflow-hidden bg-brand"><img src={country.imageUrl} alt={`${country.name} study destination`} className="size-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-brand/65 via-transparent to-transparent" /><span className="absolute bottom-5 left-6 text-xs font-bold uppercase tracking-[.15em] text-white/80">Destination 0{index + 1}</span></div><div className="flex flex-1 flex-col p-6"><h2 className="font-display text-3xl font-semibold text-brand">Study in {country.name}</h2><p className="mt-4 text-sm leading-6 text-ink-muted">{country.summary || country.introduction}</p><span className="mt-auto pt-7 text-sm font-bold text-brand">View destination guide <span className="ml-2 text-gold-dark" aria-hidden="true">&rarr;</span></span></div></Link></motion.article></Reveal>)}</div>
      {countriesQuery.isError && <p className="mt-6 text-sm text-ink-muted">Live destination content is temporarily unavailable; the complete destination guides remain available.</p>}
    </PageContainer></section>

    <ConsultationCta eyebrow="Not sure where to study?" title="Compare destinations against your real profile." description="Our education team can help you consider admission fit, costs, timelines and visa requirements together." />
  </article>;
}
