import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageContainer } from '../../components/layout/PageContainer.jsx';

gsap.registerPlugin(ScrollTrigger);
const metrics = [{ value: 'Proven', label: 'Years of experience' }, { value: 'Focused', label: 'Applicant outcomes' }, { value: 'Global', label: 'Countries served' }, { value: '03', label: 'Office locations' }];

export function TrustSection() {
  const section = useRef(null);
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const context = gsap.context(() => gsap.from('[data-trust]', { y: 70, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section.current, start: 'top 68%' } }), section);
    return () => context.revert();
  }, []);
  return <section ref={section} className="bg-gold py-20 text-brand sm:py-24"><PageContainer><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div data-trust><p className="text-xs font-bold uppercase tracking-[.22em]">Trust is our real credential</p><p className="mt-5 max-w-sm font-display text-4xl font-semibold leading-tight">Registered advice. Human perspective. Global reach.</p><div className="mt-7 inline-flex items-center gap-3 rounded-full border border-brand/20 px-4 py-2 text-xs font-bold"><span className="size-2 rounded-full bg-brand" /> MARN 2519006</div></div><div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-4">{metrics.map((metric) => <div data-trust key={metric.label} className="border-l border-brand/20 pl-5"><p className="font-display text-3xl font-semibold sm:text-4xl">{metric.value}</p><p className="mt-2 text-xs font-bold uppercase leading-5 tracking-[.12em] opacity-65">{metric.label}</p></div>)}</div></div></PageContainer></section>;
}
