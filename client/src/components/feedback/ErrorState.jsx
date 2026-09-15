import { Button } from '../ui/Button.jsx';

export function ErrorState({ title = 'Something went wrong', message = 'We could not load this content. Please try again.', onRetry }) {
  return <div className="mx-auto max-w-xl rounded-[2rem] border border-red-900/10 bg-red-50 p-8 text-center sm:p-10" role="alert"><span className="mx-auto grid size-12 place-items-center rounded-full bg-red-900/5 font-display text-2xl text-red-800">!</span><h2 className="mt-5 font-display text-4xl font-semibold text-brand">{title}</h2><p className="mt-3 leading-7 text-ink-muted">{message}</p>{onRetry && <Button variant="outline" className="mt-7" onClick={onRetry}>Try again</Button>}</div>;
}
