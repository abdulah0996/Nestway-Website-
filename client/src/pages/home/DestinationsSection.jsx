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
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px)', () => {
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
    });
    return () => media.revert();
  }, []);

  const current = content[active];
  return (
    <section id="destinations" ref={section} className="bg-cream py-24 sm:py-32">
      <PageContainer>
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-16 md:flex-row md:items-end"><div><p className="eyebrow">Choose your horizon</p><h2 className="display-title max-w-3xl">One world. <em className="text-gold-dark">Many ways forward.</em></h2></div><p className="max-w-sm text-sm leading-6 text-ink-muted">Explore study, visa and migration possibilities across each destination.</p></div>

        <div className="-mx-4 lg:hidden">
          <div data-mobile-destinations className="mobile-snap-row flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
            {content.map((country, index) => (
              <motion.article
                key={country.slug}
                className="mobile-snap-card mobile-snap-card--destination relative h-[28rem] snap-center overflow-hidden rounded-2xl bg-brand text-white shadow-card"
                whileTap={{ scale: .985 }}
                transition={{ duration: .2 }}
              >
                <img src={country.imageUrl || countryImages[country.slug] || panorama} alt={`${country.name} destination landscape`} className="absolute inset-0 size-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = panorama; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/25 to-brand/5" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-end justify-between gap-4 border-b border-white/20 pb-5">
                    <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold-light">Destination 0{index + 1}</p><h3 className="mt-2 font-display text-4xl font-semibold leading-none">{country.name}</h3></div>
                    <Link to={`/countries/${country.slug}`} className="shrink-0 rounded-full border border-white/30 px-4 py-2 text-xs font-bold backdrop-blur-sm">Discover <span aria-hidden="true">&rarr;</span></Link>
                  </div>
                  <dl className="grid grid-cols-3 gap-3 pt-5">
                    {[['Visa', country.visa], ['Study', country.study], ['Migration', country.migration]].map(([label, text]) => <div key={label} className="min-w-0"><dt className="text-[9px] font-bold uppercase tracking-[.15em] text-white/50">{label}</dt><dd className="mt-2 text-xs leading-5 text-white/90">{text}</dd></div>)}
                  </dl>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 pt-2 text-[10px] font-bold uppercase tracking-[.16em] text-ink-muted"><span>Swipe to explore</span><span>{content.length} destinations</span></div>
        </div>

        <div data-desktop-destinations className="relative hidden items-start gap-10 lg:grid lg:grid-cols-[.78fr_1.35fr]">
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
