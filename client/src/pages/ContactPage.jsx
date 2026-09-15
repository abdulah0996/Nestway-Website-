import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import heroEarth from '../assets/hero-earth.jpg';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FormField } from '../components/ui/FormField.jsx';
import { useSeo } from '../hooks/useSeo.js';
import { createLead } from '../services/api/leads.js';

const contacts = [
  { country: 'Pakistan', value: '+92 321 1533111', href: 'tel:+923211533111' },
  { country: 'Australia', value: '+61 435 020 639', href: 'tel:+61435020639' },
  { country: 'UK', value: '+44 7577 329727', href: 'tel:+447577329727' },
  { country: 'USA', value: '+1 586 927 5596', href: 'tel:+15869275596' },
];

const offices = [
  { name: 'Pakistan Office', country: 'Pakistan', city: 'Lahore', address: ['Plaza A, Building 148', 'Near Dolmen Mall', 'DHA Phase 6', 'Lahore, Pakistan'], position: ['68%', '48%'], map: 'https://maps.google.com/?q=Plaza+A+Building+148+Near+Dolmen+Mall+DHA+Phase+6+Lahore+Pakistan' },
  { name: 'Australia Office', country: 'Australia', city: 'Seven Hills', address: ['8/238 Prospect Hwy', 'Seven Hills', 'NSW 2147', 'Australia'], position: ['84%', '73%'], map: 'https://maps.google.com/?q=8%2F238+Prospect+Hwy+Seven+Hills+NSW+2147+Australia' },
  { name: 'UK Office', country: 'United Kingdom', city: 'Edinburgh', address: ['5/4 West Montgomery Place', 'Edinburgh', 'EH7 5HA'], position: ['45%', '29%'], map: 'https://maps.google.com/?q=5%2F4+West+Montgomery+Place+Edinburgh+EH7+5HA' },
];

function splitName(value) {
  const parts = value.trim().split(/\s+/);
  return { firstName: parts.shift(), lastName: parts.join(' ') || 'Not provided' };
}

