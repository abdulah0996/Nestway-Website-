import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?._id || items[0]?.question || null);
  return (
    <div className="border-t border-brand/15">
      {items.map((item, index) => {
        const id = item._id || item.question;
        const open = id === openId;
        return (
          <div key={id} className="border-b border-brand/15">
            <button type="button" onClick={() => setOpenId(open ? null : id)} aria-expanded={open} className="flex w-full items-start gap-5 py-6 text-left sm:items-center sm:py-8">
              <span className="mt-1 text-xs font-bold text-gold-dark sm:mt-0">{String(index + 1).padStart(2, '0')}</span>
              <span className="flex-1 font-display text-2xl font-semibold leading-tight text-brand sm:text-3xl">{item.question}</span>
              <span aria-hidden="true" className={`grid size-9 shrink-0 place-items-center rounded-full border border-brand/15 text-xl text-brand transition ${open ? 'rotate-45 bg-brand text-white' : ''}`}>+</span>
            </button>
            <AnimatePresence initial={false}>
              {open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }} className="overflow-hidden"><p className="max-w-3xl pb-8 pl-10 pr-12 leading-7 text-ink-muted sm:pl-14">{item.answer}</p></motion.div>}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
