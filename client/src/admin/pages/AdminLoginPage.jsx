import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import heroEarth from '../../assets/hero-earth.jpg';
import { Logo } from '../../components/layout/Logo.jsx';
import { useSeo } from '../../hooks/useSeo.js';
import { adminInputClass, FieldLabel } from '../components/AdminUi.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { adminHomeFor } from '../utils/permissions.js';

export function AdminLoginPage() {
  const { user, isAuthenticated, login } = useAdminAuth();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  useSeo({ title: 'Admin sign in', description: 'Secure Nestway Immigration administration portal.' });

  if (isAuthenticated) return <Navigate to={adminHomeFor(user?.role)} replace />;

  const submit = async (values) => {
    setServerError('');
    try {
      const account = await login(values);
      const requested = location.state?.from;
      navigate(requested?.startsWith('/admin/') ? requested : adminHomeFor(account.role), { replace: true });
    } catch (error) {
      setServerError(error.message || 'Unable to sign in. Check your credentials and try again.');
    }
  };

  return <main className="relative grid min-h-screen overflow-hidden bg-brand lg:grid-cols-[1.08fr_.92fr]">
    <div className="relative hidden overflow-hidden lg:block"><img src={heroEarth} alt="" className="absolute inset-0 size-full scale-110 object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-r from-brand/35 via-brand/25 to-brand" /><div className="relative flex h-full flex-col justify-between p-12 xl:p-16"><Logo light /><motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="max-w-2xl pb-10"><p className="text-xs font-bold uppercase tracking-[.24em] text-gold-light">Private administration</p><h1 className="mt-6 font-display text-7xl font-semibold leading-[.9] text-white xl:text-8xl">Global journeys.<br /><em className="text-gold-light">One clear view.</em></h1><p className="mt-7 max-w-lg leading-7 text-white/55">Manage enquiries, appointments and content from the secure Nestway workspace.</p></motion.div><p className="text-xs text-white/35">Protected by role-based access controls.</p></div></div>
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] px-5 py-12 sm:px-10"><motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55 }} className="w-full max-w-md"><div className="lg:hidden"><Logo /><p className="mt-3 text-[9px] font-bold uppercase tracking-[.2em] text-gold-dark">Administration</p></div><p className="mt-12 text-xs font-bold uppercase tracking-[.2em] text-gold-dark lg:mt-0">Welcome back</p><h2 className="mt-3 font-display text-5xl font-semibold text-brand">Sign in securely.</h2><p className="mt-4 text-sm leading-6 text-ink-muted">Use your Nestway administrator credentials to continue.</p>
      <form onSubmit={handleSubmit(submit)} noValidate className="mt-9 space-y-5"><FieldLabel label="Email address"><input type="email" autoComplete="email" autoFocus className={adminInputClass} aria-invalid={Boolean(errors.email)} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} />{errors.email && <span className="mt-2 block text-xs text-red-700">{errors.email.message}</span>}</FieldLabel><FieldLabel label="Password"><input type="password" autoComplete="current-password" className={adminInputClass} aria-invalid={Boolean(errors.password)} {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} />{errors.password && <span className="mt-2 block text-xs text-red-700">{errors.password.message}</span>}</FieldLabel>{serverError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{serverError}</div>}<button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-between rounded-full bg-brand px-6 py-4 text-sm font-bold text-white transition hover:bg-brand-light disabled:cursor-wait disabled:opacity-60"><span>{isSubmitting ? 'Signing in…' : 'Sign in to dashboard'}</span><span className="text-gold-light" aria-hidden="true">&rarr;</span></button></form>
      <div className="mt-8 flex items-center justify-between border-t border-brand/10 pt-6 text-xs"><Link to="/" className="font-bold text-brand">&larr; Public website</Link><a href="mailto:info@nestwayimmigration.com" className="text-ink-muted hover:text-brand">Need access help?</a></div>
    </motion.section></div>
  </main>;
}
