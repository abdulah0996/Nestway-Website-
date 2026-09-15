import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { serviceImages } from '../assets/editorialImages.js';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { Reveal } from '../components/motion/Reveal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FormField } from '../components/ui/FormField.jsx';
import { useFaqs } from '../hooks/queries/useFaqs.js';
import { useServices } from '../hooks/queries/useServices.js';
import { useSeo } from '../hooks/useSeo.js';
import { createLead } from '../services/api/leads.js';
import { serviceContent } from './services/serviceContent.js';

const coreSlugs = ['study-visa', 'visit-visa', 'skilled-immigration', 'business-immigration'];

const fallbackServices = coreSlugs.map((slug) => ({
  _id: slug,
  slug,
  name: serviceContent[slug].title,
  shortDescription: serviceContent[slug].shortDescription,
  imageUrl: serviceImages[slug],
}));

const fallbackFaqs = [
  { question: 'What visa services does Nestway Immigration offer?', answer: 'We provide guidance for study visas, visitor visas, skilled migration and business immigration, with related support for admissions, documentation and pathway planning.' },
  { question: 'How do you help me choose the right country and university?', answer: 'Our advisers consider your academic profile, career direction, budget and preferred destination before helping you build a practical shortlist.' },
  { question: 'Do you provide language test preparation or coaching?', answer: 'Yes. Nestway supports IELTS, TOEFL, OET and citizenship-test preparation through focused, goal-led training.' },
  { question: 'How long does the visa application process take?', answer: 'Processing times depend on the destination and visa category. We help you prepare a complete application and explain the relevant timeline before submission.' },
  { question: 'Can Nestway help me avoid common visa application mistakes?', answer: 'Yes. We review forms and supporting evidence for clarity, completeness and consistency before the application moves forward.' },
];

function splitName(value) {
  const parts = value.trim().split(/\s+/);
  return { firstName: parts.shift(), lastName: parts.join(' ') || 'Not provided' };
}

function isObjectId(value) {
  return /^[a-f\d]{24}$/i.test(value || '');
}

