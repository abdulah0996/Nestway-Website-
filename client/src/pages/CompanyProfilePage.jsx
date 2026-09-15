import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import behrozPortrait from '../assets/behroz-asa.webp';
import panorama from '../assets/destinations-panorama.jpg';
import shahdainPortrait from '../assets/shahdain-asa.png';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { useTeamMembers } from '../hooks/queries/useTeamMembers.js';
import { useSeo } from '../hooks/useSeo.js';

const companyProfilePdf = import.meta.env.VITE_COMPANY_PROFILE_PDF_URL || 'https://nestwayimmigration.com/wp-content/uploads/2026/06/Nestway-Company-Profile-1.pdf';
const australiaSite = 'https://nestwayimmigration.com.au/';

const expertise = [
  'Skilled Migration', 'Student Visas', 'Employer Sponsored Visas', 'Partner & Family Visas',
  'Visitor Visas', 'Business Pathways', 'Protection Applications', 'AAT Appeals',
];

const offices = [
  { country: 'Australia', name: 'Australia Office', city: 'Seven Hills, NSW', address: ['8/238 Prospect Hwy', 'Seven Hills', 'NSW 2147', 'Australia'], position: ['84%', '71%'] },
  { country: 'Pakistan', name: 'Pakistan Office', city: 'Lahore, Punjab', address: ['Plaza A, Building 148', 'Near Dolmen Mall', 'DHA Phase 6', 'Lahore, Pakistan'], position: ['68%', '47%'] },
  { country: 'United Kingdom', name: 'UK Office', city: 'Edinburgh, Scotland', address: ['5/4 West Montgomery Place', 'Edinburgh', 'EH7 5HA'], position: ['45%', '28%'] },
];

const services = [
  { title: 'Student Visa', number: '01', to: '/services/study-visa', text: 'Study planning, admission direction and visa preparation.' },
  { title: 'Visit Visa', number: '02', to: '/services/visit-visa', text: 'Purpose-led visitor applications with coherent supporting evidence.' },
  { title: 'Skilled Migration', number: '03', to: '/services/skilled-immigration', text: 'Profile, occupation and points-led migration strategy.' },
  { title: 'Business Immigration', number: '04', to: '/services/business-immigration', text: 'Commercial pathways for eligible founders and investors.' },
  { title: 'Partner Visa', number: '05', to: '/appointment?service=Partner%20Visa', text: 'Relationship evidence and family-focused application support.' },
  { title: 'Family Visa', number: '06', to: '/appointment?service=Family%20Visa', text: 'Clear guidance for eligible family and sponsorship pathways.' },
];

const journey = [
  ['Initial Consultation', 'Understand your goals, background and preferred timeline.'],
  ['Profile Assessment', 'Evaluate realistic visa and education pathway options.'],
  ['Documentation', 'Organise, verify and strengthen the supporting evidence.'],
  ['Application Submission', 'Finalise and lodge a consistent application.'],
  ['Visa Decision', 'Navigate requests, updates and the final outcome.'],
];

function findMember(members, firstName) {
  return members.find((member) => member.firstName?.toLowerCase() === firstName.toLowerCase());
}

function LeadershipCard({ name, title, image, initials, description }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-brand/10 bg-white shadow-card">
      <div className="relative aspect-[4/4.6] overflow-hidden bg-brand">
        {image ? <img src={image} alt={`${name}, ${title}`} className="size-full object-cover object-top transition duration-700 group-hover:scale-[1.03]" loading="lazy" /> : <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_68%_22%,rgba(143,191,217,.28),transparent_32%),linear-gradient(145deg,#102b50,#031225)]"><span className="grid size-40 place-items-center rounded-full border border-gold/35 font-display text-7xl font-semibold text-gold-light">{initials}</span></div>}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand/75 to-transparent" />
      </div>
      <div className="p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-dark">{title}</p><h3 className="mt-3 font-display text-4xl font-semibold text-brand">{name}</h3><p className="mt-5 leading-7 text-ink-muted">{description}</p></div>
    </article>
  );
}

