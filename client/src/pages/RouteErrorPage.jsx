import { useRouteError } from 'react-router-dom';
import { ErrorState } from '../components/feedback/ErrorState.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';

export function RouteErrorPage() {
  const error = useRouteError();
  return <PageContainer className="grid min-h-screen place-items-center py-20"><ErrorState message={error?.message || 'The application could not load this page.'} /></PageContainer>;
}
