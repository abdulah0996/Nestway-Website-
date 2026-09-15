import { Link } from 'react-router-dom';
import { PageContainer } from '../layout/PageContainer.jsx';
import { Reveal } from '../motion/Reveal.jsx';

export function ConsultationCta({ eyebrow = 'Your next move', title = 'Turn global ambition into a clear plan.', description }) {
  return (
    <section className="relative isolate overflow-hidden bg-gold py-24 text-brand sm:py-32">
      <div className="absolute -bottom-56 -right-40 -z-10 size-[36rem] rounded-full border border-brand/15" />
      <div className="absolute -bottom-36 -right-20 -z-10 size-[25rem] rounded-full border border-brand/15" />
      <PageContainer>
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[.22em]">{eyebrow}</p>
          <h2 className="mt-6 max-w-5xl font-display text-4xl font-semibold leading-[1.05] tracking-[-.025em] sm:text-5xl">{title}</h2>
          {description && <p className="mt-7 max-w-2xl leading-7 text-brand/70">{description}</p>}
          <Link to="/appointment" className="mt-10 inline-flex min-h-13 items-center rounded-full bg-brand px-8 py-4 text-sm font-bold text-white transition hover:bg-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">Book your consultation <span className="ml-4" aria-hidden="true">&rarr;</span></Link>
        </Reveal>
      </PageContainer>
    </section>
  );
}
