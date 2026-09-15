import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '../../components/feedback/LoadingState.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { adminHomeFor, canAccess } from '../utils/permissions.js';

export function AdminRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();
  if (isLoading) return <div className="grid min-h-screen place-items-center bg-[#f4f1ea]"><LoadingState label="Verifying secure session" /></div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

export function PermissionRoute({ section, children }) {
  const { user } = useAdminAuth();
  if (canAccess(user?.role, section)) return children;
  return <div className="grid min-h-[65vh] place-items-center"><div className="max-w-lg rounded-[2rem] border border-brand/10 bg-white p-10 text-center shadow-card"><span className="mx-auto grid size-14 place-items-center rounded-full bg-gold/15 text-xl text-gold-dark">!</span><h1 className="mt-6 font-display text-4xl font-semibold text-brand">Access is restricted.</h1><p className="mt-4 leading-7 text-ink-muted">Your role does not include permission for this area.</p><a href={adminHomeFor(user?.role)} className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white">Return to your workspace</a></div></div>;
}

export function AdminIndexRoute() {
  const { user } = useAdminAuth();
  return <Navigate to={adminHomeFor(user?.role)} replace />;
}
