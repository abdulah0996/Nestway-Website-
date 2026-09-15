import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import earthImage from '../../assets/hero-earth.jpg';
import peopleImage from '../../assets/hero-people-optimized.png';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { FlightJourney } from './FlightJourney.jsx';

gsap.registerPlugin(ScrollTrigger);

const trust = ['Registered Migration Agent', 'MARN 2519006', 'Pakistan Office', 'Australia Office'];

export function HeroSection() {
  const section = useRef(null);
  const earth = useRef(null);
  const people = useRef(null);
  const content = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero-line]', { yPercent: 110, opacity: 0, duration: 1.15, stagger: 0.12 })
        .from('[data-hero-detail]', { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=.55');
      gsap.to(earth.current, { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to(people.current, { yPercent: 8, xPercent: 3, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: 1.2 } });
      gsap.to(content.current, { yPercent: 18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: section.current, start: '35% top', end: 'bottom top', scrub: true } });
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section ref={section} className="hero relative isolate flex min-h-[100svh] overflow-hidden bg-brand text-white">
      <img ref={earth} src={earthImage} alt="Earth viewed from space with illuminated global travel routes" className="absolute inset-0 -z-20 size-full object-cover object-center" fetchPriority="high" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,13,28,.96)_0%,rgba(3,13,28,.77)_40%,rgba(3,13,28,.2)_72%,rgba(3,13,28,.35)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#071a33_0%,transparent_24%,transparent_80%,rgba(7,26,51,.45)_100%)]" />
      <img ref={people} src={peopleImage} alt="International student and professionals preparing for their future abroad" className="pointer-events-none absolute bottom-0 right-[-12%] z-0 hidden h-[82%] w-auto object-contain opacity-90 drop-shadow-2xl md:block xl:right-[1%]" />
      <FlightJourney />

      <PageContainer className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-10 pt-32 sm:pb-12 lg:justify-center lg:pb-0 lg:pt-28">
        <div ref={content} className="max-w-[820px]">
          <div data-hero-detail className="mb-6 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[.24em] text-gold-light"><span className="h-px w-10 bg-gold" />Registered migration and education guidance</div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold uppercase leading-[.95] tracking-[-.028em]">
            {['Your journey.', 'Your future.', 'Without borders.'].map((line, index) => <span key={line} className="block overflow-hidden pb-[.13em]"><span data-hero-line className={`block ${index === 2 ? 'text-gold-light' : ''}`}>{line}</span></span>)}
          </h1>
          <p data-hero-detail className="mt-5 max-w-lg text-sm leading-6 text-white/65 sm:text-base sm:leading-7">Strategic migration and international education guidance for people ready to move with confidence.</p>
          <div data-hero-detail className="mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap"><Link to="/appointment" className="group inline-flex min-h-13 items-center justify-center gap-4 rounded-full bg-gold px-6 text-sm font-bold text-brand transition hover:bg-gold-light">Find your pathway <span className="transition group-hover:translate-x-1">→</span></Link><Link to="/countries" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white backdrop-blur transition hover:border-white/60 hover:bg-white/10">Explore destinations</Link></div>
        </div>
        <div data-hero-detail className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-4 lg:absolute lg:bottom-8 lg:left-10 lg:right-10 lg:mt-0 xl:left-auto xl:w-[710px]">{trust.map((item, index) => <div key={item} className="bg-brand/35 px-4 py-3"><span className="mr-2 text-gold">0{index + 1}</span><span className="text-[10px] font-bold uppercase tracking-[.12em] text-white/80">{item}</span></div>)}</div>
      </PageContainer>
      <div className="absolute bottom-9 right-8 z-20 hidden items-center gap-3 text-[9px] font-bold uppercase tracking-[.28em] text-white/45 xl:flex"><span>Scroll to explore</span><span className="h-12 w-px bg-gradient-to-b from-gold to-transparent" /></div>
    </section>
  );
}
