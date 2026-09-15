import { PageContainer } from '../../components/layout/PageContainer.jsx';

export function CountryPageLoading() {
  return <div role="status" aria-label="Loading destination"><section className="min-h-[78vh] animate-pulse bg-brand"><PageContainer className="flex min-h-[78vh] items-end pb-16"><div className="w-full max-w-4xl"><div className="h-3 w-48 rounded bg-gold/30" /><div className="mt-8 h-24 max-w-3xl rounded bg-white/10" /><div className="mt-6 h-5 max-w-xl rounded bg-white/10" /></div></PageContainer></section><PageContainer className="py-24"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="h-56 animate-pulse rounded-3xl bg-brand/5" />)}</div></PageContainer></div>;
}
