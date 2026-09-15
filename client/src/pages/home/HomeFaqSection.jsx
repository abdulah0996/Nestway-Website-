import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Reveal } from '../../components/motion/Reveal.jsx';
import { FaqAccordion } from '../../components/public/FaqAccordion.jsx';

const fallbacks = [
  { _id: 'home-faq-1', question: 'Which immigration pathway is right for me?', answer: 'The right pathway depends on your destination, goals, qualifications, experience, finances and timing. A professional profile assessment helps identify realistic options and important gaps.' },
  { _id: 'home-faq-2', question: 'Can Nestway help with university selection and admission?', answer: 'Yes. Our education team can help compare destinations, universities, courses and intakes before guiding the admission and related visa process.' },
  { _id: 'home-faq-3', question: 'How early should I begin preparing?', answer: 'Begin as early as practical. Academic records, employment evidence, financial documents, translations and language testing can all require meaningful preparation time.' },
  { _id: 'home-faq-4', question: 'Can an immigration adviser guarantee approval?', answer: 'No responsible adviser can guarantee a government decision. Nestway focuses on honest eligibility assessment, coherent evidence and careful application preparation.' },
  { _id: 'home-faq-5', question: 'Are online consultations available?', answer: 'Yes. Nestway offers remote consultations alongside in-person appointments where office availability allows.' },
];

export function HomeFaqSection({ query }) {
  const live = Array.isArray(query.data) ? query.data.filter((item) => item.isPublished !== false) : [];
  const faqs = (live.length ? live : fallbacks).slice(0, 6);

  return (
    <section className="bg-cream py-24 sm:py-32">
      <PageContainer>
        <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
          <Reveal><p className="eyebrow">Frequently asked</p><h2 className="display-title">Clarity begins with <em className="text-gold-dark">the right question.</em></h2><p className="mt-6 max-w-md leading-7 text-ink-muted">Explore essential guidance, then speak with us about the details that make your situation unique.</p><Link to="/faq" className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-brand">Browse all answers <span className="text-gold-dark" aria-hidden="true">&rarr;</span></Link></Reveal>
          <div>{query.isPending ? <div className="space-y-3" role="status" aria-label="Loading frequently asked questions">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-white" />)}</div> : <FaqAccordion items={faqs} />}{query.isError && <p className="mt-5 text-sm text-ink-muted">Live FAQs are temporarily unavailable; showing essential guidance.</p>}</div>
        </div>
      </PageContainer>
    </section>
  );
}