function ServicesFaqList({ items }) {
  const [open, setOpen] = useState(0);
  return <div className="border-t border-brand/15">{items.map((item, index) => {
    const question = item.question || item[0];
    const answer = item.answer || item[1];
    const expanded = open === index;
    return <div key={item._id || question} className="border-b border-brand/15"><button type="button" onClick={() => setOpen(expanded ? -1 : index)} aria-expanded={expanded} className="flex w-full items-center justify-between gap-5 py-6 text-left"><span className="font-display text-xl font-semibold leading-snug text-brand sm:text-2xl">{index + 1}. {question}</span><span className={`grid size-8 shrink-0 place-items-center rounded-full border border-brand/15 text-lg transition ${expanded ? 'rotate-45 bg-brand text-white' : 'text-brand'}`} aria-hidden="true">+</span></button><AnimatePresence initial={false}>{expanded && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-2xl pb-6 pr-10 text-sm leading-6 text-ink-muted">{answer}</p></motion.div>}</AnimatePresence></div>;
  })}</div>;
}

export function ServicesPage() {
  const servicesQuery = useServices();
  const faqQuery = useFaqs();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { name: '', email: '', service: 'study-visa', message: '', consentToContact: false } });
  const mutation = useMutation({ mutationFn: createLead, onSuccess: () => reset() });

  const liveServices = Array.isArray(servicesQuery.data) ? servicesQuery.data.filter((service) => service.isPublished !== false) : [];
  const services = fallbackServices.map((fallback) => ({ ...fallback, ...(liveServices.find((service) => service.slug === fallback.slug) || {}), imageUrl: liveServices.find((service) => service.slug === fallback.slug)?.imageUrl || fallback.imageUrl }));
  const liveFaqs = Array.isArray(faqQuery.data) ? faqQuery.data.filter((faq) => faq.isPublished !== false) : [];
  const faqs = (liveFaqs.length ? liveFaqs : fallbackFaqs).slice(0, 5);

  useSeo({ title: 'Immigration Services', description: 'Explore Nestway Immigration services for study visas, visitor visas, skilled migration and business immigration.' });

  const onSubmit = (values) => {
    const selected = services.find((service) => service.slug === values.service);
    mutation.mutate({
      ...splitName(values.name),
      email: values.email,
      ...(isObjectId(selected?._id) ? { interestedService: selected._id } : {}),
      source: 'website',
      consentToContact: values.consentToContact,
      message: `Source: Services Page\nService: ${selected?.name || values.service}\n\n${values.message || 'Requested a free consultation.'}`,
    });
  };

  return (
    <article>
      <section className="bg-cream pb-24 pt-36 sm:pb-32 sm:pt-44">
        <PageContainer>
          <Reveal><div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><div><p className="eyebrow">Visa categories</p><h1 className="mt-5 max-w-2xl font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-.025em] text-brand">Comprehensive immigration solutions.</h1></div><p className="max-w-2xl text-lg leading-8 text-ink-muted">Explore professional guidance for studying abroad, international travel, skilled migration and global business opportunities.</p></div></Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{services.map((service, index) => <Reveal key={service.slug} delay={index * .05}><motion.article whileHover={{ y: -4 }} className="group flex h-full min-h-[25rem] flex-col overflow-hidden rounded-[20px] border border-brand/10 bg-white shadow-card transition-shadow hover:shadow-card-hover"><div className="h-48 overflow-hidden bg-brand"><img src={service.imageUrl || serviceImages[service.slug]} alt={`${service.name} consultation service`} className="size-full object-cover transition duration-700 group-hover:scale-[1.035]" loading={index === 0 ? 'eager' : 'lazy'} /></div><div className="flex flex-1 flex-col p-6"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-gold-dark">Service 0{index + 1}</span><h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-brand">{service.name}</h2><p className="mt-4 text-sm leading-6 text-ink-muted">{service.shortDescription}</p><Link to={`/services/${service.slug}`} className="mt-auto inline-flex items-center gap-3 pt-7 text-sm font-bold text-brand">Read more <span className="grid size-7 place-items-center rounded-full bg-brand text-xs text-white transition group-hover:translate-x-1" aria-hidden="true">&rarr;</span></Link></div></motion.article></Reveal>)}</div>
          {servicesQuery.isError && <p className="mt-6 text-sm text-ink-muted">Live service data is temporarily unavailable; showing Nestway&rsquo;s core services.</p>}
        </PageContainer>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <PageContainer><div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal><div className="rounded-[24px] border border-brand/10 bg-cream p-7 shadow-card sm:p-9"><p className="eyebrow">Free consultation</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-brand">Need help with your immigration?</h2><p className="mt-4 text-sm leading-6 text-ink-muted">Tell us where you want to go and our team will help you identify a sensible next step.</p>{mutation.isSuccess ? <div className="mt-8 rounded-2xl border border-emerald-700/15 bg-emerald-50 p-6" role="status"><h3 className="font-display text-3xl font-semibold text-brand">Thank you.</h3><p className="mt-2 text-sm leading-6 text-ink-muted">Your consultation request has been received.</p><button type="button" onClick={() => mutation.reset()} className="mt-4 text-sm font-bold text-brand">Send another request</button></div> : <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate><div className="grid gap-5 sm:grid-cols-2"><FormField label="Name" name="services-name" required error={errors.name}><input id="services-name" className="form-control" autoComplete="name" aria-invalid={Boolean(errors.name)} {...register('name', { required: 'Please enter your name', minLength: { value: 2, message: 'Please enter your full name' } })} /></FormField><FormField label="Email" name="services-email" required error={errors.email}><input id="services-email" type="email" className="form-control" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register('email', { required: 'Please enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} /></FormField></div><FormField label="Choose service" name="services-service"><select id="services-service" className="form-control" {...register('service')}>{services.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}</select></FormField><FormField label="Message" name="services-message"><textarea id="services-message" rows="5" className="form-control resize-y" {...register('message', { maxLength: { value: 3000, message: 'Keep your message under 3000 characters' } })} /></FormField><label className="flex items-start gap-3 text-sm leading-6 text-ink-muted"><input type="checkbox" className="mt-1 size-4 accent-brand" {...register('consentToContact', { required: 'Consent is required so we can respond' })} /><span>I agree that Nestway Immigration may contact me about this enquiry.</span></label>{errors.consentToContact && <p className="text-sm text-red-700">{errors.consentToContact.message}</p>}{mutation.isError && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800" role="alert">{mutation.error?.message || 'Your request could not be sent. Please try again.'}</p>}<Button type="submit" size="lg" disabled={mutation.isPending}>{mutation.isPending ? 'Sending...' : 'Get free consultation'} <span aria-hidden="true">&rarr;</span></Button></form>}</div></Reveal>
          <Reveal delay={.08}><div><p className="eyebrow">Frequently asked questions</p><h2 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight text-brand sm:text-5xl">Clear answers before you begin.</h2><div className="mt-9">{faqQuery.isPending ? <div className="h-64 animate-pulse rounded-[20px] bg-cream" role="status" aria-label="Loading frequently asked questions" /> : <ServicesFaqList items={faqs} />}</div>{faqQuery.isError && <p className="mt-5 text-sm text-ink-muted">Live FAQs are temporarily unavailable; showing general guidance.</p>}</div></Reveal>
        </div></PageContainer>
      </section>
    </article>
  );
}
