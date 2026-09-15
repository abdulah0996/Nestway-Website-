import { motion, useReducedMotion } from 'framer-motion';
import { PageContainer } from '../layout/PageContainer.jsx';

export function PublicHero({ eyebrow, title, accent, description, backgroundImage, children, compact = false }) {
  const reduceMotion = useReducedMotion();
  return (
    <section className={`relative isolate overflow-hidden bg-brand text-white ${compact ? 'min-h-[62svh]' : 'min-h-[76svh]'}`}>
      {backgroundImage && (
        <motion.img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 size-full object-cover opacity-55"
          initial={reduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(3,14,29,.97)_0%,rgba(7,26,51,.82)_52%,rgba(7,26,51,.35)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_30%,rgba(143,191,217,.16),transparent_30%)]" />
      <div className="absolute -right-32 top-20 -z-10 size-[34rem] rounded-full border border-white/10" />
      <PageContainer className={`flex items-end pb-14 pt-28 sm:pb-24 sm:pt-36 ${compact ? 'min-h-[62svh]' : 'min-h-[76svh]'}`}>
        <div className="max-w-5xl">
          <motion.p initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold uppercase tracking-[.25em] text-gold-light">{eyebrow}</motion.p>
          <div className="mt-6 overflow-hidden pb-2">
            <motion.h1 initial={reduceMotion ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: .85, ease: [.22, 1, .36, 1] }} className="max-w-5xl font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-.025em]">
              {title} {accent && <em className="font-medium text-gold-light">{accent}</em>}
            </motion.h1>
          </div>
          {description && <motion.p initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-8 max-w-2xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">{description}</motion.p>}
          {children && <motion.div initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45 }} className="mt-9">{children}</motion.div>}
        </div>
      </PageContainer>
    </section>
  );
}
