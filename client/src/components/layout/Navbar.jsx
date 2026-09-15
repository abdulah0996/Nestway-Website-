import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Logo } from './Logo.jsx';
import { PageContainer } from './PageContainer.jsx';

const links = [
  { label: 'Home', to: '/', end: true },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Company Profile', to: '/company-profile' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Blog', to: '/blogs' },
];

const searchablePages = [
  ...links,
  { label: 'Appointment', to: '/appointment', description: 'Book a consultation' },
  { label: 'Destinations', to: '/countries', description: 'Explore countries and pathways' },
  { label: 'Universities', to: '/universities', description: 'Browse partner university options' },
  { label: 'Success Stories', to: '/success-stories', description: 'Read client journeys' },
  { label: 'Training & Certification', to: '/training', description: 'IELTS, TOEFL, OET and citizenship preparation' },
  { label: 'Frequently Asked Questions', to: '/faq', description: 'Find clear answers' },
];

function hasDarkHero(pathname) {
  if (pathname === '/services' || pathname === '/countries') return false;
  return pathname === '/' || ['/about', '/company-profile', '/success-stories', '/blogs', '/contact', '/appointment', '/universities', '/faq', '/training'].some((path) => pathname === path || pathname.startsWith(`${path}/`)) || pathname.startsWith('/services/') || pathname.startsWith('/countries/');
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); setSearchOpen(false); setQuery(''); }, [location.pathname]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') { setOpen(false); setSearchOpen(false); } };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = searchOpen || open ? 'hidden' : '';
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = ''; };
  }, [open, searchOpen]);

  const heroRoute = hasDarkHero(location.pathname);
  const overlay = heroRoute && !scrolled && !open;
  const results = useMemo(() => searchablePages.filter((page) => `${page.label} ${page.description || ''}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const navLink = ({ label, to, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `relative py-2 text-[13px] font-semibold transition after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all ${isActive ? 'text-gold after:w-full' : `${overlay ? 'text-white/80' : 'text-brand'} after:w-0 hover:text-gold hover:after:w-full`}`}>{label}</NavLink>;

  return (
    <>
      <header className={`z-40 w-full transition-all duration-500 ${heroRoute ? 'fixed top-0' : 'sticky top-0'} ${overlay ? 'border-b border-white/10 bg-transparent' : 'border-b border-brand/8 bg-cream/95 shadow-sm backdrop-blur-xl'}`}>
        <PageContainer className="flex h-[4.5rem] items-center justify-between sm:h-20">
          <Logo light={overlay} />
          <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">{links.map(navLink)}</nav>
          <div className="hidden items-center gap-3 xl:flex"><button type="button" onClick={() => setSearchOpen(true)} aria-label="Search Nestway website" className={`grid size-10 place-items-center rounded-full border transition hover:border-gold hover:text-gold ${overlay ? 'border-white/20 text-white' : 'border-brand/15 text-brand'}`}><SearchIcon /></button><Button to="/appointment" variant="accent" size="sm">Appointment</Button></div>
          <div className="flex items-center gap-2 xl:hidden"><button type="button" onClick={() => setSearchOpen(true)} aria-label="Search Nestway website" className={`grid size-10 place-items-center rounded-full border ${overlay ? 'border-white/25 text-white' : 'border-brand/15 text-brand'}`}><SearchIcon /></button><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} className={`grid size-10 place-items-center rounded-full border sm:size-11 ${overlay ? 'border-white/25' : 'border-brand/15'}`}><span className="sr-only">Menu</span><span className="relative block h-4 w-5">{[0, 1, 2].map((line) => <span key={line} className={`absolute left-0 block h-px w-5 transition ${overlay ? 'bg-white' : 'bg-brand'} ${open && line === 0 ? 'top-2 rotate-45' : open && line === 1 ? 'top-2 opacity-0' : open && line === 2 ? 'top-2 -rotate-45' : line === 0 ? 'top-0' : line === 1 ? 'top-2' : 'top-4'}`} />)}</span></button></div>
        </PageContainer>
        <AnimatePresence>{open && <motion.nav id="mobile-menu" aria-label="Mobile navigation" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-brand/8 bg-cream px-4 py-4 shadow-xl xl:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><div className="mx-auto flex max-w-[1240px] flex-col"><div className="grid gap-1">{links.map(({ label, to, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `rounded-xl px-4 py-3 text-base font-semibold ${isActive ? 'bg-brand text-white' : 'text-brand hover:bg-brand/5'}`}>{label}</NavLink>)}</div><Button to="/appointment" variant="accent" className="mt-4">Appointment</Button></div></motion.nav>}</AnimatePresence>
      </header>

      <AnimatePresence>{searchOpen && <motion.div className="fixed inset-0 z-50 overflow-y-auto bg-brand/92 px-5 py-8 text-white backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Website search"><PageContainer><div className="flex justify-end"><button type="button" onClick={() => setSearchOpen(false)} className="grid size-12 place-items-center rounded-full border border-white/20 text-2xl" aria-label="Close search">&times;</button></div><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl pb-16 pt-10"><p className="text-xs font-bold uppercase tracking-[.22em] text-gold-light">Search Nestway</p><label htmlFor="site-search" className="sr-only">Search pages</label><div className="mt-5 flex items-center border-b border-white/25 pb-4"><input id="site-search" autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" className="min-w-0 flex-1 bg-transparent font-display text-4xl font-semibold outline-none placeholder:text-white/25 sm:text-6xl" /><SearchIcon /></div><div className="mt-10 grid gap-3 sm:grid-cols-2">{results.map((page) => <NavLink key={page.to} to={page.to} onClick={() => setSearchOpen(false)} className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-gold/50 hover:bg-white/10"><span className="font-display text-2xl font-semibold">{page.label}</span><span className="mt-2 block text-sm text-white/45">{page.description || `Open the ${page.label} page`}</span><span className="mt-5 block text-sm font-bold text-gold-light">Open page <span aria-hidden="true">&rarr;</span></span></NavLink>)}</div>{!results.length && <p className="mt-10 font-display text-3xl text-white/50">No matching pages. Try a broader search.</p>}</motion.div></PageContainer></motion.div>}</AnimatePresence>
    </>
  );
}
