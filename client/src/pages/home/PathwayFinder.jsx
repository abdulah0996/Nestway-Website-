import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';

const steps = [
  { key: 'destination', title: 'Where do you want to go?', options: ['Australia', 'Canada', 'United Kingdom', 'New Zealand'] },
  { key: 'education', title: 'Your highest education?', options: ['High school', 'Bachelor’s', 'Master’s', 'Doctorate'] },
  { key: 'experience', title: 'Professional experience?', options: ['Just starting', '1–3 years', '4–7 years', '8+ years'] },
  { key: 'goal', title: 'What is your primary goal?', options: ['Study abroad', 'Skilled migration', 'Start a business', 'Visit family'] },
];

export function PathwayFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const complete = step === steps.length;
  const choose = (answer) => { setAnswers((values) => ({ ...values, [steps[step].key]: answer })); setStep((value) => value + 1); };
  const reset = () => { setAnswers({}); setStep(0); };
  return (
    <section className="bg-cream py-20 sm:py-24"><PageContainer><div className="overflow-hidden rounded-2xl bg-[#e8e3d8] lg:grid lg:min-h-[600px] lg:grid-cols-[.8fr_1.2fr]"><div className="relative overflow-hidden bg-brand p-8 text-white sm:p-12"><div className="absolute -bottom-32 -right-32 size-96 rounded-full border border-gold/20" /><div className="absolute -bottom-16 -right-16 size-64 rounded-full border border-gold/20" /><p className="eyebrow text-gold-light">Pathway assessment</p><h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] sm:text-5xl">Your next move, made clearer.</h2><p className="mt-6 max-w-md leading-7 text-white/60">Answer four questions for a considered starting point. Your final strategy is always reviewed by a qualified adviser.</p><div className="mt-12 flex gap-2">{steps.map((item, index) => <span key={item.key} className={`h-1 flex-1 rounded-full ${index < step ? 'bg-gold' : 'bg-white/15'}`} />)}</div></div><div className="flex min-h-[430px] items-center p-7 sm:p-12"><AnimatePresence mode="wait">{!complete ? <motion.div key={step} className="w-full" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-dark">Question {step + 1} of {steps.length}</p><h3 className="mt-4 font-display text-4xl font-semibold text-brand sm:text-5xl">{steps[step].title}</h3><div className="mt-8 grid gap-3 sm:grid-cols-2">{steps[step].options.map((option) => <button key={option} onClick={() => choose(option)} className="group flex min-h-16 items-center justify-between rounded-xl border border-brand/12 bg-cream px-5 text-left text-sm font-semibold text-brand transition hover:border-gold hover:bg-white">{option}<span className="text-gold-dark transition group-hover:translate-x-1">&rarr;</span></button>)}</div>{step > 0 && <button onClick={() => setStep((value) => value - 1)} className="mt-6 text-sm font-semibold text-ink-muted">&larr; Back</button>}</motion.div> : <motion.div key="result" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}><span className="grid size-14 place-items-center rounded-full bg-gold text-2xl text-brand">&#10003;</span><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-gold-dark">Your starting pathway</p><h3 className="mt-3 font-display text-4xl font-semibold leading-tight text-brand sm:text-5xl">{answers.goal} in {answers.destination}</h3><p className="mt-5 max-w-lg leading-7 text-ink-muted">Based on your profile, a tailored assessment can identify your strongest route, timing, and evidence plan.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/appointment" className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white">Review with an adviser</Link><button onClick={reset} className="rounded-full border border-brand/20 px-6 py-3 text-sm font-bold text-brand">Start again</button></div></motion.div>}</AnimatePresence></div></div></PageContainer></section>
  );
}
