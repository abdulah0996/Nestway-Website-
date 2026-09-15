import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import heroEarth from '../assets/hero-earth.jpg';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { PublicHero } from '../components/public/PublicHero.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FormField } from '../components/ui/FormField.jsx';
import { useCountries } from '../hooks/queries/useCountries.js';
import { useServices } from '../hooks/queries/useServices.js';
import { useSeo } from '../hooks/useSeo.js';
import { createAppointment } from '../services/api/appointments.js';
import { createLead } from '../services/api/leads.js';

const fallbackServices = ['Study Visa', 'Visit Visa', 'Skilled Immigration', 'Business Immigration'].map((title, index) => ({ title, slug: `service-${index}` }));
const fallbackCountries = ['Australia', 'United Kingdom', 'Canada', 'United States', 'New Zealand', 'Malaysia', 'Europe'].map((name, index) => ({ name, slug: `country-${index}` }));
const meetingTypes = [
  { value: 'video', title: 'Video consultation', text: 'Meet from anywhere with a secure online conversation.' },
  { value: 'phone', title: 'Phone consultation', text: 'A focused call using the number you provide.' },
  { value: 'in_person', title: 'In-person consultation', text: 'Visit a Nestway office where local availability allows.' },
];
const times = ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00'];
const stepLabels = ['Service', 'Country', 'Consultation', 'Date', 'Time', 'Details', 'Confirmation'];

function nextDates() {
  const dates = [];
  const cursor = new Date();
  while (dates.length < 10) {
    cursor.setDate(cursor.getDate() + 1);
    if (cursor.getDay() === 0) continue;
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, '0');
    const day = String(cursor.getDate()).padStart(2, '0');
    dates.push({ value: `${year}-${month}-${day}`, weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(cursor), day: new Intl.DateTimeFormat('en', { day: 'numeric' }).format(cursor), month: new Intl.DateTimeFormat('en', { month: 'short' }).format(cursor) });
  }
  return dates;
}

function ChoiceCard({ selected, title, text, onClick }) {
  return <button type="button" onClick={onClick} aria-pressed={selected} className={`min-h-44 rounded-3xl border p-6 text-left transition duration-200 ${selected ? 'border-gold bg-gold/10 shadow-[0_0_0_2px_rgba(201,162,39,.15)]' : 'border-brand/10 bg-white hover:-translate-y-1 hover:border-gold/50'}`}><span className={`block size-3 rounded-full ${selected ? 'bg-gold' : 'bg-brand/15'}`} /><span className="mt-8 block font-display text-3xl font-semibold leading-tight text-brand">{title}</span>{text && <span className="mt-3 block text-sm leading-6 text-ink-muted">{text}</span>}</button>;
}

