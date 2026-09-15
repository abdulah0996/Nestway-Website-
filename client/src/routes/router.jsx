import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AdminIndexRoute, AdminRoute, PermissionRoute } from '../admin/components/AdminRoute.jsx';
import { AdminLayout } from '../admin/layouts/AdminLayout.jsx';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { RouteErrorPage } from '../pages/RouteErrorPage.jsx';

const AdminLoginPage = lazy(() => import('../admin/pages/AdminLoginPage.jsx').then((module) => ({ default: module.AdminLoginPage })));
const AboutPage = lazy(() => import('../pages/AboutPage.jsx').then((module) => ({ default: module.AboutPage })));
const AppointmentPage = lazy(() => import('../pages/AppointmentPage.jsx').then((module) => ({ default: module.AppointmentPage })));
const BlogDetailPage = lazy(() => import('../pages/BlogDetailPage.jsx').then((module) => ({ default: module.BlogDetailPage })));
const BlogsPage = lazy(() => import('../pages/BlogsPage.jsx').then((module) => ({ default: module.BlogsPage })));
const CompanyProfilePage = lazy(() => import('../pages/CompanyProfilePage.jsx').then((module) => ({ default: module.CompanyProfilePage })));
const ContactPage = lazy(() => import('../pages/ContactPage.jsx').then((module) => ({ default: module.ContactPage })));
const CountriesPage = lazy(() => import('../pages/CountriesPage.jsx').then((module) => ({ default: module.CountriesPage })));
const CountryDetailPage = lazy(() => import('../pages/CountryDetailPage.jsx').then((module) => ({ default: module.CountryDetailPage })));
const FaqPage = lazy(() => import('../pages/FaqPage.jsx').then((module) => ({ default: module.FaqPage })));
const ServicesPage = lazy(() => import('../pages/ServicesPage.jsx').then((module) => ({ default: module.ServicesPage })));
const ServiceDetailPage = lazy(() => import('../pages/ServiceDetailPage.jsx').then((module) => ({ default: module.ServiceDetailPage })));
const SuccessStoriesPage = lazy(() => import('../pages/SuccessStoriesPage.jsx').then((module) => ({ default: module.SuccessStoriesPage })));
const TrainingPage = lazy(() => import('../pages/TrainingPage.jsx').then((module) => ({ default: module.TrainingPage })));
const UniversitiesPage = lazy(() => import('../pages/UniversitiesPage.jsx').then((module) => ({ default: module.UniversitiesPage })));
const DashboardPage = lazy(() => import('../admin/pages/DashboardPage.jsx').then((module) => ({ default: module.DashboardPage })));
const LeadsPage = lazy(() => import('../admin/pages/LeadManagementPage.jsx').then((module) => ({ default: module.LeadsPage })));
const AdminAppointmentsPage = lazy(() => import('../admin/pages/AppointmentsPage.jsx').then((module) => ({ default: module.AppointmentsPage })));
const ConsultantsPage = lazy(() => import('../admin/pages/ConsultantsPage.jsx').then((module) => ({ default: module.ConsultantsPage })));
const CmsManagerPage = lazy(() => import('../admin/pages/CmsManagerPage.jsx').then((module) => ({ default: module.CmsManagerPage })));
const MediaPage = lazy(() => import('../admin/pages/MediaPage.jsx').then((module) => ({ default: module.MediaPage })));
const ActivityPage = lazy(() => import('../admin/pages/ActivityPage.jsx').then((module) => ({ default: module.ActivityPage })));

function AdminSuspense({ children }) {
  return <Suspense fallback={<div className="grid min-h-[60vh] place-items-center bg-[#f4f1ea] text-xs font-bold uppercase tracking-[.16em] text-ink-muted">Loading secure workspace…</div>}>{children}</Suspense>;
}

function PublicSuspense({ children }) {
  return <Suspense fallback={<div className="grid min-h-[60vh] place-items-center bg-cream text-xs font-bold uppercase tracking-[.16em] text-ink-muted">Loading page&hellip;</div>}>{children}</Suspense>;
}

