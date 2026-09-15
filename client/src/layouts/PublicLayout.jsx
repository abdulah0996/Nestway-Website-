import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Footer } from '../components/layout/Footer.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';

export function PublicLayout() {
  return <div className="public-site flex min-h-screen flex-col"><Navbar /><main className="flex-1"><Outlet /></main><Footer /><ScrollRestoration /></div>;
}
