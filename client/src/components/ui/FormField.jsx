import { cn } from '../../utils/cn.js';

export function FormField({ label, name, error, hint, required, className, children, ...inputProps }) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  return (
    <label className={cn('block', className)} htmlFor={name}>
      <span className="mb-2 block text-sm font-semibold text-brand">{label}{required && <span className="ml-1 text-red-700">*</span>}</span>
      {children || <input id={name} name={name} aria-invalid={Boolean(error)} aria-describedby={describedBy} className="form-control" {...inputProps} />}
      {error ? <span id={`${name}-error`} className="mt-1.5 block text-sm text-red-700">{error.message || error}</span> : hint && <span id={`${name}-hint`} className="mt-1.5 block text-sm text-ink-muted">{hint}</span>}
    </label>
  );
}
