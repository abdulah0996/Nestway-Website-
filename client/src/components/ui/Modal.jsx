import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId } from 'react';

export function Modal({ isOpen, onClose, title, children }) {
  const titleId = useId();
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-brand/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-xl rounded-3xl bg-cream p-6 shadow-2xl sm:p-8" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.2 }} onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 id={titleId} className="font-display text-3xl font-semibold text-brand">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close modal" className="grid size-10 place-items-center rounded-full text-2xl text-brand hover:bg-brand/5">&times;</button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
