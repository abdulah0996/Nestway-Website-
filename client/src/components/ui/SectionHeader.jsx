import { cn } from '../../utils/cn.js';

export function SectionHeader({ eyebrow, title, description, align = 'left', className }) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gold-dark">{eyebrow}</p>}
      <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-brand sm:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-7 text-ink-muted sm:text-lg">{description}</p>}
    </div>
  );
}