export function AppointmentPage() {
  const servicesQuery = useServices();
  const countriesQuery = useCountries();
  const services = Array.isArray(servicesQuery.data) && servicesQuery.data.length ? servicesQuery.data : fallbackServices;
  const countries = Array.isArray(countriesQuery.data) && countriesQuery.data.length ? countriesQuery.data : fallbackCountries;
  const dates = useMemo(nextDates, []);
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState(null);
  const leadIdRef = useRef(null);
  const { register, watch, setValue, trigger, handleSubmit, formState: { errors } } = useForm({ defaultValues: { serviceName: '', countryName: '', meetingType: '', date: '', time: '', firstName: '', lastName: '', email: '', phone: '', notes: '', consentToContact: false } });
  const values = watch();
  useSeo({ title: 'Book a consultation', description: 'Book a Nestway immigration consultation by choosing your service, destination, meeting type, date and time.' });

  const bookingMutation = useMutation({
    mutationFn: async (formValues) => {
      const service = services.find((item) => (item.title || item.name) === formValues.serviceName);
      const country = countries.find((item) => item.name === formValues.countryName);
      if (!leadIdRef.current) {
        const lead = await createLead({ firstName: formValues.firstName, lastName: formValues.lastName, email: formValues.email, phone: formValues.phone, interestedService: service?._id, interestedCountry: country?._id, message: formValues.notes || `Consultation requested for ${formValues.serviceName} in ${formValues.countryName}.`, consentToContact: true, source: 'website' });
        leadIdRef.current = lead._id;
      }
      const scheduledAt = new Date(`${formValues.date}T${formValues.time}:00`).toISOString();
      const appointment = await createAppointment({ lead: leadIdRef.current, service: service?._id, scheduledAt, durationMinutes: 30, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi', meetingType: formValues.meetingType, clientNotes: formValues.notes });
      return appointment;
    },
    onSuccess: (appointment) => { setConfirmation({ ...values, appointment }); setStep(7); },
  });

  const fieldsByStep = { 1: ['serviceName'], 2: ['countryName'], 3: ['meetingType'], 4: ['date'], 5: ['time'] };
  const next = async () => {
    const valid = await trigger(fieldsByStep[step] || []);
    if (valid) setStep((current) => Math.min(6, current + 1));
  };
  const choose = (name, value) => setValue(name, value, { shouldValidate: true, shouldDirty: true });

  return (
    <article>
      <PublicHero eyebrow="Private consultation" title="Seven simple steps to" accent="a clearer next step." description="Choose a convenient consultation format and tell us enough to make the conversation useful from the beginning." backgroundImage={heroEarth} compact />
      <section className="bg-cream py-16 sm:py-24"><PageContainer>
        <nav aria-label="Booking progress" className="overflow-x-auto pb-4"><ol className="flex min-w-[720px] items-center">{stepLabels.map((label, index) => { const number = index + 1; const active = number === step; const complete = number < step; return <li key={label} className="flex flex-1 items-center last:flex-none"><div className="flex items-center gap-2"><span className={`grid size-8 place-items-center rounded-full text-xs font-bold transition ${active ? 'bg-gold text-brand' : complete ? 'bg-brand text-white' : 'border border-brand/15 text-ink-muted'}`}>{complete ? '✓' : number}</span><span className={`text-xs font-bold ${active ? 'text-brand' : 'text-ink-muted'}`}>{label}</span></div>{index < stepLabels.length - 1 && <span className={`mx-3 h-px flex-1 ${complete ? 'bg-brand' : 'bg-brand/15'}`} />}</li>; })}</ol></nav>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-brand/10 bg-white shadow-card">
          <div className="grid lg:grid-cols-[.34fr_.66fr]">
            <aside className="bg-brand p-8 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-gold-light">Your consultation</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight">A focused start to a high-stakes journey.</h2><dl className="mt-10 space-y-5 border-t border-white/15 pt-8 text-sm"><div><dt className="text-white/40">Service</dt><dd className="mt-1 font-semibold">{values.serviceName || 'Not selected'}</dd></div><div><dt className="text-white/40">Destination</dt><dd className="mt-1 font-semibold">{values.countryName || 'Not selected'}</dd></div><div><dt className="text-white/40">Format</dt><dd className="mt-1 font-semibold capitalize">{values.meetingType?.replace('_', ' ') || 'Not selected'}</dd></div><div><dt className="text-white/40">When</dt><dd className="mt-1 font-semibold">{values.date && values.time ? `${values.date} at ${values.time}` : 'Not selected'}</dd></div></dl><p className="mt-10 text-xs leading-5 text-white/40">Times are shown in your local timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Karachi'}.</p></aside>
            <form onSubmit={handleSubmit((formValues) => bookingMutation.mutate(formValues))} className="min-h-[620px] p-6 sm:p-10" noValidate>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .25 }}>
                  {step === 1 && <div><p className="eyebrow">Step 1</p><h2 className="mt-4 font-display text-4xl font-semibold text-brand sm:text-5xl">What can we help with?</h2><input type="hidden" {...register('serviceName', { required: 'Choose a service to continue' })} /><div className="mt-9 grid gap-4 sm:grid-cols-2">{services.map((service) => { const name = service.title || service.name; return <ChoiceCard key={service._id || service.slug || name} selected={values.serviceName === name} title={name} text={service.shortDescription || 'Discuss eligibility, timing and the preparation ahead.'} onClick={() => choose('serviceName', name)} />; })}</div>{errors.serviceName && <p className="mt-4 text-sm text-red-700">{errors.serviceName.message}</p>}{(servicesQuery.isPending || servicesQuery.isError) && <p className="mt-5 text-xs text-ink-muted">{servicesQuery.isPending ? 'Syncing live service options...' : 'Live services are unavailable; core consultation options remain available.'}</p>}</div>}
                  {step === 2 && <div><p className="eyebrow">Step 2</p><h2 className="mt-4 font-display text-4xl font-semibold text-brand sm:text-5xl">Where are you looking?</h2><input type="hidden" {...register('countryName', { required: 'Choose a destination to continue' })} /><div className="mt-9 grid gap-4 sm:grid-cols-2">{countries.map((country) => <ChoiceCard key={country._id || country.slug || country.name} selected={values.countryName === country.name} title={country.name} text={country.shortDescription || 'Explore the pathways that fit this destination.'} onClick={() => choose('countryName', country.name)} />)}</div>{errors.countryName && <p className="mt-4 text-sm text-red-700">{errors.countryName.message}</p>}{(countriesQuery.isPending || countriesQuery.isError) && <p className="mt-5 text-xs text-ink-muted">{countriesQuery.isPending ? 'Syncing live destinations...' : 'Live destinations are unavailable; core options remain available.'}</p>}</div>}
                  {step === 3 && <div><p className="eyebrow">Step 3</p><h2 className="mt-4 font-display text-4xl font-semibold text-brand sm:text-5xl">How would you like to meet?</h2><input type="hidden" {...register('meetingType', { required: 'Choose a consultation type' })} /><div className="mt-9 grid gap-4">{meetingTypes.map((type) => <ChoiceCard key={type.value} selected={values.meetingType === type.value} title={type.title} text={type.text} onClick={() => choose('meetingType', type.value)} />)}</div>{errors.meetingType && <p className="mt-4 text-sm text-red-700">{errors.meetingType.message}</p>}</div>}
                  {step === 4 && <div><p className="eyebrow">Step 4</p><h2 className="mt-4 font-display text-4xl font-semibold text-brand sm:text-5xl">Choose a date.</h2><input type="hidden" {...register('date', { required: 'Choose a date' })} /><div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">{dates.map((date) => <button type="button" key={date.value} onClick={() => choose('date', date.value)} aria-pressed={values.date === date.value} className={`rounded-2xl border p-4 text-center transition ${values.date === date.value ? 'border-gold bg-gold/10' : 'border-brand/10 hover:border-gold/50'}`}><span className="block text-xs font-bold uppercase tracking-[.12em] text-ink-muted">{date.weekday}</span><span className="mt-2 block font-display text-4xl font-semibold text-brand">{date.day}</span><span className="block text-xs text-ink-muted">{date.month}</span></button>)}</div>{errors.date && <p className="mt-4 text-sm text-red-700">{errors.date.message}</p>}</div>}
                  {step === 5 && <div><p className="eyebrow">Step 5</p><h2 className="mt-4 font-display text-4xl font-semibold text-brand sm:text-5xl">Select a time.</h2><p className="mt-3 text-sm text-ink-muted">Available consultation windows for {values.date}.</p><input type="hidden" {...register('time', { required: 'Choose a time' })} /><div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3">{times.map((time) => <button key={time} type="button" onClick={() => choose('time', time)} aria-pressed={values.time === time} className={`rounded-2xl border px-5 py-6 font-display text-3xl font-semibold transition ${values.time === time ? 'border-gold bg-gold/10 text-brand' : 'border-brand/10 text-brand hover:border-gold/50'}`}>{time}</button>)}</div>{errors.time && <p className="mt-4 text-sm text-red-700">{errors.time.message}</p>}</div>}
                  {step === 6 && <div><p className="eyebrow">Step 6</p><h2 className="mt-4 font-display text-4xl font-semibold text-brand sm:text-5xl">Tell us who we are meeting.</h2><div className="mt-9 grid gap-5 sm:grid-cols-2"><FormField label="First name" name="firstName" required error={errors.firstName}><input id="firstName" className="form-control" aria-invalid={Boolean(errors.firstName)} {...register('firstName', { required: 'Enter your first name' })} /></FormField><FormField label="Last name" name="lastName" required error={errors.lastName}><input id="lastName" className="form-control" aria-invalid={Boolean(errors.lastName)} {...register('lastName', { required: 'Enter your last name' })} /></FormField><FormField label="Email" name="email" required error={errors.email}><input id="email" type="email" className="form-control" aria-invalid={Boolean(errors.email)} {...register('email', { required: 'Enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></FormField><FormField label="Phone" name="phone" error={errors.phone}><input id="phone" type="tel" className="form-control" {...register('phone')} /></FormField></div><FormField label="Anything we should know?" name="notes" className="mt-5"><textarea id="notes" rows="4" className="form-control resize-y" {...register('notes')} /></FormField><label className="mt-5 flex items-start gap-3 text-sm leading-6 text-ink-muted"><input type="checkbox" className="mt-1 size-4 accent-gold" {...register('consentToContact', { required: 'Consent is required to confirm your booking' })} /><span>I agree that Nestway may contact me about this consultation.</span></label>{errors.consentToContact && <p className="mt-2 text-sm text-red-700">{errors.consentToContact.message}</p>}{bookingMutation.isError && <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800" role="alert"><p>{bookingMutation.error?.message || 'The appointment could not be booked.'}</p><p className="mt-1">Your details are preserved. Please try again.</p></div>}</div>}
                  {step === 7 && confirmation && <div className="flex min-h-[520px] flex-col justify-center"><span className="grid size-16 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-800" aria-hidden="true">✓</span><p className="eyebrow mt-8">Booking received</p><h2 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand">Your consultation request is with us.</h2><p className="mt-6 max-w-xl leading-7 text-ink-muted">Thank you, {confirmation.firstName}. We have received your request for {confirmation.date} at {confirmation.time}. The Nestway team will contact you to confirm the appointment details.</p><div className="mt-8 rounded-2xl bg-cream p-6 text-sm text-ink-muted"><p><strong className="text-brand">Reference:</strong> {confirmation.appointment?._id || 'Pending confirmation'}</p><p className="mt-2"><strong className="text-brand">Format:</strong> {confirmation.meetingType.replace('_', ' ')}</p></div><Button to="/" className="mt-8 self-start">Return home</Button></div>}
                </motion.div>
              </AnimatePresence>
              {step < 7 && <div className="mt-10 flex items-center justify-between border-t border-brand/10 pt-6"><button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || bookingMutation.isPending} className="rounded-full px-5 py-3 text-sm font-bold text-brand disabled:opacity-30">&larr; Back</button>{step < 6 ? <Button type="button" variant="accent" onClick={next}>Continue <span aria-hidden="true">&rarr;</span></Button> : <Button type="submit" variant="accent" disabled={bookingMutation.isPending}>{bookingMutation.isPending ? 'Booking...' : 'Request consultation'}</Button>}</div>}
            </form>
          </div>
        </div>
      </PageContainer></section>
    </article>
  );
}
