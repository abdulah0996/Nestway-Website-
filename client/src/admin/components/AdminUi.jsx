import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export function AdminPageHeader({ eyebrow, title, description, action }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#967719]">{eyebrow}</p><h1 className="mt-2 font-display text-4xl font-semibold leading-none text-[#0B1F3A] sm:text-5xl">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}</div>{action}</motion.div>;
}

export function AdminPanel({ children, className = '' }) {
  return <section className={`overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(11,31,58,.07)] ${className}`}>{children}</section>;
}

const statusTone = {
  new: 'bg-sky-100 text-sky-800', contacted: 'bg-violet-100 text-violet-800', follow_up: 'bg-amber-100 text-amber-800', documents_pending: 'bg-orange-100 text-orange-800', application_started: 'bg-indigo-100 text-indigo-800', submitted: 'bg-blue-100 text-blue-800', approved: 'bg-emerald-100 text-emerald-800', rejected: 'bg-red-100 text-red-800', pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800', completed: 'bg-emerald-100 text-emerald-800', cancelled: 'bg-red-100 text-red-800', published: 'bg-emerald-100 text-emerald-800', draft: 'bg-slate-100 text-slate-700', active: 'bg-emerald-100 text-emerald-800', inactive: 'bg-slate-100 text-slate-700',
};

export function StatusBadge({ status }) {
  const label = String(status || 'unknown').replaceAll('_', ' ');
  return <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.08em] ${statusTone[status] || 'bg-brand/7 text-brand'}`}>{label}</span>;
}

const priorityTone = { low: 'bg-slate-100 text-slate-600', normal: 'bg-blue-50 text-blue-700', high: 'bg-orange-50 text-orange-700', urgent: 'bg-red-50 text-red-700' };

export function PriorityBadge({ priority = 'normal' }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.07em] ${priorityTone[priority] || priorityTone.normal}`}>{priority}</span>;
}

function AnimatedNumber({ value }) {
  const reducedMotion = useReducedMotion();
  const number = Number(value) || 0;
  const count = useMotionValue(reducedMotion ? number : 0);
  const display = useTransform(count, (current) => Math.round(current).toLocaleString());
  useEffect(() => {
    if (reducedMotion) { count.set(number); return undefined; }
    const controls = animate(count, number, { duration: .75, ease: 'easeOut' });
    return () => controls.stop();
  }, [count, number, reducedMotion]);
  return <motion.span>{display}</motion.span>;
}

export function MetricCard({ label, value, detail, accent = false, index = 0, icon }) {
  const reducedMotion = useReducedMotion();
  return <motion.article initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06, duration: .45 }} whileHover={reducedMotion ? undefined : { y: -5 }} className={`group relative min-h-44 overflow-hidden rounded-3xl border p-5 shadow-[0_14px_35px_rgba(11,31,58,.07)] transition-shadow hover:shadow-[0_22px_45px_rgba(11,31,58,.13)] ${accent ? 'border-[#0B1F3A] bg-gradient-to-br from-[#0B1F3A] to-[#17375f] text-white' : 'border-slate-200/80 bg-gradient-to-br from-white to-slate-50 text-[#0B1F3A]'}`}><div className={`absolute -right-8 -top-8 size-28 rounded-full border ${accent ? 'border-[#D4AF37]/25' : 'border-[#D4AF37]/20'}`} /><div className="flex items-start justify-between"><p className={`text-[10px] font-bold uppercase tracking-[.16em] ${accent ? 'text-white/60' : 'text-slate-500'}`}>{label}</p>{icon && <span className={`grid size-10 place-items-center rounded-2xl ${accent ? 'bg-white/10 text-[#D4AF37]' : 'bg-[#0B1F3A]/[.06] text-[#0B1F3A]'}`}>{icon}</span>}</div><p className="mt-5 font-display text-4xl font-semibold sm:text-5xl"><AnimatedNumber value={value} /></p>{detail && <p className={`mt-2 text-xs ${accent ? 'text-white/55' : 'text-slate-500'}`}>{detail}</p>}</motion.article>;
}

export function AdminEmpty({ title = 'Nothing here yet', description = 'New records will appear here.' }) {
  return <div className="px-6 py-16 text-center"><span className="mx-auto block size-3 rounded-full bg-gold" /><h2 className="mt-5 font-display text-3xl font-semibold text-brand">{title}</h2><p className="mt-2 text-sm text-ink-muted">{description}</p></div>;
}

export function AdminError({ message, onRetry }) {
  return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert"><p>{message || 'This data could not be loaded.'}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-3 font-bold underline">Try again</button>}</div>;
}

export function TableFrame({ children }) {
  return <div className="max-h-[68vh] overflow-auto"><table className="w-full min-w-[1280px] border-separate border-spacing-0 text-left">{children}</table></div>;
}

export function TableSkeleton({ columns = 8, rows = 7 }) {
  return <div className="animate-pulse p-5" aria-label="Loading records"><div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(80px, 1fr))` }}>{Array.from({ length: columns * rows }, (_, index) => <span key={index} className={`rounded-xl bg-slate-100 ${index < columns ? 'h-5 bg-slate-200' : 'h-10'}`} />)}</div></div>;
}

export function DashboardSkeleton() {
  return <div className="animate-pulse space-y-8"><div className="h-12 w-72 rounded-xl bg-slate-200" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-44 rounded-3xl bg-white" />)}</div><div className="grid gap-5 xl:grid-cols-2"><div className="h-96 rounded-3xl bg-white" /><div className="h-96 rounded-3xl bg-white" /></div></div>;
}

export function AdminModal({ open, onClose, title, children }) {
  return <AnimatePresence>{open && <><motion.button type="button" aria-label="Close dialog" className="fixed inset-0 z-50 bg-[#07172d]/55 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} /><motion.div role="dialog" aria-modal="true" aria-labelledby="admin-modal-title" className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[88vh] max-w-2xl -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/50 bg-white p-6 shadow-2xl sm:p-8" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}><div className="flex items-center justify-between gap-5"><h2 id="admin-modal-title" className="font-display text-3xl font-semibold text-[#0B1F3A]">{title}</h2><button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-slate-200 text-xl text-slate-500" aria-label="Close">&times;</button></div><div className="mt-6">{children}</div></motion.div></>}</AnimatePresence>;
}

export const tableHeadClass = 'sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 px-4 py-4 text-[10px] font-bold uppercase tracking-[.13em] text-slate-500 backdrop-blur';
export const tableCellClass = 'border-b border-slate-100 px-4 py-4 align-middle text-sm text-[#0B1F3A]';

export function FieldLabel({ label, children }) {
  return <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[.14em] text-ink-muted">{label}</span>{children}</label>;
}

export const adminInputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1F3A] outline-none transition placeholder:text-slate-400 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:bg-slate-50';