export const router = createBrowserRouter([{
  element: <PublicLayout />,
  errorElement: <RouteErrorPage />,
  children: [
    { index: true, element: <HomePage /> },
    { path: '/about', element: <PublicSuspense><AboutPage /></PublicSuspense> },
    { path: '/company-profile', element: <PublicSuspense><CompanyProfilePage /></PublicSuspense> },
    { path: '/success-stories', element: <PublicSuspense><SuccessStoriesPage /></PublicSuspense> },
    { path: '/services', element: <PublicSuspense><ServicesPage /></PublicSuspense> },
    { path: '/services/:slug', element: <PublicSuspense><ServiceDetailPage /></PublicSuspense> },
    { path: '/countries', element: <PublicSuspense><CountriesPage /></PublicSuspense> },
    { path: '/countries/:slug', element: <PublicSuspense><CountryDetailPage /></PublicSuspense> },
    { path: '/universities', element: <PublicSuspense><UniversitiesPage /></PublicSuspense> },
    { path: '/universities/:countrySlug', element: <PublicSuspense><UniversitiesPage /></PublicSuspense> },
    { path: '/blogs', element: <PublicSuspense><BlogsPage /></PublicSuspense> },
    { path: '/blogs/:slug', element: <PublicSuspense><BlogDetailPage /></PublicSuspense> },
    { path: '/appointment', element: <PublicSuspense><AppointmentPage /></PublicSuspense> },
    { path: '/contact', element: <PublicSuspense><ContactPage /></PublicSuspense> },
    { path: '/faq', element: <PublicSuspense><FaqPage /></PublicSuspense> },
    { path: '/training', element: <PublicSuspense><TrainingPage /></PublicSuspense> },
    { path: '/training/:courseSlug', element: <PublicSuspense><TrainingPage /></PublicSuspense> },
    { path: '*', element: <NotFoundPage /> },
  ],
}, {
  path: '/admin/login',
  element: <AdminSuspense><AdminLoginPage /></AdminSuspense>,
}, {
  path: '/admin',
  element: <AdminRoute><AdminLayout /></AdminRoute>,
  children: [
    { index: true, element: <AdminIndexRoute /> },
    { path: 'dashboard', element: <PermissionRoute section="dashboard"><AdminSuspense><DashboardPage /></AdminSuspense></PermissionRoute> },
    { path: 'leads', element: <PermissionRoute section="leads"><AdminSuspense><LeadsPage /></AdminSuspense></PermissionRoute> },
    { path: 'appointments', element: <PermissionRoute section="appointments"><AdminSuspense><AdminAppointmentsPage /></AdminSuspense></PermissionRoute> },
    { path: 'consultants', element: <PermissionRoute section="consultants"><AdminSuspense><ConsultantsPage /></AdminSuspense></PermissionRoute> },
    { path: 'services', element: <PermissionRoute section="core_cms"><AdminSuspense><CmsManagerPage resource="services" /></AdminSuspense></PermissionRoute> },
    { path: 'countries', element: <PermissionRoute section="core_cms"><AdminSuspense><CmsManagerPage resource="countries" /></AdminSuspense></PermissionRoute> },
    { path: 'blogs', element: <PermissionRoute section="core_cms"><AdminSuspense><CmsManagerPage resource="blogs" /></AdminSuspense></PermissionRoute> },
    { path: 'faqs', element: <PermissionRoute section="core_cms"><AdminSuspense><CmsManagerPage resource="faqs" /></AdminSuspense></PermissionRoute> },
    { path: 'testimonials', element: <PermissionRoute section="extended_cms"><AdminSuspense><CmsManagerPage resource="testimonials" /></AdminSuspense></PermissionRoute> },
    { path: 'universities', element: <PermissionRoute section="extended_cms"><AdminSuspense><CmsManagerPage resource="universities" /></AdminSuspense></PermissionRoute> },
    { path: 'offices', element: <PermissionRoute section="extended_cms"><AdminSuspense><CmsManagerPage resource="offices" /></AdminSuspense></PermissionRoute> },
    { path: 'media', element: <PermissionRoute section="media"><AdminSuspense><MediaPage /></AdminSuspense></PermissionRoute> },
    { path: 'activity', element: <PermissionRoute section="activity"><AdminSuspense><ActivityPage /></AdminSuspense></PermissionRoute> },
  ],
}]);
