import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';

const fallbacks = [
  { _id: 'home-story-1', name: 'Ayesha R.', role: 'Master’s student', country: 'Australia', rating: 5, content: 'Nestway turned a confusing set of choices into a clear university and visa plan. I always knew what came next.' },
  { _id: 'home-story-2', name: 'Hamza K.', role: 'Skilled professional', country: 'Canada', rating: 5, content: 'The honest assessment was the most valuable part. We strengthened the right evidence and moved forward with confidence.' },
  { _id: 'home-story-3', name: 'Sara & family', role: 'Family visitors', country: 'United Kingdom', rating: 5, content: 'Every detail was explained calmly, and the final application reflected our circumstances clearly.' },
];

export function TestimonialsSection({ query }) {
  const live = Array.isArray(query.data) ? query.data.filter((item) => item.isPublished !== false) : [];
  const testimonials = (live.length ? live : fallbacks).slice(0, 3);

  return (
    <section className="overflow-hidden bg-brand py-24 text-white sm:py-32">
      <PageContainer>
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <Reveal><p className="eyebrow text-gold-light">Client perspective</p><h2 className="display-title max-w-4xl text-white">Plans become milestones. <em className="text-gold-light">Milestones become stories.</em></h2></Reveal>
          <Reveal delay={.08}><Link to="/success-stories" className="inline-flex items-center gap-3 text-sm font-bold text-white">View success stories <span className="text-gold" aria-hidden="true">&rarr;</span></Link></Reveal>
        </div>

        {query.isPending ? <div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-3" role="status" aria-label="Loading client stories">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-[2rem] bg-white/[.06] sm:h-96" />)}</div> : <div className="mobile-snap-row -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mt-14 md:mx-0 md:grid md:grid-cols-2 md:px-0 lg:grid-cols-3">{testimonials.map((story, index) => <motion.figure key={story._id || story.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .05, duration: .45 }} whileHover={{ y: -3 }} className="mobile-snap-card mobile-snap-card--testimonial flex min-h-[20rem] snap-center flex-col rounded-[2rem] border border-white/15 bg-white/[.07] p-6 shadow-card md:min-h-[23rem] md:p-8"><div className="text-xs tracking-[.14em] text-gold-light" aria-label={`${story.rating || 5} out of 5 stars`}>{'★'.repeat(story.rating || 5)}</div><blockquote className="mt-7 font-display text-[1.35rem] font-medium leading-[1.4] sm:mt-9 sm:text-[1.55rem]">&ldquo;{story.content}&rdquo;</blockquote><figcaption className="mt-auto flex items-center gap-4 border-t border-white/15 pt-6 sm:pt-7"><div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-white/20 bg-gold-light text-sm font-bold text-brand sm:size-12">{story.photoUrl ? <img src={story.photoUrl} alt={`${story.name} profile`} className="size-full object-cover" loading="lazy" /> : story.name.charAt(0)}</div><div className="min-w-0"><p className="font-semibold">{story.name}</p><p className="mt-1 text-xs text-white/55">{story.role || 'Nestway client'}{story.country ? ` · ${story.country}` : ''}</p></div></figcaption></motion.figure>)}</div>}
        {query.isError && <p className="mt-6 text-sm text-white/45">Live testimonials are temporarily unavailable; showing selected client journeys.</p>}
      </PageContainer>
    </section>
  );
}
