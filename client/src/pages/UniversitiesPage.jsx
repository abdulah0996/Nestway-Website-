import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import panorama from '../assets/destinations-panorama.jpg';
import { countryImages } from '../assets/editorialImages.js';
import { ErrorState } from '../components/feedback/ErrorState.jsx';
import { LoadingState } from '../components/feedback/LoadingState.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useUniversities } from '../hooks/queries/useUniversities.js';
import { useSeo } from '../hooks/useSeo.js';

const fallbackUniversities = [
  { _id: 'u1', name: 'Australian University Network', city: 'Melbourne', country: { name: 'Australia' }, description: 'Explore undergraduate and postgraduate opportunities across leading Australian study destinations.', studyLevels: ['undergraduate', 'postgraduate'], popularPrograms: ['Business', 'Engineering', 'Information Technology'], isPublished: true },
  { _id: 'u2', name: 'United Kingdom University Network', city: 'London', country: { name: 'United Kingdom' }, description: 'Compare globally recognised programs with varied intakes and study formats across the UK.', studyLevels: ['foundation', 'undergraduate', 'postgraduate'], popularPrograms: ['Management', 'Health Sciences', 'Computing'], isPublished: true },
  { _id: 'u3', name: 'Canadian University Network', city: 'Toronto', country: { name: 'Canada' }, description: 'Discover institutions shaped by research, practical learning and international student communities.', studyLevels: ['undergraduate', 'postgraduate', 'doctorate'], popularPrograms: ['Data Science', 'Finance', 'Public Health'], isPublished: true },
  { _id: 'u4', name: 'New Zealand University Network', city: 'Auckland', country: { name: 'New Zealand' }, description: 'Find academically strong options in an environment known for quality of life and student support.', studyLevels: ['undergraduate', 'postgraduate'], popularPrograms: ['Agriculture', 'Education', 'Engineering'], isPublished: true },
  { _id: 'u5', name: 'Malaysian University Network', city: 'Kuala Lumpur', country: { name: 'Malaysia' }, description: 'Consider accessible international education with diverse campuses and globally connected programs.', studyLevels: ['foundation', 'undergraduate', 'postgraduate'], popularPrograms: ['Hospitality', 'Business', 'Computer Science'], isPublished: true },
  { _id: 'u6', name: 'European University Network', city: 'Multiple cities', country: { name: 'Europe' }, description: 'Navigate English-taught programs and distinctive academic experiences across European destinations.', studyLevels: ['undergraduate', 'postgraduate', 'doctorate'], popularPrograms: ['Sustainability', 'Design', 'Economics'], isPublished: true },
];

function countryName(university) {
  if (typeof university.country === 'string') return university.country;
  return university.country?.name || 'Global';
}

function universityImage(university) {
  const country = countryName(university).toLowerCase();
  const countrySlug = country === 'uk' ? 'united-kingdom' : country.replaceAll(' ', '-');
  return university.imageUrl || university.campusImageUrl || university.coverImageUrl || countryImages[countrySlug] || countryImages.europe;
}

const countryRoutes = { australia: 'Australia', uk: 'United Kingdom', canada: 'Canada', 'new-zealand': 'New Zealand', malaysia: 'Malaysia', europe: 'Europe' };
const canonicalCountry = (value) => ['uk', 'united kingdom'].includes(value.toLowerCase()) ? 'United Kingdom' : value;

