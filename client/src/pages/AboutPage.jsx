import { Link } from 'react-router-dom';
import heroEarth from '../assets/hero-earth.jpg';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { useOffices } from '../hooks/queries/useOffices.js';
import { useSeo } from '../hooks/useSeo.js';

const values = [
  ['Clarity over noise', 'We translate complex requirements into an understandable strategy, with decisions grounded in your circumstances.'],
  ['People before paperwork', 'Behind every application is a person, a family and a future worth treating with care.'],
  ['Global standards, local context', 'International insight meets on-the-ground support across the markets our clients call home.'],
  ['Progress you can see', 'Defined milestones, honest updates and thoughtful preparation keep every journey moving.'],
];

const fallbackOffices = [
  { _id: 'pk', name: 'Pakistan Office', address: { city: 'Islamabad', country: 'Pakistan' }, timezone: 'Asia/Karachi' },
  { _id: 'au', name: 'Australia Office', address: { city: 'Melbourne', country: 'Australia' }, timezone: 'Australia/Melbourne' },
  { _id: 'uk', name: 'United Kingdom Office', address: { city: 'London', country: 'United Kingdom' }, timezone: 'Europe/London' },
];

export function AboutPage() {
  const officesQuery = useOffices();
  const offices = Array.isArray(officesQuery.data) && officesQuery.data.length ? officesQuery.data : fallbackOffices;
  useSeo({ title: 'About us', description: 'Meet Nestway Immigration: considered immigration guidance, international expertise and local support for life-changing global journeys.' });

  return (
    <article>
      <PublicHero eyebrow="About Nestway" title="Guidance for lives" accent="in motion." description="We help ambitious people make informed moves across borders—with rigorous preparation, calm advice and a distinctly human point of view." backgroundImage={heroEarth}>
        <Link to="/company-profile" className="inline-flex rounded-full border border-white/25 px-7 py-4 text-sm font-bold text-white transition hover:border-gold hover:bg-gold hover:text-brand">Explore our company <span className="ml-4" aria-hidden="true">&rarr;</span></Link>
      </PublicHero>

      <section className="bg-cream py-24 sm:py-32">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <Reveal><p className="eyebrow">Who we are</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-brand">A global consultancy built around better decisions.</h2></Reveal>
            <Reveal delay={.1}><p className="font-display text-4xl font-medium leading-[1.08] text-brand sm:text-5xl">Your destination matters. The confidence behind every step matters just as much.</p><p className="mt-7 max-w-3xl text-lg leading-8 text-ink-muted">Nestway brings immigration strategy, education guidance and application support into one considered experience. We combine current program knowledge with personal context to help clients choose pathways that fit both their eligibility and their larger ambitions.</p></Reveal>
          </div>
        </PageContainer>
      </section>

      <section className="overflow-hidden bg-brand py-24 text-white sm:py-32">
        <PageContainer>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal><div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"><img src={heroEarth} alt="Earth viewed from space, representing Nestway's global perspective" className="size-full object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-brand via-transparent to-transparent" /><p className="absolute bottom-8 left-8 right-8 font-display text-4xl font-semibold">One brave decision can redraw a life.</p></div></Reveal>
            <Reveal delay={.12}><p className="eyebrow text-gold-light">Our story</p><h2 className="display-title text-white">Built to make complexity feel <em className="text-gold-light">navigable.</em></h2><p className="mt-8 text-lg leading-8 text-white/60">Nestway began with a simple belief: immigration advice should feel precise without feeling impersonal. Our platform brings structure to high-stakes journeys while keeping the individual—not the file—at the centre of every conversation.</p><div className="mt-12 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Mission</p><p className="mt-4 leading-7 text-white/65">Make global opportunity easier to understand, prepare for and pursue responsibly.</p></div><div><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Vision</p><p className="mt-4 leading-7 text-white/65">A world where borders do not limit informed, qualified and ambitious people.</p></div></div></Reveal>
          </div>
        </PageContainer>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <PageContainer>
          <Reveal><p className="eyebrow">Why Nestway</p><h2 className="display-title max-w-4xl">Expertise is expected. <em className="text-gold-dark">Care is the difference.</em></h2></Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-brand/10 bg-brand/10 md:grid-cols-2">{values.map(([title, text], index) => <Reveal key={title} className="bg-cream"><div className="min-h-64 p-8 sm:p-10"><span className="text-xs font-bold text-gold-dark">0{index + 1}</span><h3 className="mt-10 font-display text-4xl font-semibold text-brand">{title}</h3><p className="mt-4 max-w-lg leading-7 text-ink-muted">{text}</p></div></Reveal>)}</div>
        </PageContainer>
      </section>

      <section className="bg-[#e5ded2] py-24 sm:py-32">
        <PageContainer>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><Reveal><p className="eyebrow">Global presence</p><h2 className="display-title">Close to the journey, <em className="text-gold-dark">wherever it begins.</em></h2></Reveal><p className="max-w-sm leading-7 text-ink-muted">Meet locally or connect remotely with a team that understands both departure and destination.</p></div>
          {officesQuery.isPending ? <div className="mt-14 grid gap-4 md:grid-cols-3" role="status" aria-label="Loading offices">{[1, 2, 3].map((item) => <div key={item} className="h-60 animate-pulse rounded-3xl bg-white/60" />)}</div> : <div className="mt-14 grid gap-4 md:grid-cols-3">{offices.map((office, index) => <Reveal key={office._id || office.name} delay={index * .07}><div className="flex min-h-64 flex-col rounded-3xl bg-white p-8"><span className="text-xs font-bold uppercase tracking-[.18em] text-gold-dark">Office 0{index + 1}</span><h3 className="mt-auto pt-12 font-display text-4xl font-semibold text-brand">{office.name}</h3><p className="mt-3 text-sm text-ink-muted">{[office.address?.city, office.address?.country].filter(Boolean).join(', ')}</p><p className="mt-1 text-xs text-ink-muted">{office.timezone}</p></div></Reveal>)}</div>}
          {officesQuery.isError && <p className="mt-5 text-sm text-ink-muted">Live office details are temporarily unavailable; showing our primary locations.</p>}
          <Reveal><div className="mt-16 grid gap-8 rounded-[2rem] bg-brand p-8 text-white sm:grid-cols-2 lg:grid-cols-4 lg:p-10">{[['MARN', '2519006'], ['Presence', '3 regions'], ['Approach', 'End-to-end'], ['Consultations', 'In-person + online']].map(([label, value]) => <div key={label}><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">{label}</p><p className="mt-3 font-display text-3xl font-semibold">{value}</p></div>)}</div></Reveal>
        </PageContainer>
      </section>

      <ConsultationCta eyebrow="Start with a conversation" title="A clearer global future starts here." />
    </article>
  );
}
