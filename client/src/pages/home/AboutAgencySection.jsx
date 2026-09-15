import { Link } from 'react-router-dom';
import shahdainPortrait from '../../assets/shahdain-asa.png';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';

const principles = [
  ['Mission', 'Make international education and migration pathways clearer, more responsible and easier to navigate.'],
  ['Vision', 'A world where well-prepared people can pursue global opportunity with confidence.'],
  ['Values', 'Clarity, honesty, care and professional accountability at every stage of the journey.'],
];

export function AboutAgencySection() {
  return (
    <section id="about-agency" className="overflow-hidden bg-white py-24 sm:py-32">
      <PageContainer>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">About the agency</p>
            <h2 className="display-title max-w-3xl">Professional guidance for <em className="text-gold-dark">life-changing decisions.</em></h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ink-muted">Nestway Immigration supports students, professionals, families, businesses and investors with considered migration strategy, education counselling and end-to-end application guidance.</p>
            <p className="mt-5 max-w-2xl leading-7 text-ink-muted">With teams across Pakistan, Australia and the United Kingdom, we combine local understanding with international perspective—so every recommendation is grounded in both eligibility and the future you want to build.</p>
            <Link to="/about" className="mt-9 inline-flex items-center gap-4 text-sm font-bold text-brand">Discover our story <span className="text-gold-dark" aria-hidden="true">&rarr;</span></Link>
          </Reveal>

          <Reveal delay={.1}>
            <div className="relative overflow-hidden rounded-[2rem] bg-brand p-7 text-white sm:p-9">
              <div className="absolute -right-20 -top-20 size-64 rounded-full border border-gold/15" />
              <p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Professional leadership</p>
              <div className="mt-8 grid grid-cols-[5.5rem_1fr] items-center gap-5 sm:grid-cols-[7rem_1fr]">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white/10"><img src={shahdainPortrait} alt="Shahdain Asa, Registered Migration Agent" className="size-full object-cover" loading="lazy" /></div>
                <div><h3 className="font-display text-3xl font-semibold sm:text-4xl">Shahdain Asa</h3><p className="mt-2 text-sm text-white/55">Registered Migration Agent</p><p className="mt-5 inline-flex rounded-full border border-gold/30 px-4 py-2 text-xs font-bold text-gold-light">MARN 2519006</p></div>
              </div>
              <p className="mt-7 border-t border-white/12 pt-6 text-sm leading-6 text-white/55">Nestway&rsquo;s founder-led approach is reinforced by Behroz Asa as CEO, bringing professional accountability and a client-first perspective to every global journey.</p>
              <Link to="/company-profile" className="mt-6 inline-flex text-sm font-bold text-gold-light">Meet our leadership <span className="ml-3" aria-hidden="true">&rarr;</span></Link>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-brand/10 bg-brand/10 md:grid-cols-3">
          {principles.map(([title, description], index) => <Reveal key={title} className="bg-cream"><div className="h-full p-8"><span className="text-xs font-bold text-gold-dark">0{index + 1}</span><h3 className="mt-7 font-display text-3xl font-semibold text-brand">{title}</h3><p className="mt-4 leading-7 text-ink-muted">{description}</p></div></Reveal>)}
        </div>
      </PageContainer>
    </section>
  );
}
