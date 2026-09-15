import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import earthImage from '../../assets/hero-earth.jpg';
import peopleImage from '../../assets/hero-people-optimized.png';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { FlightJourney } from './FlightJourney.jsx';
import { JourneyIcon } from './JourneyIcon.jsx';

gsap.registerPlugin(ScrollTrigger);

const trust = [
  { icon: 'compass', title: 'Your goals, first', detail: 'Personalised pathways' },
  { icon: 'file', title: 'Clarity at every step', detail: 'Application guidance' },
  { icon: 'globe', title: 'Connected support', detail: 'Pakistan & Australia' },
  { icon: 'shield', title: 'Registered expertise', detail: 'MARN 2519006' },
];

export function HeroSection() {
  const section = useRef(null);
  const earth = useRef(null);
  const people = useRef(null);
  const content = useRef(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero-line]', { yPercent: 110, opacity: 0, duration: .9, stagger: .1 })
        .from('[data-hero-detail]', { y: 12, opacity: 0, duration: .6, stagger: .06 }, '-=.4');
    }, section);
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to(earth.current, { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to(people.current, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: 1.2 } });
      gsap.to(content.current, { yPercent: 12, opacity: .2, ease: 'none', scrollTrigger: { trigger: section.current, start: '35% top', end: 'bottom top', scrub: true } });
    }, section);
    return () => media.revert();
  }, []);

  return (
    <section ref={section} className="hero hero-refined relative isolate overflow-hidden bg-brand text-white">
      <img ref={earth} src={earthImage} alt="" className="hero-earth" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-flight"><FlightJourney /></div>
      <PageContainer className="hero-layout relative z-10">
        <div ref={content} className="hero-copy">
          <p data-hero-detail className="hero-kicker"><span />Your next chapter starts here</p>
          <h1 className="hero-title">
            {['Your journey.', 'Your future.', 'Without borders.'].map((line, index) => <span key={line} className="block overflow-hidden pb-[.12em]"><span data-hero-line className={`block ${index === 2 ? 'text-gold-light' : ''}`}>{line}</span></span>)}
          </h1>
          <p data-hero-detail className="hero-description">From your first question to your next destination. Personal migration and education guidance, with a clear plan to move forward.</p>
          <div data-hero-detail className="hero-actions">
            <Link to="/appointment" className="hero-primary">Find your pathway <JourneyIcon name="arrow" /></Link>
            <Link to="/countries" className="hero-secondary">Explore destinations <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="hero-portrait">
          <div className="hero-portrait-orbit" aria-hidden="true" />
          <img ref={people} src={peopleImage} alt="International student and professionals looking ahead to their future abroad" className="hero-people" />
          <div className="hero-portrait-caption"><span className="hero-caption-dot" /><span>Big ambitions. Personal guidance.</span></div>
        </div>
        <div data-hero-detail className="hero-assurances">
          {trust.map((item) => <div key={item.title} className="hero-assurance"><JourneyIcon name={item.icon} /><div><p>{item.title}</p><span>{item.detail}</span></div></div>)}
        </div>
      </PageContainer>
    </section>
  );
}
