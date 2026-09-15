export function LoadingState({ label = 'Loading' }) {
  return <div className="flex min-h-64 flex-col items-center justify-center gap-5" role="status" aria-live="polite"><span className="relative grid size-12 place-items-center rounded-full border border-brand/10"><span className="size-8 animate-spin rounded-full border-2 border-brand/15 border-t-gold" /></span><span className="text-xs font-bold uppercase tracking-[.16em] text-ink-muted">{label}&hellip;</span></div>;
}
