import { PageContainer } from '../../components/layout/PageContainer.jsx';

export function ServicePageLoading() {
  return (
    <div role="status" aria-label="Loading service">
      <section className="min-h-[72vh] animate-pulse bg-brand">
        <PageContainer className="flex min-h-[72vh] items-end pb-16">
          <div className="w-full max-w-3xl">
            <div className="h-3 w-40 rounded bg-gold/30" />
            <div className="mt-8 h-20 max-w-2xl rounded bg-white/10" />
            <div className="mt-6 h-5 max-w-lg rounded bg-white/10" />
          </div>
        </PageContainer>
      </section>
      <PageContainer className="py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-44 animate-pulse rounded-3xl bg-brand/5" />)}
        </div>
      </PageContainer>
    </div>
  );
}
