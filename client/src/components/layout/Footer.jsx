import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo.jsx';
import { PageContainer } from './PageContainer.jsx';

const socialLinks = [
  ['f', 'Facebook', 'https://www.facebook.com/share/18xTruc6fZ/'], ['ig', 'Instagram', 'https://www.instagram.com/nestwayimmigration?igsh=Nmh2aWphcjZ4ODUw'],
  ['in', 'LinkedIn', 'https://www.linkedin.com/company/nestway-immigration'], ['yt', 'YouTube', 'https://youtube.com/@nestwayimmigration?si=vCzOhYfYpkl53gOu'],
  ['tt', 'TikTok', 'https://www.tiktok.com/@nestwayimmigration'],
];

const quickLinks = [
  ['Home', '/'], ['About Us', '/about'], ['Services', '/services'], ['Appointment', '/appointment'],
  ['Contact Us', '/contact'], ['Company Profile', '/company-profile'],
];

const officeLinks = [
  ['Pakistan', 'Plaza A, Building 148, Near Dolmen Mall, DHA Phase 6, Lahore, Pakistan', 'https://maps.google.com/?q=Plaza+A+Building+148+Near+Dolmen+Mall+DHA+Phase+6+Lahore+Pakistan'],
  ['Australia', '8/238 Prospect Hwy, Seven Hills, NSW 2147, Australia', 'https://maps.google.com/?q=8%2F238+Prospect+Hwy+Seven+Hills+NSW+2147+Australia'],
  ['UK', '5/4 West Montgomery Place, Edinburgh, EH7 5HA', 'https://maps.google.com/?q=5%2F4+West+Montgomery+Place+Edinburgh+EH7+5HA'],
];

const contactLinks = [
  ['Pakistan', '+92 321 1533111', 'tel:+923211533111'], ['Australia', '+61 435 020 639', 'tel:+61435020639'],
  ['UK', '+44 7577 329727', 'tel:+447577329727'], ['USA', '+1 586 927 5596', 'tel:+15869275596'],
  ['Email', 'info@nestwayimmigration.com', 'mailto:info@nestwayimmigration.com'],
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const subscribe = (event) => { event.preventDefault(); if (!email) return; setSubscribed(true); setEmail(''); };
  return <footer className="relative overflow-hidden bg-[#031225] py-16 text-white sm:py-20"><div className="absolute -bottom-72 -left-72 size-[38rem] rounded-full border border-gold/10" /><PageContainer>
    <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-[1.15fr_.7fr_1.2fr_1fr]"><div><Logo light /><p className="mt-6 max-w-sm text-sm leading-6 text-white/60">Trusted experts for visas, immigration, and global opportunities.</p><div className="mt-8 flex flex-wrap gap-3">{socialLinks.map(([short, label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`Nestway on ${label}`} className="grid size-10 place-items-center rounded-full border border-white/15 text-[10px] font-bold uppercase transition hover:border-gold hover:bg-gold hover:text-brand">{short}</a>)}</div></div>
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Quick Links</p><nav className="mt-5 grid gap-3">{quickLinks.map(([label, to]) => <Link key={label} to={to} className="text-sm text-white/60 transition hover:text-white">{label}</Link>)}</nav></div>
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Office Locations</p><address className="mt-5 grid gap-5 not-italic">{officeLinks.map(([label, address, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" className="group text-sm leading-6"><span className="block font-bold text-white/80 group-hover:text-gold-light">{label}</span><span className="mt-1 block text-white/45 group-hover:text-white/65">{address}</span></a>)}</address></div>
      <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Contact</p><address className="mt-5 grid gap-3 not-italic">{contactLinks.map(([label, value, href]) => <a key={label} href={href} className="min-w-0 text-sm"><span className="block text-[10px] font-bold uppercase tracking-[.13em] text-white/35">{label}</span><span className="mt-1 block break-words text-white/65 transition hover:text-gold-light">{value}</span></a>)}</address></div>
    </div>
    <div className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-gold">Ready when you are</p><Link to="/appointment" className="mt-3 block max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">Let&rsquo;s plan what&rsquo;s next. <span className="text-gold" aria-hidden="true">&rarr;</span></Link></div><form onSubmit={subscribe}><label htmlFor="newsletter-email" className="text-xs font-bold uppercase tracking-[.18em] text-gold">Useful updates, thoughtfully sent</label>{subscribed ? <p className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100 sm:rounded-full" role="status">You&rsquo;re on the list. Welcome to Nestway.</p> : <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 p-1.5 focus-within:border-gold sm:flex-row sm:rounded-full"><input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="Your email address" className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35" /><button type="submit" className="min-h-12 rounded-xl bg-gold px-5 py-3 text-xs font-bold text-brand transition hover:bg-gold-light sm:rounded-full">Subscribe</button></div>}</form></div>
    <div className="flex flex-col gap-3 pt-7 text-xs text-white/35 sm:flex-row sm:justify-between"><p>&copy; {new Date().getFullYear()} Nestway Immigration. All Rights Reserved.</p><p>MARN 2519006 &middot; Pakistan &middot; Australia &middot; UK</p></div>
  </PageContainer></footer>;
}