export function UniversitiesPage() {
  const { countrySlug } = useParams();
  const routeCountry = countryRoutes[countrySlug];
  const universitiesQuery = useUniversities();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState(routeCountry || 'All');
  const [selected, setSelected] = useState(null);
  useEffect(() => setCountry(routeCountry || 'All'), [routeCountry]);
  useSeo({ title: routeCountry ? `Universities in ${routeCountry}` : 'Partner universities', description: routeCountry ? `Explore university and study opportunities in ${routeCountry} with guidance from Nestway Immigration.` : 'Explore partner university opportunities by country, study level and program with guidance from Nestway.' });
  const universities = useMemo(() => {
    const published = Array.isArray(universitiesQuery.data) ? universitiesQuery.data.filter((item) => item.isPublished !== false) : [];
    return published.length ? published : fallbackUniversities;
  }, [universitiesQuery.data]);
  const countries = ['All', ...new Set(universities.map(countryName))];
  const visible = universities.filter((university) => {
    const haystack = `${university.name} ${university.city} ${countryName(university)} ${(university.popularPrograms || []).join(' ')}`.toLowerCase();
    return (country === 'All' || canonicalCountry(countryName(university)) === country) && haystack.includes(search.trim().toLowerCase());
  });

  return (
    <article>
      <PublicHero eyebrow="University partners" title={routeCountry ? `Study options in ${routeCountry}` : 'Find the institution that fits your plans.'} description="Compare destinations, study levels and programs, then build an education and visa strategy around a well-researched shortlist." backgroundImage={panorama} compact />
      <section className="bg-cream py-20 sm:py-28"><PageContainer>
        <div className="grid gap-4 rounded-3xl border border-brand/10 bg-white p-5 md:grid-cols-2"><label><span className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-gold-dark">Search universities</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="University, city or program" className="form-control" /></label><label><span className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-gold-dark">Country</span><select value={country} onChange={(event) => setCountry(event.target.value)} className="form-control">{countries.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        {universitiesQuery.isPending ? <LoadingState label="Loading partner universities" /> : universitiesQuery.isError && !universities.length ? <ErrorState message={universitiesQuery.error?.message} onRetry={() => universitiesQuery.refetch()} /> : <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((university, index) => <motion.article layout key={university._id || university.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} className="group flex min-h-[29rem] flex-col overflow-hidden rounded-[2rem] border border-brand/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"><div className="relative h-48 overflow-hidden bg-brand"><img src={universityImage(university)} alt={`${countryName(university)} university destination`} className="size-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-brand/55 via-transparent to-transparent" />{university.logoUrl && <div className="absolute bottom-4 left-5 grid size-14 place-items-center rounded-xl bg-white/95 p-2 shadow"><img src={university.logoUrl} alt={`${university.name} logo`} className="max-h-full max-w-full" loading="lazy" /></div>}{university.isFeatured && <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-brand">Featured</span>}</div><div className="flex flex-1 flex-col p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-dark">{countryName(university)} &middot; {university.city}</p><h2 className="mt-4 font-display text-3xl font-semibold leading-[1.08] text-brand">{university.name}</h2><p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-muted">{university.description || 'Explore programs, study levels and admission possibilities with a Nestway education adviser.'}</p><button type="button" onClick={() => setSelected(university)} className="mt-auto pt-7 text-left text-sm font-bold text-brand">View details <span className="ml-2 text-gold-dark" aria-hidden="true">&rarr;</span></button></div></motion.article>)}</motion.div>}
        {!universitiesQuery.isPending && !visible.length && <div className="mt-10 rounded-3xl border border-brand/10 bg-white p-12 text-center"><h2 className="font-display text-4xl font-semibold text-brand">No matching universities.</h2><p className="mt-3 text-ink-muted">Try another country or a broader search.</p></div>}
        {universitiesQuery.isError && universities.length > 0 && <p className="mt-6 text-center text-sm text-ink-muted">Live university data is temporarily unavailable; showing destination networks.</p>}
      </PageContainer></section>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name || 'University details'}>
        {selected && <div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-dark">{countryName(selected)} &middot; {selected.city}</p><p className="mt-5 leading-7 text-ink-muted">{selected.description || 'Speak with our education team for current programs, intakes and entry requirements.'}</p>{selected.studyLevels?.length > 0 && <div className="mt-7"><h3 className="text-sm font-bold text-brand">Study levels</h3><div className="mt-3 flex flex-wrap gap-2">{selected.studyLevels.map((level) => <span key={level} className="rounded-full bg-brand/7 px-3 py-2 text-xs font-semibold capitalize text-brand">{level}</span>)}</div></div>}{selected.popularPrograms?.length > 0 && <div className="mt-7"><h3 className="text-sm font-bold text-brand">Popular programs</h3><ul className="mt-3 grid gap-2 sm:grid-cols-2">{selected.popularPrograms.map((program) => <li key={program} className="rounded-xl bg-white p-3 text-sm text-ink-muted">{program}</li>)}</ul></div>}<div className="mt-8 flex flex-wrap gap-3">{selected.websiteUrl && <a href={selected.websiteUrl} target="_blank" rel="noreferrer" className="rounded-full border border-brand/15 px-5 py-3 text-sm font-bold text-brand">Official website</a>}<Link to="/appointment" className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">Discuss this option</Link></div></div>}
      </Modal>
      <ConsultationCta eyebrow="Build a smarter shortlist" title="The right university is part of a bigger plan." />
    </article>
  );
}