export function ContactPage() {
  const [activeOffice, setActiveOffice] = useState(0);
  const [searchParams] = useSearchParams();
  const requestedCountry = searchParams.get('country');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues: { name: '', email: '', subject: '', message: '', consentToContact: false } });
  const mutation = useMutation({ mutationFn: createLead, onSuccess: () => reset() });
  useSeo({ title: 'Get In Touch', description: 'Let our immigration experts guide you through student visas, visit visas, skilled migration, and business immigration. Schedule your personalized consultation today!' });

  useEffect(() => {
    if (!requestedCountry) return;
    const countryName = requestedCountry
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setValue('subject', `Study in ${countryName}`);
  }, [requestedCountry, setValue]);

  const onSubmit = (values) => {
    const name = splitName(values.name);
    mutation.mutate({
      ...name,
      email: values.email,
      source: 'website',
      consentToContact: values.consentToContact,
      message: `Source: Contact Page\nSubject: ${values.subject || 'General enquiry'}\n\n${values.message}`,
    });
  };

  return (
    <article>
      <PublicHero eyebrow="Nestway Immigration" title="Get In" accent="Touch." description="Let our immigration experts guide you through student visas, visit visas, skilled migration, and business immigration. Schedule your personalized consultation today!" backgroundImage={heroEarth} compact>
        <Link to="/appointment" className="inline-flex rounded-full bg-gold px-7 py-4 text-sm font-bold text-brand transition hover:bg-gold-light">Book Consultation <span className="ml-4" aria-hidden="true">&rarr;</span></Link>
      </PublicHero>

      <section className="bg-cream py-24 sm:py-32"><PageContainer><Reveal><div className="grid gap-8 lg:grid-cols-2"><div><p className="eyebrow">Talk to our team</p><h2 className="display-title">One conversation can make the path <em className="text-gold-dark">much clearer.</em></h2></div><p className="self-end max-w-xl text-lg leading-8 text-ink-muted">Connect with the office closest to you, or send a message and our immigration team will respond using the details you provide.</p></div></Reveal><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{contacts.map((contact, index) => <Reveal key={contact.country} delay={index * .05}><motion.a whileHover={{ y: -6 }} href={contact.href} className="group flex min-h-52 flex-col rounded-3xl border border-brand/10 bg-white p-7 shadow-card transition hover:border-gold/50 hover:shadow-card-hover"><span className="grid size-11 place-items-center rounded-full bg-brand text-gold-light" aria-hidden="true">{index + 1}</span><p className="mt-auto pt-10 text-xs font-bold uppercase tracking-[.16em] text-gold-dark">{contact.country}</p><p className="mt-3 font-display text-2xl font-semibold text-brand">{contact.value}</p></motion.a></Reveal>)}</div><Reveal><motion.a href="mailto:info@nestwayimmigration.com" whileHover={{ y: -4 }} transition={{ duration: .25, ease: 'easeOut' }} className="group relative mt-5 flex min-h-60 flex-col items-center justify-between gap-8 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,#071b36_0%,#0b2345_58%,#12365b_100%)] p-8 text-center text-white shadow-[0_18px_50px_rgba(7,27,54,.18)] transition-shadow duration-300 hover:shadow-[0_26px_64px_rgba(7,27,54,.28)] md:min-h-56 md:flex-row md:p-10 md:text-left lg:px-12"><span className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full border border-white/10" aria-hidden="true" /><span className="pointer-events-none absolute -right-8 -top-10 size-44 rounded-full bg-white/[.035]" aria-hidden="true" /><span className="relative max-w-3xl"><span className="block text-[11px] font-bold uppercase tracking-[.2em] text-gold-light">Contact our expert team</span><span className="mt-4 block break-all font-display text-[clamp(1.45rem,3vw,2.65rem)] font-semibold leading-tight sm:break-normal">info@nestwayimmigration.com</span><span className="mt-5 block max-w-xl text-sm leading-6 text-white/65 sm:text-base">Get professional guidance for your migration journey.</span></span><span className="relative grid size-20 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-gold-light shadow-[inset_0_1px_0_rgba(255,255,255,.16)] backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1 md:size-24" aria-hidden="true"><svg viewBox="0 0 24 24" className="size-8 md:size-9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></span></motion.a></Reveal></PageContainer></section>

      <section className="bg-white py-24 sm:py-32"><PageContainer><div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]"><Reveal><div><p className="eyebrow">Office locations</p><h2 className="display-title">Global perspective. <em className="text-gold-dark">A local welcome.</em></h2><div className="mt-10 space-y-2">{offices.map((office, index) => <button type="button" key={office.country} onMouseEnter={() => setActiveOffice(index)} onFocus={() => setActiveOffice(index)} onClick={() => setActiveOffice(index)} aria-pressed={activeOffice === index} className={`w-full border-b py-5 text-left transition ${activeOffice === index ? 'border-gold text-brand' : 'border-brand/15 text-ink-muted'}`}><span className="flex items-center justify-between"><span className="font-display text-3xl font-semibold">{office.name}</span><span className="text-xs font-bold uppercase tracking-[.14em]">{office.city}</span></span></button>)}</div></div></Reveal><Reveal delay={.1}><div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-brand text-white"><div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:18px_18px]" /><svg aria-hidden="true" viewBox="0 0 900 480" className="absolute inset-0 size-full opacity-35" fill="none"><path d="M55 260C170 120 292 112 410 208s225 73 419-35" stroke="#C9A227" strokeWidth="2" strokeDasharray="6 10" /></svg>{offices.map((office, index) => <button type="button" key={office.country} onClick={() => setActiveOffice(index)} aria-label={`Select ${office.name}`} style={{ left: office.position[0], top: office.position[1] }} className="absolute -translate-x-1/2 -translate-y-1/2"><span className={`absolute inset-0 rounded-full bg-gold ${activeOffice === index ? 'animate-ping' : 'opacity-0'}`} /><span className={`relative block rounded-full border-4 border-brand transition ${activeOffice === index ? 'size-6 bg-gold' : 'size-4 bg-white'}`} /></button>)}<motion.address key={offices[activeOffice].country} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/10 p-6 not-italic backdrop-blur-xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-gold-light">{offices[activeOffice].name}</p><p className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{offices[activeOffice].address.join(', ')}</p><a href={offices[activeOffice].map} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm font-bold text-gold-light">Open in Google Maps <span aria-hidden="true">&nearr;</span></a></motion.address></div></Reveal></div></PageContainer></section>

      <section className="relative isolate overflow-hidden bg-brand py-24 text-white sm:py-32"><div className="absolute -right-48 top-0 -z-10 size-[38rem] rounded-full border border-gold/10" /><PageContainer><div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr]"><Reveal><div><p className="eyebrow text-gold-light">Send us a message</p><h2 className="display-title text-white">Tell us what you are <em className="text-gold-light">moving toward.</em></h2><p className="mt-7 max-w-md leading-7 text-white/55">Your enquiry is saved securely in the Nestway lead system and identified as coming from the Contact Page.</p></div></Reveal><Reveal delay={.1}><div className="rounded-[2rem] border border-white/10 bg-white p-6 text-brand shadow-2xl sm:p-10"><h2 className="font-display text-4xl font-semibold sm:text-5xl">Send Us Message</h2><p className="mt-3 text-sm leading-6 text-ink-muted">Required fields are marked with an asterisk.</p>
          {mutation.isSuccess ? <div className="mt-9 rounded-3xl border border-emerald-700/15 bg-emerald-50 p-8" role="status"><span className="grid size-12 place-items-center rounded-full bg-emerald-100 text-xl text-emerald-800" aria-hidden="true">✓</span><h3 className="mt-6 font-display text-4xl font-semibold">Your message is with us.</h3><p className="mt-3 leading-7 text-ink-muted">Thank you for contacting Nestway Immigration. Our team will review your enquiry and respond soon.</p><button type="button" onClick={() => mutation.reset()} className="mt-6 text-sm font-bold text-brand">Send another message</button></div> : <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-9 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><FormField label="Your Name" name="name" required error={errors.name}><input id="name" autoComplete="name" className="form-control" aria-invalid={Boolean(errors.name)} {...register('name', { required: 'Please enter your name', minLength: { value: 2, message: 'Please enter your full name' } })} /></FormField><FormField label="Your Email" name="email" required error={errors.email}><input id="email" type="email" autoComplete="email" className="form-control" aria-invalid={Boolean(errors.email)} {...register('email', { required: 'Please enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} /></FormField></div><FormField label="Subject" name="subject" error={errors.subject}><input id="subject" className="form-control" {...register('subject', { maxLength: { value: 180, message: 'Keep the subject under 180 characters' } })} /></FormField><FormField label="Your Message" name="message" required error={errors.message}><textarea id="message" rows="6" className="form-control resize-y" aria-invalid={Boolean(errors.message)} {...register('message', { required: 'Please enter your message', minLength: { value: 10, message: 'Please add a little more detail' } })} /></FormField><label className="flex items-start gap-3 text-sm leading-6 text-ink-muted"><input type="checkbox" className="mt-1 size-4 accent-gold" {...register('consentToContact', { required: 'Consent is required so we can respond' })} /><span>I agree that Nestway Immigration may contact me about this enquiry.</span></label>{errors.consentToContact && <p className="text-sm text-red-700">{errors.consentToContact.message}</p>}{mutation.isError && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800" role="alert"><p>{mutation.error?.message || 'Your message could not be sent.'}</p><p className="mt-1">Your information is still here. Please try again.</p></div>}<Button type="submit" variant="accent" size="lg" disabled={mutation.isPending}>{mutation.isPending ? 'Sending Message...' : 'Send Us Message'}</Button></form>}
        </div></Reveal></div></PageContainer></section>
    </article>
  );
}
