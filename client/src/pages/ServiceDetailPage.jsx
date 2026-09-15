import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import panorama from '../assets/destinations-panorama.jpg';
import { ErrorState } from '../components/feedback/ErrorState.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { useFaqs } from '../hooks/queries/useFaqs.js';
import { useService } from '../hooks/queries/useServices.js';
import { useSeo } from '../hooks/useSeo.js';
import { serviceContent } from './services/serviceContent.js';
import { ServiceFaqs } from './services/ServiceFaqs.jsx';
import { ServicePageLoading } from './services/ServicePageLoading.jsx';

function Tick() {
  return <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-gold/15 text-sm font-bold text-gold-dark">✓</span>;
}

export function ServiceDetailPage() {
  const { slug } = useParams();
  const fallback = serviceContent[slug];
  const hero = useRef(null);
  const serviceQuery = useService(slug);
  const faqQuery = useFaqs({ service: serviceQuery.data?._id });
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const apiService = serviceQuery.data;
  const content = fallback ? {
    ...fallback,
    ...apiService,
    title: apiService?.name || fallback.title,
    imageUrl: apiService?.imageUrl || fallback.imageUrl,
    shortDescription: apiService?.shortDescription || fallback.shortDescription,
    overview: apiService?.description || fallback.overview,
  } : null;

  const apiFaqs = Array.isArray(faqQuery.data) ? faqQuery.data.filter((faq) => {
    const service = faq.service;
    return !service || service === apiService?._id || service?._id === apiService?._id || service?.slug === slug;
  }) : [];
  const faqs = apiFaqs.length ? apiFaqs : content?.faqs;

  useSeo({ title: content?.seo?.metaTitle || content?.title, description: content?.seo?.metaDescription || content?.shortDescription });

  if (serviceQuery.isPending) return <ServicePageLoading />;
  if (!content) return <PageContainer className="py-32"><ErrorState title="Service not found" message={serviceQuery.error?.message || 'This service is not available.'} onRetry={() => serviceQuery.refetch()} /></PageContainer>;

  return (
    <article>
      <section ref={hero} className="relative isolate min-h-[78svh] overflow-hidden bg-brand text-white">
        <motion.img style={{ y: imageY, objectPosition: `${content.position || '50%'} center` }} src={content.imageUrl || panorama} alt="" className="absolute -inset-y-[12%] left-0 -z-20 h-[124%] w-full scale-105 object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,14,29,.95)_0%,rgba(3,14,29,.78)_48%,rgba(3,14,29,.2)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand via-transparent to-brand/35" />
        <PageContainer className="flex min-h-[78svh] items-end pb-14 pt-36 sm:pb-20">
          <div className="max-w-4xl">
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold uppercase tracking-[.24em] text-gold-light">{content.kicker}</motion.p>
            <div className="mt-6 overflow-hidden"><motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: .85, ease: [.22, 1, .36, 1] }} className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-.028em]">{content.title}</motion.h1></div>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }} className="mt-8 max-w-2xl text-base leading-7 text-white/70 sm:text-xl sm:leading-8">{content.shortDescription}</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }} className="mt-8 flex flex-wrap gap-3"><Link to="/appointment" className="rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-brand transition hover:bg-gold-light">Book a consultation</Link><a href="#overview" className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10">Explore the pathway</a></motion.div>
          </div>
        </PageContainer>
      </section>

      <section id="overview" className="bg-cream py-24 sm:py-32">
        <PageContainer><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><Reveal><p className="eyebrow">A considered approach</p><p className="mt-5 font-display text-3xl font-semibold leading-tight text-brand sm:text-4xl">Your ambition deserves more than a checklist.</p></Reveal><Reveal delay={.1}><h2 className="font-display text-4xl font-semibold leading-[1.05] text-brand sm:text-5xl">Build the right case, from the beginning.</h2><p className="mt-7 max-w-3xl text-lg leading-8 text-ink-muted">{content.overview}</p></Reveal></div></PageContainer>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <PageContainer><Reveal><p className="eyebrow">Profile essentials</p><h2 className="display-title max-w-4xl">Is this pathway <em className="text-gold-dark">right for you?</em></h2></Reveal><div className="mt-14 grid gap-3 md:grid-cols-2">{content.eligibility.map((item, index) => <Reveal key={item} delay={index * .05}><div className="flex min-h-24 items-center gap-5 rounded-2xl border border-brand/10 bg-cream/55 p-5 transition hover:border-gold/50 hover:bg-cream"><Tick /><p className="font-medium leading-6 text-brand">{item}</p></div></Reveal>)}</div><p className="mt-7 text-xs leading-5 text-ink-muted">Eligibility is assessed against current program criteria and your individual circumstances.</p></PageContainer>
      </section>

      <section className="overflow-hidden bg-brand py-24 text-white sm:py-32">
        <PageContainer><Reveal><p className="eyebrow text-gold-light">The journey</p><h2 className="display-title max-w-4xl text-white">A complex process, <em className="text-gold-light">made navigable.</em></h2></Reveal><div className="relative mt-16"><div className="absolute bottom-0 left-5 top-0 w-px bg-white/15 md:bottom-auto md:left-0 md:right-0 md:top-5 md:h-px md:w-auto" /><div className="grid gap-10 md:grid-cols-5">{content.process.map((step, index) => <Reveal key={step.title} delay={index * .08}><div className="relative pl-16 md:pl-0"><span className="absolute left-0 top-0 z-10 grid size-10 place-items-center rounded-full border border-gold/60 bg-brand text-xs font-bold text-gold md:relative">0{index + 1}</span><h3 className="font-display text-3xl font-semibold md:mt-7">{step.title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{step.text}</p></div></Reveal>)}</div></div></PageContainer>
      </section>

      <section className="bg-cream py-24 sm:py-32">
        <PageContainer><div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr]"><Reveal><p className="eyebrow">Prepare with purpose</p><h2 className="display-title">Documents that tell <em className="text-gold-dark">one clear story.</em></h2><p className="mt-7 max-w-lg leading-7 text-ink-muted">The exact evidence depends on your destination and pathway. This is a practical starting point, not a final document list.</p></Reveal><div className="grid gap-px overflow-hidden rounded-3xl border border-brand/10 bg-brand/10 sm:grid-cols-2">{content.requirements.map((item, index) => <Reveal key={item} delay={index * .04} className="bg-white"><div className="flex min-h-32 flex-col justify-between p-6"><span className="text-xs font-bold text-gold-dark">0{index + 1}</span><p className="mt-5 font-display text-2xl font-semibold leading-tight text-brand">{item}</p></div></Reveal>)}</div></div></PageContainer>
      </section>

      <section className="bg-gold-light py-24 sm:py-32">
        <PageContainer><div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]"><Reveal><p className="eyebrow">Why this route</p><h2 className="display-title">Make every move <em className="text-gold-dark">intentional.</em></h2></Reveal><div className="grid gap-4 sm:grid-cols-2">{content.benefits.map((benefit, index) => <Reveal key={benefit} delay={index * .06}><div className="group min-h-52 rounded-3xl bg-cream p-7 transition duration-300 hover:-translate-y-1 hover:bg-white"><span className="text-xs font-bold text-gold-dark">Benefit 0{index + 1}</span><p className="mt-12 font-display text-3xl font-semibold leading-tight text-brand">{benefit}</p></div></Reveal>)}</div></div></PageContainer>
      </section>

      {faqs?.length > 0 && <ServiceFaqs items={faqs} />}

      <section className="relative isolate overflow-hidden bg-gold py-24 text-brand sm:py-32">
        <div className="absolute -bottom-56 -right-40 -z-10 size-[34rem] rounded-full border border-brand/15" /><div className="absolute -bottom-36 -right-20 -z-10 size-[24rem] rounded-full border border-brand/15" />
        <PageContainer><Reveal><p className="text-xs font-bold uppercase tracking-[.22em]">Your next step</p><h2 className="mt-6 max-w-5xl font-display text-4xl font-semibold leading-[1.02] tracking-[-.03em] sm:text-6xl">Let&rsquo;s make your global plan feel possible.</h2><Link to="/appointment" className="mt-10 inline-flex rounded-full bg-brand px-8 py-4 text-sm font-bold text-white transition hover:bg-brand-light">Book your consultation <span className="ml-4">&rarr;</span></Link></Reveal></PageContainer>
      </section>
    </article>
  );
}
