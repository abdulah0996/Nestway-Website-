import { motion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import panorama from '../assets/destinations-panorama.jpg';
import { ErrorState } from '../components/feedback/ErrorState.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { useCountry } from '../hooks/queries/useCountries.js';
import { useFaqs } from '../hooks/queries/useFaqs.js';
import { usePathways } from '../hooks/queries/usePathways.js';
import { useUniversities } from '../hooks/queries/useUniversities.js';
import { useSeo } from '../hooks/useSeo.js';
import { countryContent } from './countries/countryContent.js';
import { CountryPageLoading } from './countries/CountryPageLoading.jsx';
import { ServiceFaqs } from './services/ServiceFaqs.jsx';

function relationshipMatches(value, id, slug) {
  if (!value) return false;
  if (typeof value === 'string') return value === id;
  return value._id === id || value.slug === slug;
}

function universityPrograms(university) {
  return university.popularPrograms || university.programs || [];
}

const requirementLabels = {
  eligibility: 'Academic and eligibility',
  language: 'English requirements',
  documents: 'Supporting documents',
  financial: 'Financial requirements',
};

function fallbackFaqs(name) {
  return [
    [`Which pathway is best for ${name}?`, `The best pathway depends on your purpose, qualifications, experience, finances and timing. A profile assessment helps narrow the options.`],
    [`How early should I prepare for ${name}?`, 'Starting early creates more time for eligibility checks, language testing and consistent documentation. The practical timeline depends on the route.'],
    ['Can my family be included?', 'Family options vary by visa category and individual circumstances. They should be reviewed as part of the initial pathway strategy.'],
  ];
}

export function CountryDetailPage() {
  const { slug } = useParams();
  const fallback = countryContent[slug];
  const apiSlug = fallback?.apiSlug || slug;
  const hero = useRef(null);
  const countryQuery = useCountry(apiSlug);
  const country = countryQuery.data;
  const pathwaysQuery = usePathways({ country: country?._id }, { enabled: Boolean(country?._id) });
  const universitiesQuery = useUniversities();
  const faqQuery = useFaqs({ country: country?._id });
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const content = fallback ? {
    ...fallback,
    ...country,
    name: country?.name || fallback.name,
    imageUrl: country?.imageUrl || fallback.imageUrl,
    overview: country?.overview || fallback.overview,
  } : null;

  const universities = useMemo(() => {
    const populated = Array.isArray(country?.universities) ? country.universities.filter((item) => typeof item === 'object') : [];
    if (populated.length) return populated;
    const matchingUniversities = Array.isArray(universitiesQuery.data)
      ? universitiesQuery.data.filter((item) => relationshipMatches(item.country, country?._id, apiSlug))
      : [];
    return matchingUniversities.length ? matchingUniversities : fallback?.universities || [];
  }, [country, universitiesQuery.data, apiSlug, fallback]);

  const pathways = Array.isArray(pathwaysQuery.data) && pathwaysQuery.data.length ? pathwaysQuery.data : content?.pathways;
  const apiFaqs = Array.isArray(faqQuery.data) ? faqQuery.data.filter((faq) => relationshipMatches(faq.country, country?._id, apiSlug)) : [];
  const faqs = apiFaqs.length ? apiFaqs : content ? fallbackFaqs(content.name) : [];
  useSeo({ title: content?.seo?.metaTitle || (content ? `Study in ${content.name}` : undefined), description: content?.seo?.metaDescription || content?.introduction });

  if (countryQuery.isPending) return <CountryPageLoading />;
  if (!content) return <PageContainer className="py-32"><ErrorState title="Destination not found" message={countryQuery.error?.message || 'This destination is not available.'} onRetry={() => countryQuery.refetch()} /></PageContainer>;

  return (
    <article>
      <section ref={hero} className="relative isolate min-h-[80svh] overflow-hidden bg-brand text-white">
        <motion.img style={{ y: imageY, objectPosition: `${content.position} center` }} src={content.heroImageUrl || content.imageUrl || panorama} alt="" className="absolute -inset-y-[12%] left-0 -z-20 h-[124%] w-full scale-105 object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,14,29,.95)_0%,rgba(3,14,29,.72)_48%,rgba(3,14,29,.18)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand via-transparent to-brand/30" />
        <PageContainer className="flex min-h-[80svh] items-end pb-14 pt-32 sm:pb-20 sm:pt-36"><div className="max-w-5xl"><motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold uppercase tracking-[.22em] text-gold-light">{content.kicker}</motion.p><div className="mt-5 overflow-hidden"><motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: .85, ease: [.22, 1, .36, 1] }} className="font-display text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-.03em]">Study in {content.name}</motion.h1></div><motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">{content.introduction}</motion.p><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45 }} className="mt-8 flex flex-col gap-3 min-[420px]:flex-row"><Link to="/appointment" className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-4 text-sm font-bold text-brand transition hover:bg-gold-light">Assess my options <span className="ml-4">&rarr;</span></Link><Link to={`/contact?country=${slug}`} className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/10">Send an enquiry</Link></motion.div></div></PageContainer>
      </section>

      <section className="bg-cream py-24 sm:py-32"><PageContainer><Reveal><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Why {content.name}</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-brand">A destination should fit your life, not only your visa.</h2></div><p className="font-display text-4xl font-medium leading-tight text-brand sm:text-5xl">{content.overview}</p></div></Reveal><div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-brand/10 bg-brand/10 md:grid-cols-2">{content.reasons.map(([title, text], index) => <Reveal key={title} className="bg-white"><div className="group min-h-64 p-7 sm:p-9"><span className="text-xs font-bold text-gold-dark">0{index + 1}</span><h3 className="mt-12 font-display text-3xl font-semibold text-brand sm:text-4xl">{title}</h3><p className="mt-4 max-w-md leading-7 text-ink-muted">{text}</p></div></Reveal>)}</div></PageContainer></section>

      <section className="overflow-hidden bg-brand py-24 text-white sm:py-32"><PageContainer><Reveal><p className="eyebrow text-gold-light">Available pathways</p><h2 className="display-title max-w-4xl text-white">Different ambitions. <em className="text-gold-light">Distinct ways in.</em></h2></Reveal><div className="mt-16 border-t border-white/15">{pathways.map((pathway, index) => <Reveal key={pathway._id || pathway.name}><div className="group grid gap-4 border-b border-white/15 py-7 transition hover:border-gold md:grid-cols-[90px_1fr_1fr_auto] md:items-center"><span className="text-xs font-bold text-gold">0{index + 1}</span><h3 className="font-display text-3xl font-semibold sm:text-4xl">{pathway.name}</h3><p className="max-w-lg text-sm leading-6 text-white/55">{pathway.shortDescription || pathway.description || pathway.detail}</p><Link to="/appointment" className="grid size-11 place-items-center rounded-full border border-white/20 transition group-hover:border-gold group-hover:bg-gold group-hover:text-brand" aria-label={`Discuss ${pathway.name}`}>↗</Link></div></Reveal>)}</div></PageContainer></section>

      <section className="bg-white py-20 sm:py-24"><PageContainer><Reveal><p className="eyebrow">Admission requirements</p><h2 className="display-title max-w-4xl">Prepare a clear, complete application.</h2></Reveal><div className="mt-12 grid gap-4 md:grid-cols-2">{Object.entries(content.requirements).map(([category, items], index) => <Reveal key={category} delay={index * .06}><div className="h-full rounded-2xl border border-brand/10 bg-cream/60 p-7 sm:p-8"><span className="text-xs font-bold text-gold-dark">0{index + 1}</span><h3 className="mt-5 font-display text-3xl font-semibold text-brand">{requirementLabels[category] || category}</h3><ul className="mt-6 space-y-4">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-ink-muted"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />{item}</li>)}</ul></div></Reveal>)}</div><p className="mt-7 text-xs leading-5 text-ink-muted">Requirements vary by institution, program and visa pathway. Your final checklist should be based on current official criteria.</p></PageContainer></section>

      <section className="bg-gold-light py-24 sm:py-32"><PageContainer><Reveal><p className="eyebrow">From possibility to decision</p><h2 className="display-title max-w-4xl">A clear process keeps <em className="text-gold-dark">momentum moving.</em></h2></Reveal><div className="relative mt-16"><div className="absolute bottom-0 left-5 top-0 w-px bg-brand/20 md:bottom-auto md:left-0 md:right-0 md:top-5 md:h-px md:w-auto" /><div className="grid gap-10 md:grid-cols-5">{content.process.map((step, index) => <Reveal key={step.title} delay={index * .07}><div className="relative pl-16 md:pl-0"><span className="absolute left-0 top-0 z-10 grid size-10 place-items-center rounded-full border border-brand/20 bg-gold-light text-xs font-bold text-brand md:relative">0{index + 1}</span><h3 className="font-display text-2xl font-semibold text-brand md:mt-7">{step.title}</h3><p className="mt-3 text-sm leading-6 text-ink-muted">{step.text}</p></div></Reveal>)}</div></div></PageContainer></section>

      <section className="bg-cream py-20 sm:py-24"><PageContainer><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Popular institutions</p><h2 className="display-title">University options in {content.name}.</h2></div><Link to={`/universities/${slug === 'united-kingdom' ? 'uk' : slug}`} className="text-sm font-bold text-brand">Explore university options &rarr;</Link></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{universities.slice(0, 6).map((university, index) => <Reveal key={university._id || university.name} delay={index * .05}><article className="flex h-full min-h-72 flex-col rounded-2xl border border-brand/10 bg-white p-6 shadow-card"><div className="flex items-center justify-between gap-4"><div className="flex size-12 items-center justify-center rounded-xl bg-cream">{university.logoUrl ? <img src={university.logoUrl} alt={`${university.name} logo`} className="max-h-8 max-w-9" loading="lazy" /> : <span className="font-display text-xl text-gold-dark">N</span>}</div><span className="text-xs font-semibold text-ink-muted">{university.city || university.location}</span></div><h3 className="mt-7 font-display text-2xl font-semibold leading-tight text-brand">{university.name}</h3><div className="mt-5 flex flex-wrap gap-2">{universityPrograms(university).slice(0, 3).map((program) => <span key={program} className="rounded-full bg-cream px-3 py-1.5 text-[10px] font-semibold text-ink-muted">{program}</span>)}</div><Link to="/appointment" className="mt-auto pt-7 text-sm font-bold text-brand">Discuss admission options <span className="ml-2 text-gold-dark" aria-hidden="true">&rarr;</span></Link></article></Reveal>)}</div><p className="mt-6 text-xs leading-5 text-ink-muted">Institution and program availability changes by intake. Nestway can help you build a current shortlist based on your academic profile.</p></PageContainer></section>

      <section className="bg-white py-20 sm:py-24"><PageContainer><Reveal><div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">Application timing</p><h2 className="display-title">Plan around the right intake.</h2></div><p className="max-w-2xl self-end text-base leading-7 text-ink-muted">Deadlines vary by institution, course and applicant location. Begin early enough to compare programs, prepare evidence and complete the visa process without unnecessary pressure.</p></div></Reveal><div className="mt-12 grid gap-4 md:grid-cols-3">{(content.intakes || []).map(([name, detail], index) => <Reveal key={name} delay={index * .06}><article className="h-full rounded-2xl border border-brand/10 bg-cream p-6"><span className="text-xs font-bold text-gold-dark">0{index + 1}</span><h3 className="mt-7 font-display text-2xl font-semibold text-brand">{name}</h3><p className="mt-4 text-sm leading-6 text-ink-muted">{detail}</p></article></Reveal>)}</div></PageContainer></section>

      <ServiceFaqs items={faqs} />

      <section className="relative isolate overflow-hidden bg-gold py-20 text-brand sm:py-24"><div className="absolute -bottom-48 -right-32 -z-10 size-[32rem] rounded-full border border-brand/15" /><PageContainer><Reveal><p className="text-xs font-bold uppercase tracking-[.22em]">Your {content.name} plan starts here</p><h2 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-[-.025em] sm:text-5xl">Start your application journey.</h2><p className="mt-5 max-w-2xl leading-7 text-brand/75">Discuss your academic profile, preferred intake and visa considerations with the Nestway education team.</p><div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row"><Link to="/appointment" className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-4 text-sm font-bold text-white transition hover:bg-brand-light">Book your consultation <span className="ml-4">&rarr;</span></Link><Link to={`/contact?country=${slug}`} className="inline-flex items-center justify-center rounded-full border border-brand/20 px-8 py-4 text-sm font-bold text-brand transition hover:bg-brand/5">Send an enquiry</Link></div></Reveal></PageContainer></section>
    </article>
  );
}