export function CompanyProfilePage() {
  const [activeOffice, setActiveOffice] = useState(0);
  const teamQuery = useTeamMembers();
  const publishedMembers = Array.isArray(teamQuery.data) ? teamQuery.data.filter((member) => member.isPublished !== false) : [];
  const shahdain = findMember(publishedMembers, 'Shahdain');
  const behroz = findMember(publishedMembers, 'Behroz');
  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org', '@type': 'Organization', name: 'Nestway Immigration',
    url: 'https://nestwayimmigration.com/', email: 'info@nestwayimmigration.com',
    areaServed: ['Australia', 'Pakistan', 'United Kingdom'],
    employee: [{ '@type': 'Person', name: 'Shahdain Asa', jobTitle: 'Registered Migration Agent' }, { '@type': 'Person', name: 'Behroz Asa', jobTitle: 'CEO' }],
  }), []);
  useSeo({ title: 'Company Profile - Your Trusted Immigration Partner', description: 'Meet Nestway Immigration, Shahdain Asa MARN 2519006, CEO Behroz Asa, our international offices and professional migration and education services.', structuredData });

  return (
    <article>
      <PublicHero eyebrow="Your Trusted Immigration Partner" title="Company" accent="Profile." description="Professional migration and education consultancy for individuals, families, students, workers, businesses and investors." backgroundImage={panorama}>
        <div className="flex flex-wrap gap-3"><Link to="/appointment" className="inline-flex rounded-full bg-gold px-7 py-4 text-sm font-bold text-brand transition hover:bg-gold-light">Book consultation <span className="ml-4" aria-hidden="true">&rarr;</span></Link><a href="#company-story" className="inline-flex rounded-full border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:border-white">Discover Nestway</a></div>
      </PublicHero>

      <section id="company-story" className="bg-cream py-24 sm:py-32"><PageContainer><div className="grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <Reveal><p className="eyebrow">Company introduction</p><h2 className="display-title max-w-3xl">Professional guidance for <em className="text-gold-dark">life-changing decisions.</em></h2><p className="mt-8 text-lg leading-8 text-ink-muted">NestWay Immigration provides professional migration and education consultancy services for individuals, families, students, workers, businesses, and investors.</p><p className="mt-5 text-lg leading-8 text-ink-muted">With offices in Australia, Pakistan, and the United Kingdom, our team provides clear guidance, honest eligibility assessments, and application support from the first conversation to the final decision.</p><div className="mt-10 grid gap-3 sm:grid-cols-2">{expertise.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-white px-5 py-4"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 text-xs font-bold text-gold-dark">✓</span><span className="text-sm font-semibold text-brand">{item}</span></div>)}</div></Reveal>
        <Reveal delay={.12}><aside className="sticky top-28 overflow-hidden rounded-[2rem] bg-brand p-8 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Nestway at a glance</p><div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{[['03', 'International offices'], ['08', 'Core pathway groups'], ['2519006', 'MARA registration'], ['End-to-end', 'Application support']].map(([value, label]) => <div key={label} className="bg-brand-light p-6"><p className="font-display text-4xl font-semibold text-gold-light">{value}</p><p className="mt-2 text-xs font-bold uppercase tracking-[.12em] text-white/50">{label}</p></div>)}</div><blockquote className="mt-9 border-l border-gold pl-5 font-display text-2xl leading-snug text-white/75">“Clear advice. Honest assessment. Strong preparation.”</blockquote></aside></Reveal>
      </div></PageContainer></section>

      <section className="overflow-hidden bg-brand py-24 text-white sm:py-32"><PageContainer><Reveal><p className="eyebrow text-gold-light">Registered authority</p><h2 className="display-title max-w-4xl text-white">Advice backed by <em className="text-gold-light">professional accountability.</em></h2></Reveal><Reveal delay={.08}><div className="mt-16 grid overflow-hidden rounded-[24px] border border-white/12 bg-brand-light/55 shadow-[0_24px_70px_rgba(0,0,0,.2)] lg:grid-cols-[1.12fr_.88fr]"><div className="flex flex-col p-8 sm:p-12 lg:p-14"><span className="w-fit rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-200">Registered</span><p className="mt-9 text-xs font-bold uppercase tracking-[.18em] text-gold-light">Registered Migration Agent</p><h3 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Shahdain Asa</h3><p className="mt-6 max-w-xl text-base leading-7 text-white/65">Professional Australian migration guidance supported by registered oversight, clear eligibility assessment and responsible application preparation.</p><dl className="mt-10 grid gap-6 border-y border-white/15 py-8 sm:grid-cols-2"><div><dt className="text-xs uppercase tracking-[.14em] text-white/40">MARA registration</dt><dd className="mt-2 font-display text-3xl font-semibold text-gold-light sm:text-4xl">2519006</dd></div><div><dt className="text-xs uppercase tracking-[.14em] text-white/40">Professional standing</dt><dd className="mt-2 text-lg font-semibold text-white">Registered</dd></div></dl><a href="https://portal.mara.gov.au/search-the-register-of-migration-agents/" target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center text-sm font-bold text-gold-light">Verify registration <span className="ml-3" aria-hidden="true">&nearr;</span></a></div><div className="relative min-h-[480px] overflow-hidden bg-white lg:min-h-[620px]"><img src={shahdain?.photoUrl || shahdainPortrait} alt="Shahdain Asa, Registered Migration Agent" className="absolute inset-0 size-full object-cover object-top" loading="lazy" /><div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-brand/45 to-transparent" /></div></div></Reveal></PageContainer></section>

      <section className="bg-white py-24 sm:py-32"><PageContainer><Reveal><p className="eyebrow">Leadership</p><div className="grid gap-8 lg:grid-cols-2"><h2 className="display-title">Experience with a <em className="text-gold-dark">human point of view.</em></h2><p className="self-end max-w-xl text-lg leading-8 text-ink-muted">Led by registered migration expertise in Australia and client-focused leadership in Pakistan.</p></div></Reveal><div className="mt-14 grid gap-5 md:grid-cols-2"><Reveal><LeadershipCard name="Shahdain Asa" title={shahdain?.jobTitle || 'Migration Agent'} image={shahdain?.photoUrl || shahdainPortrait} initials="SA" description={shahdain?.bio || 'Registered Migration Agent providing structured, responsible direction across Australian migration matters.'} /></Reveal><Reveal delay={.1}><LeadershipCard name="Behroz Asa" title={behroz?.jobTitle || 'CEO'} image={behroz?.photoUrl || behrozPortrait} initials="BA" description={behroz?.bio || 'Leading Nestway’s Pakistan operations with a focus on trust, accessible guidance and results-centred client service.'} /></Reveal></div>{teamQuery.isPending && <p className="mt-6 text-sm text-ink-muted" role="status">Checking for current CMS leadership profiles&hellip;</p>}{teamQuery.isError && <p className="mt-6 text-sm text-ink-muted">CMS leadership imagery is temporarily unavailable; verified profile information remains displayed.</p>}</PageContainer></section>

      <section className="bg-[#e5ded2] py-24 sm:py-32"><PageContainer><div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]"><Reveal><p className="eyebrow">Global presence</p><h2 className="display-title">International reach. <em className="text-gold-dark">Local support.</em></h2><div className="mt-10 space-y-2">{offices.map((office, index) => <button type="button" key={office.country} onMouseEnter={() => setActiveOffice(index)} onFocus={() => setActiveOffice(index)} onClick={() => setActiveOffice(index)} aria-pressed={activeOffice === index} className={`w-full border-b py-5 text-left transition ${activeOffice === index ? 'border-gold text-brand' : 'border-brand/15 text-ink-muted'}`}><span className="flex items-center justify-between gap-4"><span className="font-display text-3xl font-semibold">{office.name}</span><span className="text-xs font-bold uppercase tracking-[.14em]">{office.city}</span></span></button>)}</div></Reveal><Reveal delay={.1}><div className="relative min-h-[540px] overflow-hidden rounded-[2rem] bg-brand p-6 text-white"><div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:18px_18px]" /><svg aria-hidden="true" viewBox="0 0 900 480" className="absolute inset-0 size-full opacity-30" fill="none"><path d="M65 265C170 135 300 116 420 214s222 62 414-34" stroke="#C9A227" strokeWidth="2" strokeDasharray="6 10" /></svg>{offices.map((office, index) => <button type="button" key={office.country} onClick={() => setActiveOffice(index)} aria-label={`Select ${office.name}`} style={{ left: office.position[0], top: office.position[1] }} className="absolute -translate-x-1/2 -translate-y-1/2"><span className={`absolute inset-0 rounded-full bg-gold ${activeOffice === index ? 'animate-ping' : 'opacity-0'}`} /><span className={`relative block rounded-full border-4 border-brand transition ${activeOffice === index ? 'size-6 bg-gold' : 'size-4 bg-white'}`} /></button>)}<motion.address key={offices[activeOffice].country} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/10 p-6 not-italic backdrop-blur-xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">{offices[activeOffice].name}</p><p className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{offices[activeOffice].address.join(', ')}</p></motion.address></div></Reveal></div></PageContainer></section>

      <section className="bg-cream py-24 sm:py-32"><PageContainer><Reveal><p className="eyebrow">Services overview</p><h2 className="display-title max-w-4xl">Support for every meaningful <em className="text-gold-dark">way forward.</em></h2></Reveal><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{services.map((service, index) => <Reveal key={service.title} delay={index * .05}><Link to={service.to} className="group flex min-h-72 flex-col rounded-[2rem] border border-brand/10 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:bg-brand hover:text-white hover:shadow-card-hover"><span className="text-xs font-bold text-gold-dark group-hover:text-gold-light">{service.number}</span><h3 className="mt-auto pt-12 font-display text-4xl font-semibold leading-tight text-brand group-hover:text-white">{service.title}</h3><p className="mt-4 text-sm leading-6 text-ink-muted group-hover:text-white/55">{service.text}</p><span className="mt-7 text-sm font-bold text-brand group-hover:text-gold-light">Explore pathway <span className="ml-2" aria-hidden="true">&rarr;</span></span></Link></Reveal>)}</div></PageContainer></section>

      <section className="bg-brand py-24 text-white sm:py-32"><PageContainer><Reveal><p className="eyebrow text-gold-light">Client journey</p><h2 className="display-title max-w-4xl text-white">A clear process from <em className="text-gold-light">question to decision.</em></h2></Reveal><div className="relative mt-16"><div className="absolute bottom-0 left-5 top-0 w-px bg-white/15 md:bottom-auto md:left-0 md:right-0 md:top-5 md:h-px md:w-auto" /><div className="grid gap-10 md:grid-cols-5">{journey.map(([title, text], index) => <Reveal key={title} delay={index * .07}><div className="relative pl-16 md:pl-0"><span className="absolute left-0 top-0 z-10 grid size-10 place-items-center rounded-full border border-gold/60 bg-brand text-xs font-bold text-gold md:relative">0{index + 1}</span><h3 className="font-display text-2xl font-semibold md:mt-7">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{text}</p></div></Reveal>)}</div></div></PageContainer></section>

      <section className="bg-white py-20 sm:py-24"><PageContainer><Reveal><div className="overflow-hidden rounded-2xl bg-[#e5ded2] p-8 sm:p-12"><div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow">Company credentials</p><h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-brand sm:text-5xl">Download the full Company Profile.</h2><p className="mt-6 max-w-2xl leading-7 text-ink-muted">Explore our company background, values, leadership, services, partnership approach and international presence.</p></div><a href={companyProfilePdf} target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center justify-center rounded-full bg-brand px-7 text-sm font-bold text-white transition hover:bg-brand-light">Download PDF <span className="ml-4" aria-hidden="true">&darr;</span></a></div><p className="mt-7 text-xs text-ink-muted">PDF source can be replaced through <code>VITE_COMPANY_PROFILE_PDF_URL</code> when the CMS-controlled document is available.</p></div></Reveal></PageContainer></section>

      <section className="bg-gold-light py-20"><PageContainer><Reveal><div className="flex flex-col justify-between gap-8 rounded-[2rem] border border-brand/10 bg-cream p-8 sm:flex-row sm:items-center sm:p-10"><div><p className="eyebrow">Australian migration services</p><h2 className="mt-4 font-display text-4xl font-semibold text-brand sm:text-5xl">Looking for our dedicated Australia experience?</h2></div><a href={australiaSite} target="_blank" rel="noreferrer" className="inline-flex shrink-0 rounded-full bg-brand px-7 py-4 text-sm font-bold text-white transition hover:bg-brand-light">Visit Our Australia Site <span className="ml-4" aria-hidden="true">&nearr;</span></a></div></Reveal></PageContainer></section>

      <ConsultationCta eyebrow="Your trusted immigration partner" title="Begin with honest guidance. Move with confidence." />
    </article>
  );
}
