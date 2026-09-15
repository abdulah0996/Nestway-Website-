import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import panorama from '../../assets/destinations-panorama.jpg';
import { countryImages } from '../../assets/editorialImages.js';
import { PageContainer } from '../../components/layout/PageContainer.jsx';

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  { name: 'Australia', slug: 'australia', visa: 'Skilled & family visas', study: 'World-class universities', migration: 'Permanent pathways' },
  { name: 'United Kingdom', slug: 'united-kingdom', visa: 'Graduate & work routes', study: 'Globally ranked education', migration: 'Talent pathways' },
  { name: 'Canada', slug: 'canada', visa: 'Express Entry', study: 'Study permit guidance', migration: 'Provincial programs' },
  { name: 'United States', slug: 'united-states', visa: 'Visit & work options', study: 'Leading institutions', migration: 'Specialist guidance' },
  { name: 'New Zealand', slug: 'new-zealand', visa: 'Work to residence', study: 'Future-ready education', migration: 'Skilled residence' },
  { name: 'Malaysia', slug: 'malaysia', visa: 'Student pathways', study: 'Accessible global degrees', migration: 'Long-stay options' },
  { name: 'Europe', slug: 'europe', visa: 'Schengen guidance', study: 'Multi-country options', migration: 'Mobility pathways' },
];

export function DestinationsSection({ apiCountries = [] }) {
  const [active, setActive] = useState(0);
  const section = useRef(null);
  const items = useRef([]);
  const content = destinations.map((item) => ({ ...item, ...(apiCountries.find((country) => country.slug === item.slug) || {}) }));

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const context = gsap.context(() => {
      items.current.forEach((item, index) => ScrollTrigger.create({
        trigger: item,
        start: 'top 52%',
        end: 'bottom 48%',
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index),
      }));
    }, section);
    return () => context.revert();
  }, []);

  const current = content[active];
  return (
    <section id="destinations" ref={section} className="bg-cream py-24 sm:py-32">
      <PageContainer>
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">Choose your horizon</p><h2 className="display-title max-w-3xl">One world. <em className="text-gold-dark">Many ways forward.</em></h2></div><p className="max-w-sm text-sm leading-6 text-ink-muted">Move through the destinations to uncover the study, visa and migration possibilities waiting there.</p></div>
        <div className="relative grid items-start gap-10 lg:grid-cols-[.78fr_1.35fr]">
          <div className="order-last space-y-[30vh] pb-[30vh] pt-[12vh] lg:order-first lg:space-y-[42vh] lg:pb-[42vh]">{content.map((country, index) => <button ref={(node) => { items.current[index] = node; }} type="button" key={country.name} onClick={() => setActive(index)} aria-pressed={active === index} className={`block w-full text-left transition duration-500 ${active === index ? 'opacity-100' : 'opacity-25 hover:opacity-60'}`}><span className="text-xs font-bold text-gold-dark">0{index + 1}</span><span className="mt-2 block font-display text-5xl font-semibold text-brand sm:text-6xl">{country.name}</span></button>)}</div>
          <div className="sticky top-24 order-first h-[54vh] overflow-hidden rounded-[2rem] bg-brand lg:order-last lg:top-28 lg:h-[70vh]">
            <AnimatePresence initial={false}>
              <motion.img key={current.slug} src={current.imageUrl || countryImages[current.slug] || panorama} alt={`${current.name} destination landscape`} initial={{ opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .985 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }} className="absolute inset-0 size-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = panorama; }} />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/25 to-transparent" />
            <AnimatePresence mode="wait" initial={false}><motion.div key={current.slug} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45 }} className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10"><div className="flex items-center justify-between border-b border-white/20 pb-5"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Destination 0{active + 1}</p><Link to={`/countries/${current.slug}`} className="text-sm font-semibold">Discover &rarr;</Link></div><div className="grid gap-5 pt-7 sm:grid-cols-3">{[['Visa', current.visa], ['Study', current.study], ['Migration', current.migration]].map(([label, text]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/50">{label}</p><p className="mt-2 text-sm leading-5">{text}</p></div>)}</div></motion.div></AnimatePresence>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
