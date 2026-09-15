import { useMemo, useState } from 'react';
import heroEarth from '../assets/hero-earth.jpg';
import { ErrorState } from '../components/feedback/ErrorState.jsx';
import { LoadingState } from '../components/feedback/LoadingState.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { ConsultationCta } from '../components/public/ConsultationCta.jsx';
import { FaqAccordion } from '../components/public/FaqAccordion.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { useFaqs } from '../hooks/queries/useFaqs.js';
import { useSeo } from '../hooks/useSeo.js';

const fallbackFaqs = [
  { _id: 'f1', category: 'Getting started', question: 'Which immigration pathway is right for me?', answer: 'The right pathway depends on your destination, purpose, qualifications, experience, finances and timing. A profile assessment helps identify suitable options and important gaps.' },
  { _id: 'f2', category: 'Getting started', question: 'What should I bring to an initial consultation?', answer: 'Bring a clear outline of your education, employment, travel history, family circumstances and goals. Previous applications or refusals should also be disclosed at the beginning.' },
  { _id: 'f3', category: 'Applications', question: 'How long does a visa application take?', answer: 'Timeframes vary by country, visa category, application quality and government processing conditions. We separate preparation time from official processing time when planning your journey.' },
  { _id: 'f4', category: 'Applications', question: 'Can Nestway guarantee a visa outcome?', answer: 'No responsible adviser can guarantee a government decision. We focus on honest eligibility assessment, coherent documentation and careful application preparation.' },
  { _id: 'f5', category: 'Study', question: 'Can you help me choose a university and course?', answer: 'Yes. We can help compare destinations, institutions, study levels and course options in the context of your academic history, budget and longer-term goals.' },
  { _id: 'f6', category: 'Documents', question: 'When should I start preparing documents?', answer: 'Start as early as practical. Academic records, employment evidence, financial documents, translations and tests can take time to assemble and verify.' },
  { _id: 'f7', category: 'Consultations', question: 'Are online consultations available?', answer: 'Yes. Nestway supports remote consultations as well as in-person meetings where office availability allows.' },
  { _id: 'f8', category: 'Consultations', question: 'What happens after I book?', answer: 'You receive a booking confirmation and the team reviews the information you provided. Any additional documents or preparation instructions can then be shared before the meeting.' },
];

export function FaqPage() {
  const faqQuery = useFaqs();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  useSeo({ title: 'Frequently asked questions', description: 'Clear answers to common questions about immigration, study, applications, documents and Nestway consultations.' });
  const faqs = useMemo(() => {
    const published = Array.isArray(faqQuery.data) ? faqQuery.data.filter((item) => item.isPublished !== false) : [];
    return published.length ? published : fallbackFaqs;
  }, [faqQuery.data]);
  const categories = ['All', ...new Set(faqs.map((faq) => faq.category).filter(Boolean))];
  const visible = faqs.filter((faq) => (category === 'All' || faq.category === category) && `${faq.question} ${faq.answer}`.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <article>
      <PublicHero eyebrow="Frequently asked questions" title="Clear answers for" accent="complex journeys." description="Start with the essentials, then speak with us about the details that make your situation unique." backgroundImage={heroEarth} compact />
      <section className="bg-cream py-20 sm:py-28"><PageContainer><div className="grid gap-4 rounded-3xl border border-brand/10 bg-white p-5 md:grid-cols-[1fr_auto] md:items-end"><label><span className="mb-2 block text-xs font-bold uppercase tracking-[.15em] text-gold-dark">Search questions</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search visas, documents, study..." className="form-control" /></label><div className="flex max-w-full gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`whitespace-nowrap rounded-full px-4 py-3 text-xs font-bold transition ${category === item ? 'bg-brand text-white' : 'bg-cream text-brand hover:bg-brand/10'}`}>{item}</button>)}</div></div>
        {faqQuery.isPending ? <LoadingState label="Loading answers" /> : faqQuery.isError && !faqs.length ? <ErrorState message={faqQuery.error?.message} onRetry={() => faqQuery.refetch()} /> : <div className="mt-12 grid gap-10 lg:grid-cols-[.45fr_1fr]"><div><p className="eyebrow">{visible.length} answers</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-brand">Everything starts with a better question.</h2><p className="mt-5 leading-7 text-ink-muted">General information cannot replace advice based on your circumstances, but it can help you prepare for a more useful conversation.</p></div><div>{visible.length ? <FaqAccordion key={`${category}-${search}`} items={visible} /> : <div className="rounded-3xl border border-brand/10 bg-white p-10 text-center"><h2 className="font-display text-4xl font-semibold text-brand">No matching answers.</h2><p className="mt-3 text-ink-muted">Try a broader keyword or ask our team directly.</p></div>}</div></div>}
        {faqQuery.isError && faqs.length > 0 && <p className="mt-8 text-center text-sm text-ink-muted">Live FAQs are temporarily unavailable; showing essential guidance.</p>}
      </PageContainer></section>
      <ConsultationCta eyebrow="Still have questions?" title="Ask the question behind the question." description="A focused consultation can turn general information into next steps shaped around you." />
    </article>
  );
}
