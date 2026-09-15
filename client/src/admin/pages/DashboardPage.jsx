import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSeo } from '../../hooks/useSeo.js';
import { AdminError, AdminPageHeader, AdminPanel, DashboardSkeleton, MetricCard, StatusBadge } from '../components/AdminUi.jsx';
import { getAppointments, getDashboard, getLeads } from '../services/adminApi.js';

const appointmentColors = { pending: '#D4AF37', confirmed: '#3b82f6', completed: '#10b981', cancelled: '#ef4444' };

function MetricIcon({ type }) {
  const paths = {
    leads: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    new: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
    follow: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /><path d="M8 9h8M8 13h5" /></>,
    application: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5M10 13h5M10 17h5" /></>,
    approved: <><path d="M20 6 9 17l-5-5" /></>,
  };
  return <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

function LeadsChart({ leads }) {
  const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - (6 - index)); return date; });
  const values = days.map((day) => leads.filter((lead) => new Date(lead.createdAt).toDateString() === day.toDateString()).length);
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${28 + index * 72},${150 - (value / max) * 105}`).join(' ');
  return <div><svg viewBox="0 0 490 180" className="h-52 w-full" role="img" aria-label="Leads created during the last seven days"><defs><linearGradient id="lead-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#D4AF37" stopOpacity=".28" /><stop offset="1" stopColor="#D4AF37" stopOpacity="0" /></linearGradient></defs>{[45, 80, 115, 150].map((y) => <line key={y} x1="28" y1={y} x2="460" y2={y} stroke="#0B1F3A" strokeOpacity=".08" />)}<polygon points={`28,150 ${points} 460,150`} fill="url(#lead-area)" /><motion.polyline points={points} fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} />{values.map((value, index) => <g key={days[index].toISOString()}><circle cx={28 + index * 72} cy={150 - (value / max) * 105} r="4" fill="#0B1F3A" /><text x={28 + index * 72} y="174" textAnchor="middle" fontSize="9" fill="#64748b">{days[index].toLocaleDateString('en', { weekday: 'short' })}</text></g>)}</svg><div className="flex justify-between text-xs text-slate-500"><span>Last 7 days</span><span className="font-bold text-[#0B1F3A]">{values.reduce((sum, value) => sum + value, 0)} new leads</span></div></div>;
}

function AppointmentChart({ appointments }) {
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const counts = Object.fromEntries(statuses.map((status) => [status, appointments.filter((item) => item.status === status).length]));
  const total = Math.max(appointments.length, 1);
  let offset = 0;
  return <div className="grid items-center gap-8 sm:grid-cols-[12rem_1fr]"><div className="relative mx-auto size-44"><svg viewBox="0 0 120 120" className="-rotate-90"><circle cx="60" cy="60" r="46" fill="none" stroke="#071a33" strokeOpacity=".07" strokeWidth="13" />{statuses.map((status) => { const length = counts[status] / total * 289; const element = <circle key={status} cx="60" cy="60" r="46" fill="none" stroke={appointmentColors[status]} strokeWidth="13" strokeDasharray={`${length} ${289 - length}`} strokeDashoffset={-offset} />; offset += length; return element; })}</svg><div className="absolute inset-0 grid place-items-center text-center"><div><p className="font-display text-4xl font-semibold text-brand">{appointments.length}</p><p className="text-[9px] font-bold uppercase tracking-[.14em] text-ink-muted">Bookings</p></div></div></div><div className="space-y-4">{statuses.map((status) => <div key={status} className="flex items-center justify-between"><span className="flex items-center gap-3 text-sm capitalize text-ink-muted"><span className="size-2.5 rounded-full" style={{ backgroundColor: appointmentColors[status] }} />{status}</span><strong className="text-brand">{counts[status]}</strong></div>)}</div></div>;
}

function CountryChart({ leads }) {
  const counts = leads.reduce((map, lead) => { const country = typeof lead.interestedCountry === 'string' ? 'Other' : lead.interestedCountry?.name || 'Not specified'; map[country] = (map[country] || 0) + 1; return map; }, {});
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = Math.max(...rows.map(([, count]) => count), 1);
  if (!rows.length) return <p className="py-16 text-center text-sm text-ink-muted">Country interest will appear as leads arrive.</p>;
  return <div className="space-y-5">{rows.map(([country, count], index) => <div key={country}><div className="mb-2 flex justify-between text-xs"><span className="font-bold text-brand">{country}</span><span className="text-ink-muted">{count}</span></div><div className="h-2 overflow-hidden rounded-full bg-brand/7"><motion.div initial={{ width: 0 }} animate={{ width: `${count / max * 100}%` }} transition={{ delay: index * .08, duration: .65 }} className="h-full rounded-full bg-gradient-to-r from-brand to-gold" /></div></div>)}</div>;
}

export function DashboardPage() {
  useSeo({ title: 'Admin dashboard', description: 'Nestway administration overview.' });
  const query = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: async () => { const [stats, leadData, appointments] = await Promise.all([getDashboard(), getLeads({ limit: 100 }), getAppointments()]); return { stats, leads: leadData.items || [], appointments: appointments || [] }; } });
  if (query.isPending) return <DashboardSkeleton />;
  if (query.isError) return <AdminError message={query.error?.message} onRetry={() => query.refetch()} />;
  const { stats, leads, appointments } = query.data;
  const cards = [
    ['Total Leads', stats.totalLeads, 'All enquiries', 'leads', true],
    ['New Leads', stats.newLeads, `${stats.newLeadsToday} received today`, 'new'],
    ['Follow Ups', stats.followUps, 'Active conversations', 'follow'],
    ['Applications Started', stats.applicationsStarted ?? stats.applications, 'Active application preparation', 'application'],
    ['Approved Cases', stats.approvedCases, 'Successful outcomes', 'approved'],
  ];
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8"><AdminPageHeader eyebrow="CRM command centre" title="Pipeline overview" description="A live view of client demand, application progress and consultation activity." action={<button type="button" onClick={() => query.refetch()} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-[#0B1F3A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37]">Refresh data</button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([label, value, detail, icon, accent], index) => <MetricCard key={label} label={label} value={value} detail={detail} icon={<MetricIcon type={icon} />} accent={accent} index={index} />)}</div><div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><AdminPanel className="p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#967719]">Acquisition</p><h2 className="mt-2 font-display text-3xl font-semibold text-[#0B1F3A]">Lead growth</h2></div><Link to="/admin/leads" className="text-xs font-bold text-[#0B1F3A]">View pipeline &rarr;</Link></div><div className="mt-7"><LeadsChart leads={leads} /></div></AdminPanel><AdminPanel className="p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#967719]">Operations</p><h2 className="mt-2 font-display text-3xl font-semibold text-[#0B1F3A]">Appointment status</h2><div className="mt-8"><AppointmentChart appointments={appointments} /></div></AdminPanel></div><div className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]"><AdminPanel className="p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#967719]">Audience</p><h2 className="mt-2 font-display text-3xl font-semibold text-[#0B1F3A]">Country interest</h2><div className="mt-7"><CountryChart leads={leads} /></div></AdminPanel><AdminPanel className="p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#967719]">Latest activity</p><h2 className="mt-2 font-display text-3xl font-semibold text-[#0B1F3A]">Recent enquiries</h2></div><Link to="/admin/leads" className="text-xs font-bold text-[#0B1F3A]">View all &rarr;</Link></div><div className="mt-6 divide-y divide-slate-100">{leads.slice(0, 5).map((lead) => <div key={lead._id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate text-sm font-bold text-[#0B1F3A]">{lead.firstName} {lead.lastName}</p><p className="mt-1 truncate text-xs text-slate-500">{lead.email}</p></div><StatusBadge status={lead.status} /></div>)}</div></AdminPanel></div></motion.div>;
}
