import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from '../../components/layout/Logo.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { canAccess, roleLabels } from '../utils/permissions.js';

const navigation = [
  ['Overview', [['Dashboard', '/admin/dashboard', 'dashboard']]],
  ['Operations', [['Leads', '/admin/leads', 'leads'], ['Appointments', '/admin/appointments', 'appointments'], ['Consultants', '/admin/consultants', 'consultants']]],
  ['Content', [['Services', '/admin/services', 'core_cms'], ['Countries', '/admin/countries', 'core_cms'], ['Blogs', '/admin/blogs', 'core_cms'], ['FAQs', '/admin/faqs', 'core_cms'], ['Testimonials', '/admin/testimonials', 'extended_cms'], ['Universities', '/admin/universities', 'extended_cms'], ['Offices', '/admin/offices', 'extended_cms']]],
  ['System', [['Media Library', '/admin/media', 'media'], ['Activity Logs', '/admin/activity', 'activity']]],
];

const titleMap = { dashboard: 'Dashboard', leads: 'Lead management', appointments: 'Appointments', consultants: 'Consultants', services: 'Services CMS', countries: 'Countries CMS', blogs: 'Blog CMS', faqs: 'FAQ CMS', testimonials: 'Testimonials CMS', universities: 'Universities CMS', offices: 'Offices CMS', media: 'Media library', activity: 'Activity logs' };

function Sidebar({ onNavigate }) {
  const { user } = useAdminAuth();
  return <div className="flex h-full flex-col bg-gradient-to-b from-[#0B1F3A] to-[#061326] text-white"><div className="border-b border-white/10 px-6 py-6"><Logo light /><div className="mt-5 flex items-center gap-2"><span className="size-2 rounded-full bg-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,.65)]" /><p className="text-[9px] font-bold uppercase tracking-[.22em] text-white/45">CRM workspace</p></div></div><nav className="flex-1 overflow-y-auto px-4 py-6">{navigation.map(([group, items]) => { const visible = items.filter(([, , section]) => canAccess(user?.role, section)); if (!visible.length) return null; return <div key={group} className="mb-7"><p className="px-3 text-[9px] font-bold uppercase tracking-[.18em] text-white/25">{group}</p><div className="mt-2 space-y-1">{visible.map(([label, to]) => <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${isActive ? 'bg-white text-[#0B1F3A] shadow-lg shadow-black/10' : 'text-white/58 hover:bg-white/[.07] hover:text-white'}`}><span className="grid size-7 place-items-center rounded-lg bg-current/5"><span className="size-1.5 rounded-full bg-[#D4AF37] opacity-80" /></span>{label}</NavLink>)}</div></div>; })}</nav><div className="border-t border-white/10 p-4"><Link to="/" className="flex items-center justify-between rounded-xl px-3 py-3 text-xs font-bold text-white/50 transition hover:bg-white/[.06] hover:text-white"><span>View public website</span><span aria-hidden="true">↗</span></Link></div></div>;
}

export function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const section = location.pathname.split('/').filter(Boolean).at(-1) || 'dashboard';
  return <div className="min-h-screen bg-[#F4F6F8] text-ink"><aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block"><Sidebar /></aside><AnimatePresence>{mobileOpen && <><motion.button aria-label="Close navigation" className="fixed inset-0 z-40 bg-[#0B1F3A]/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} /><motion.aside className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}><Sidebar onNavigate={() => setMobileOpen(false)} /></motion.aside></>}</AnimatePresence><div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-7 lg:px-9"><div className="flex items-center gap-4"><button type="button" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-[#0B1F3A] lg:hidden" aria-label="Open navigation"><span className="text-xl">☰</span></button><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#967719]">Nestway CRM</p><p className="mt-1 font-display text-xl font-semibold text-[#0B1F3A]">{titleMap[section] || 'Administration'}</p></div></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold text-[#0B1F3A]">{user?.firstName} {user?.lastName}</p><p className="text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">{roleLabels[user?.role] || user?.role}</p></div><span className="grid size-10 place-items-center rounded-full bg-[#0B1F3A] font-bold text-[#D4AF37]">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span><button type="button" onClick={logout} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0B1F3A] transition hover:border-[#D4AF37]">Log out</button></div></header><main className="mx-auto max-w-[1680px] p-4 sm:p-7 lg:p-9"><Outlet /></main></div></div>;
}
