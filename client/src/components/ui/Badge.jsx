import { cn } from '../../utils/cn.js';

export function Badge({ children, variant = 'gold', className }) {
  const styles = variant === 'navy' ? 'bg-brand/8 text-brand' : variant === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-gold/15 text-gold-dark';
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]', styles, className)}>{children}</span>;
}
