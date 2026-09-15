import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { PageTransition } from '../components/motion/PageTransition.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export function FoundationPage({ title, description = 'This page is ready for its dedicated content and data integration in the next build phase.' }) {
  const params = useParams();
  const displayTitle = params.slug ? `${title}: ${params.slug.replaceAll('-', ' ')}` : title;
  useDocumentTitle(displayTitle);
  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(201,162,39,0.14),transparent_32%)]" />
        <PageContainer>
          <div className="max-w-3xl"><Badge>Page foundation</Badge><h1 className="mt-7 font-display text-5xl font-semibold capitalize leading-[0.98] tracking-[-0.035em] text-brand sm:text-7xl">{displayTitle}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-ink-muted">{description}</p></div>
        </PageContainer>
      </section>
    </PageTransition>
  );
}
