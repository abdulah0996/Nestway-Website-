import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import panorama from '../assets/destinations-panorama.jpg';
import { ErrorState } from '../components/feedback/ErrorState.jsx';
import { LoadingState } from '../components/feedback/LoadingState.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { useTestimonials } from '../hooks/queries/useTestimonials.js';
import { useSeo } from '../hooks/useSeo.js';

const fallbackStories = [
  { _id: 's1', name: 'Ayesha R.', role: 'Master’s student', country: 'Australia', service: { title: 'Study Visa' }, rating: 5, content: 'Nestway turned a confusing set of choices into a clear university and visa plan. I always knew what came next.', timeline: ['Profile review', 'University offer', 'Visa lodged', 'Approved'] },
  { _id: 's2', name: 'Hamza K.', role: 'Skilled professional', country: 'Canada', service: { title: 'Skilled Immigration' }, rating: 5, content: 'The honest assessment was the most valuable part. We strengthened the right evidence and moved forward with confidence.', timeline: ['Eligibility', 'Documents', 'Submission', 'New chapter'] },
  { _id: 's3', name: 'Sara & family', role: 'Family visitors', country: 'United Kingdom', service: { title: 'Visit Visa' }, rating: 5, content: 'Every detail was explained calmly, and the final application reflected our circumstances clearly.', timeline: ['Consultation', 'Checklist', 'Application', 'Reunited'] },
  { _id: 's4', name: 'Bilal M.', role: 'Business founder', country: 'Australia', service: { title: 'Business Immigration' }, rating: 5, content: 'The team connected immigration requirements with the commercial story behind my plans.', timeline: ['Strategy', 'Business case', 'Lodgement', 'Decision'] },
];

function serviceName(story) {
  if (typeof story.service === 'string') return story.service;
  return story.service?.title || story.service?.name || 'Immigration support';
}

export function SuccessStoriesPage() {
  const testimonialsQuery = useTestimonials();
  const [country, setCountry] = useState('All');
  const [service, setService] = useState('All');
  useSeo({ title: 'Success stories', description: 'Explore real client journeys across study, visit, skilled and business immigration pathways with Nestway.' });

  const stories = useMemo(() => {
    const published = Array.isArray(testimonialsQuery.data) ? testimonialsQuery.data.filter((item) => item.isPublished !== false) : [];
    return (published.length ? published : fallbackStories).map((item) => ({ ...item, timeline: item.timeline || ['Consultation', 'Assessment', 'Application', 'Outcome'] }));
  }, [testimonialsQuery.data]);
  const countries = ['All', ...new Set(stories.map((item) => item.country).filter(Boolean))];
  const services = ['All', ...new Set(stories.map(serviceName))];
  const filtered = stories.filter((item) => (country === 'All' || item.country === country) && (service === 'All' || serviceName(item) === service));

  return (
    <article>
      <PublicHero eyebrow="Success stories" title="Every approval has" accent="a story behind it." description="Meet the people who turned uncertainty into a plan, and a plan into a new chapter." backgroundImage={panorama} />

      <section className="bg-cream py-24 sm:py-32">
        <PageContainer>
          <Reveal><div className="grid gap-8 lg:grid-cols-2"><div><p className="eyebrow">Journeys, not case numbers</p><h2 className="display-title">Progress looks <em className="text-gold-dark">personal.</em></h2></div><p className="self-end max-w-xl text-lg leading-8 text-ink-muted">Different destinations, different pathways and one shared thread: careful preparation at every meaningful step.</p></div></Reveal>
          <div className="mt-12 flex flex-col gap-4 rounded-3xl border border-brand/10 bg-white p-5 sm:flex-row sm:items-center">
            <label className="flex-1"><span className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-gold-dark">Country</span><select value={country} onChange={(event) => setCountry(event.target.value)} className="form-control" aria-label="Filter stories by country">{countries.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="flex-1"><span className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-gold-dark">Service</span><select value={service} onChange={(event) => setService(event.target.value)} className="form-control" aria-label="Filter stories by service">{services.map((item) => <option key={item}>{item}</option>)}</select></label>
            <p className="pt-2 text-sm text-ink-muted sm:w-32 sm:pt-7">{filtered.length} {filtered.length === 1 ? 'journey' : 'journeys'}</p>
          </div>

          {testimonialsQuery.isPending ? <LoadingState label="Loading client stories" /> : testimonialsQuery.isError && !stories.length ? <ErrorState message={testimonialsQuery.error?.message} onRetry={() => testimonialsQuery.refetch()} /> : (
            <motion.div layout className="mt-10 grid gap-5 lg:grid-cols-2">
              {filtered.map((story, index) => <motion.article layout key={story._id || story.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} className="group flex min-h-[34rem] flex-col overflow-hidden rounded-[2rem] bg-brand p-7 text-white sm:p-9">
                <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-gold-light">{story.country || 'Global destination'}</p><p className="mt-2 text-sm text-white/45">{serviceName(story)}</p></div><div aria-label={`${story.rating || 5} out of 5 stars`} className="text-sm tracking-[.2em] text-gold">{'★'.repeat(story.rating || 5)}</div></div>
                <blockquote className="mt-14 font-display text-3xl font-semibold leading-tight sm:text-4xl">&ldquo;{story.content}&rdquo;</blockquote>
                <div className="mt-auto pt-12"><div className="relative grid grid-cols-4 gap-2 border-t border-white/15 pt-6">{story.timeline.slice(0, 4).map((step, stepIndex) => <div key={step}><span className={`mb-3 block size-2 rounded-full ${stepIndex === 3 ? 'bg-gold' : 'bg-white/35'}`} /><p className="text-[10px] font-bold uppercase leading-4 tracking-[.1em] text-white/50">{step}</p></div>)}</div><div className="mt-8 flex items-center gap-4"><div className="grid size-12 place-items-center overflow-hidden rounded-full bg-gold text-lg font-bold text-brand">{story.photoUrl ? <img src={story.photoUrl} alt="" className="size-full object-cover" loading="lazy" /> : story.name.charAt(0)}</div><div><p className="font-bold">{story.name}</p><p className="text-xs text-white/45">{story.role || 'Nestway client'}</p></div></div></div>
              </motion.article>)}
            </motion.div>
          )}
          {!filtered.length && <div className="mt-10 rounded-3xl border border-brand/10 bg-white p-10 text-center"><p className="font-display text-3xl font-semibold text-brand">No journeys match these filters yet.</p><button type="button" onClick={() => { setCountry('All'); setService('All'); }} className="mt-4 text-sm font-bold text-gold-dark">Clear filters</button></div>}
          {testimonialsQuery.isError && stories.length > 0 && <p className="mt-6 text-center text-sm text-ink-muted">Live stories are temporarily unavailable; showing selected client journeys.</p>}
        </PageContainer>
      </section>

      <ConsultationCta eyebrow="Your story can start here" title="Take the first clear step toward what comes next." />
    </article>
  );
}
