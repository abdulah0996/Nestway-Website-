import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-light focus-visible:outline-brand',
  accent: 'bg-gold text-brand hover:bg-gold-light focus-visible:outline-gold',
  outline: 'border border-brand/20 bg-transparent text-brand hover:border-brand hover:bg-brand/5 focus-visible:outline-brand',
  ghost: 'bg-transparent text-brand hover:bg-brand/5 focus-visible:outline-brand',
};

export function Button({ as: Component = 'button', to, variant = 'primary', size = 'md', className, children, ...props }) {
  const Element = to ? Link : Component;
  return (
    <Element
      to={to}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        size === 'sm' ? 'min-h-10 px-4 text-sm' : size === 'lg' ? 'min-h-14 px-7 text-base' : 'min-h-12 px-6 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  );
}
