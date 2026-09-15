import { cn } from '../../utils/cn.js';

export function Card({ className, children, interactive = false, ...props }) {
  return (
    <div className={cn('rounded-2xl border border-brand/10 bg-white p-6 shadow-card', interactive && 'transition duration-300 hover:-translate-y-1 hover:shadow-card-hover', className)} {...props}>
      {children}
    </div>
  );
}
