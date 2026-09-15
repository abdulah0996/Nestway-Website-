import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer.jsx';

export function ServiceFaqs({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-white py-24 sm:py-32">
      <PageContainer>
        <div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="eyebrow">Good questions</p>
            <h2 className="display-title">Before you <em className="text-gold-dark">begin.</em></h2>
            <p className="mt-6 max-w-sm text-sm leading-6 text-ink-muted">General guidance to help you prepare. Individual requirements depend on your circumstances.</p>
          </div>
          <div className="border-t border-brand/15">
            {items.map((item, index) => {
              const question = item.question || item[0];
              const answer = item.answer || item[1];
              const expanded = open === index;
              return (
                <div key={item._id || question} className="border-b border-brand/15">
                  <button type="button" onClick={() => setOpen(expanded ? -1 : index)} aria-expanded={expanded} aria-controls={`faq-panel-${index}`} className="flex w-full items-center justify-between gap-6 py-7 text-left">
                    <span className="font-display text-2xl font-semibold text-brand sm:text-3xl">{question}</span>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full border border-brand/15 text-xl text-gold-dark transition ${expanded ? 'rotate-45 bg-brand text-white' : ''}`}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && <motion.div id={`faq-panel-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-2xl pb-7 pr-12 leading-7 text-ink-muted">{answer}</p></motion.div>}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
