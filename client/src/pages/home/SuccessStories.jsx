import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';

const journey = ['Pakistan', 'Consultation', 'Application', 'Visa approval', 'New country'];

export function SuccessStories() {
  return <section id="success-stories" className="overflow-hidden bg-white py-24 sm:py-32"><PageContainer><Reveal><p className="eyebrow">Success, in motion</p><div className="grid gap-8 lg:grid-cols-2"><h2 className="display-title">Every approval begins with <em className="text-gold-dark">a brave first step.</em></h2><p className="self-end border-l border-gold pl-6 font-display text-2xl leading-snug text-brand">From the first question to the first day in a new country, every milestone should feel clear and considered.</p></div></Reveal><div className="relative mt-20"><div className="absolute left-5 right-5 top-5 hidden h-px bg-brand/15 sm:block" /><div className="grid gap-8 sm:grid-cols-5">{journey.map((stage, index) => <Reveal key={stage} delay={index * .08}><div className="relative"><span className={`relative z-10 grid size-10 place-items-center rounded-full border text-xs font-bold ${index === journey.length - 1 ? 'border-gold bg-gold text-brand' : 'border-brand/20 bg-white text-brand'}`}>0{index + 1}</span><p className="mt-5 font-display text-2xl font-semibold text-brand">{stage}</p><p className="mt-2 text-xs leading-5 text-ink-muted">{index === 0 ? 'A goal takes shape.' : index === 4 ? 'A new chapter begins.' : 'A clear step forward.'}</p></div></Reveal>)}</div></div></PageContainer></section>;
}
