import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/ui/Modal.jsx';
import { useSeo } from '../../hooks/useSeo.js';
import { AdminEmpty, AdminError, AdminPageHeader, AdminPanel, adminInputClass, FieldLabel, StatusBadge, tableCellClass, TableFrame, tableHeadClass } from '../components/AdminUi.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { approveTestimonial, createCmsItem, deleteCmsItem, getCmsItems, publishTestimonial, setBlogStatus, setServicePublication, updateCmsItem } from '../services/adminApi.js';

const configs = {
  services: { title: 'Services', singular: 'service', identity: 'name', description: 'Manage service positioning, descriptions, categories and publication.', fields: [
    ['name', 'Service name', 'text', true], ['slug', 'Slug', 'text', true], ['category', 'Category', 'select', true, ['study', 'work', 'business', 'family', 'visitor', 'settlement']], ['shortDescription', 'Short description', 'textarea', true], ['description', 'Full description', 'textarea', true], ['imageUrl', 'Image URL', 'url'], ['isPublished', 'Published', 'checkbox'],
  ] },
  countries: { title: 'Countries', singular: 'country', identity: 'name', description: 'Maintain destinations, country codes and public overviews.', fields: [
    ['name', 'Country name', 'text', true], ['code', 'Country code', 'text', true], ['slug', 'Slug', 'text', true], ['overview', 'Overview', 'textarea'], ['flagUrl', 'Flag URL', 'url'], ['isFeatured', 'Featured destination', 'checkbox'], ['isPublished', 'Published', 'checkbox'],
  ] },
  blogs: { title: 'Blogs', singular: 'article', identity: 'title', description: 'Create resources, manage publication and maintain SEO metadata.', fields: [
    ['title', 'Article title', 'text', true], ['slug', 'Slug', 'text', true], ['category', 'Category', 'text', true], ['excerpt', 'Excerpt', 'textarea', true], ['content', 'Article content', 'textarea', true], ['coverImageUrl', 'Cover image URL', 'url'], ['readingTimeMinutes', 'Reading time (minutes)', 'number'], ['status', 'Status', 'select', true, ['draft', 'published']], ['seoMetaTitle', 'SEO title', 'text'], ['seoMetaDescription', 'SEO description', 'textarea'], ['seoKeywords', 'SEO keywords (comma separated)', 'text'],
  ] },
  faqs: { title: 'FAQs', singular: 'FAQ', identity: 'question', description: 'Maintain concise, searchable answers for common client questions.', fields: [
    ['question', 'Question', 'text', true], ['category', 'Category', 'text', true], ['answer', 'Answer', 'textarea', true], ['displayOrder', 'Display order', 'number'], ['isPublished', 'Published', 'checkbox'],
  ] },
  testimonials: { title: 'Testimonials', singular: 'testimonial', identity: 'name', description: 'Review, approve, publish and remove client stories.', fields: [
    ['name', 'Client name', 'text', true], ['role', 'Client role', 'text'], ['country', 'Country', 'text'], ['content', 'Testimonial', 'textarea', true], ['rating', 'Rating', 'number', true], ['photoUrl', 'Photo URL', 'url'], ['displayOrder', 'Display order', 'number'],
  ] },
  universities: { title: 'Universities', singular: 'university', identity: 'name', description: 'Manage partner institutions, locations, programs and visibility.', fields: [
    ['name', 'University name', 'text', true], ['slug', 'Slug', 'text', true], ['country', 'Country', 'country', true], ['city', 'City', 'text', true], ['description', 'Description', 'textarea'], ['websiteUrl', 'Website URL', 'url'], ['logoUrl', 'Logo URL', 'url'], ['ranking', 'Ranking', 'number'], ['popularPrograms', 'Popular programs (comma separated)', 'text'], ['isFeatured', 'Featured university', 'checkbox'], ['isPublished', 'Published', 'checkbox'],
  ] },
  offices: { title: 'Offices', singular: 'office', identity: 'name', description: 'Keep public office addresses and contact details current.', fields: [
    ['name', 'Office name', 'text', true], ['slug', 'Slug', 'text', true], ['phone', 'Phone', 'text', true], ['email', 'Email', 'email', true], ['timezone', 'Timezone', 'text', true], ['addressStreet', 'Street address', 'text', true], ['addressCity', 'City', 'text', true], ['addressState', 'State / region', 'text'], ['addressPostalCode', 'Postal code', 'text'], ['addressCountry', 'Country', 'text', true], ['mapUrl', 'Map URL', 'url'], ['isPublished', 'Published', 'checkbox'],
  ] },
};

function initialValues(config, item) {
  return Object.fromEntries(config.fields.map(([name, , type]) => {
    if (name === 'seoMetaTitle') return [name, item?.seo?.metaTitle || ''];
    if (name === 'seoMetaDescription') return [name, item?.seo?.metaDescription || ''];
    if (name === 'seoKeywords') return [name, (item?.seo?.keywords || []).join(', ')];
    if (name === 'addressStreet') return [name, item?.address?.street || ''];
    if (name === 'addressCity') return [name, item?.address?.city || ''];
    if (name === 'addressState') return [name, item?.address?.state || ''];
    if (name === 'addressPostalCode') return [name, item?.address?.postalCode || ''];
    if (name === 'addressCountry') return [name, item?.address?.country || ''];
    if (name === 'country') return [name, item?.country?._id || item?.country || ''];
    if (name === 'popularPrograms') return [name, (item?.popularPrograms || []).join(', ')];
    return [name, item?.[name] ?? (type === 'checkbox' ? false : '')];
  }));
}

function preparePayload(resource, values, userId) {
  const payload = { ...values };
  for (const [key, value] of Object.entries(payload)) if (value === '') delete payload[key];
  for (const key of ['rating', 'displayOrder', 'ranking', 'readingTimeMinutes']) if (payload[key] !== undefined) payload[key] = Number(payload[key]);
  if (resource === 'countries' && payload.code) payload.code = payload.code.toUpperCase();
  if (resource === 'blogs') {
    payload.author = userId;
    payload.seo = { metaTitle: payload.seoMetaTitle, metaDescription: payload.seoMetaDescription, keywords: payload.seoKeywords?.split(',').map((item) => item.trim()).filter(Boolean) || [] };
    delete payload.seoMetaTitle; delete payload.seoMetaDescription; delete payload.seoKeywords;
  }
  if (resource === 'universities' && payload.popularPrograms) payload.popularPrograms = payload.popularPrograms.split(',').map((item) => item.trim()).filter(Boolean);
  if (resource === 'offices') {
    payload.address = { street: payload.addressStreet, city: payload.addressCity, state: payload.addressState, postalCode: payload.addressPostalCode, country: payload.addressCountry };
    ['addressStreet', 'addressCity', 'addressState', 'addressPostalCode', 'addressCountry'].forEach((key) => delete payload[key]);
  }
  return payload;
}

function publicationState(resource, item) {
  if (resource === 'blogs') return item.status || 'draft';
  if (resource === 'testimonials') return item.isPublished ? 'published' : item.approvedBy ? 'approved' : 'draft';
  return item.isPublished ? 'published' : 'draft';
}

export function CmsManagerPage({ resource }) {
  const config = configs[resource];
  const { user } = useAdminAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [values, setValues] = useState({});
  useSeo({ title: `${config.title} admin`, description: config.description });
  const itemsQuery = useQuery({ queryKey: ['admin', 'cms', resource], queryFn: () => getCmsItems(resource) });
  const countriesQuery = useQuery({ queryKey: ['admin', 'options', 'countries'], queryFn: () => getCmsItems('countries'), enabled: resource === 'universities' });
  const items = Array.isArray(itemsQuery.data) ? itemsQuery.data : [];
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'cms', resource] });
  const saveMutation = useMutation({ mutationFn: (payload) => editing ? updateCmsItem(resource, editing._id, payload) : createCmsItem(resource, payload), onSuccess: () => { refresh(); setFormOpen(false); setEditing(null); } });
  const deleteMutation = useMutation({ mutationFn: (id) => deleteCmsItem(resource, id), onSuccess: () => { refresh(); setPendingDelete(null); } });
  const publicationMutation = useMutation({ mutationFn: async (item) => {
    if (resource === 'services') return setServicePublication(item._id, !item.isPublished);
    if (resource === 'blogs') return setBlogStatus(item._id, item.status === 'published' ? 'draft' : 'published');
    if (resource === 'testimonials') { if (item.isPublished) return updateCmsItem(resource, item._id, { isPublished: false }); if (!item.approvedBy) await approveTestimonial(item._id); return publishTestimonial(item._id); }
    return updateCmsItem(resource, item._id, { isPublished: !item.isPublished });
  }, onSuccess: refresh });

  useEffect(() => { if (formOpen) setValues(initialValues(config, editing)); }, [formOpen, editing, config]);
  const countryOptions = useMemo(() => (countriesQuery.data || []).map((country) => [country._id, country.name]), [countriesQuery.data]);
  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setFormOpen(true); };
  const submit = (event) => { event.preventDefault(); saveMutation.mutate(preparePayload(resource, values, user.id)); };
  const fields = config.fields.map((field) => field[2] === 'country' ? [...field.slice(0, 4), countryOptions] : field);

  return <div className="space-y-7"><AdminPageHeader eyebrow="Content management" title={config.title} description={config.description} action={<button type="button" onClick={openCreate} className="rounded-full bg-gold px-5 py-3 text-xs font-bold text-brand transition hover:bg-gold-light">Add {config.singular}</button>} />{(saveMutation.isError || deleteMutation.isError || publicationMutation.isError) && <AdminError message={saveMutation.error?.message || deleteMutation.error?.message || publicationMutation.error?.message} />}<AdminPanel>{itemsQuery.isPending ? <div className="p-12 text-center text-sm text-ink-muted">Loading {config.title.toLowerCase()}…</div> : itemsQuery.isError ? <div className="p-5"><AdminError message={itemsQuery.error?.message} onRetry={() => itemsQuery.refetch()} /></div> : items.length ? <TableFrame><thead><tr>{['Content', 'Details', 'Visibility', 'Updated', 'Actions'].map((heading) => <th key={heading} className={tableHeadClass}>{heading}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item._id} className="transition hover:bg-gold/[.035]"><td className={tableCellClass}><p className="max-w-sm font-bold">{item[config.identity]}</p><p className="mt-1 max-w-sm truncate text-xs text-ink-muted">{item.slug || item.email || item.category || item.city || 'Nestway content'}</p></td><td className={tableCellClass}><p className="max-w-sm truncate text-xs text-ink-muted">{item.shortDescription || item.excerpt || item.overview || item.description || item.content || item.address?.city || '—'}</p></td><td className={tableCellClass}><StatusBadge status={publicationState(resource, item)} /></td><td className={tableCellClass}>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td><td className={tableCellClass}><div className="flex gap-2"><button type="button" onClick={() => openEdit(item)} className="rounded-full border border-brand/12 px-4 py-2 text-xs font-bold">Edit</button><button type="button" disabled={publicationMutation.isPending} onClick={() => publicationMutation.mutate(item)} className="rounded-full border border-gold/35 px-4 py-2 text-xs font-bold text-gold-dark">{publicationState(resource, item) === 'published' ? 'Unpublish' : resource === 'testimonials' ? 'Approve & publish' : 'Publish'}</button><button type="button" onClick={() => setPendingDelete(item)} className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700">Delete</button></div></td></tr>)}</tbody></TableFrame> : <AdminEmpty title={`No ${config.title.toLowerCase()} yet`} description={`Add the first ${config.singular} to begin.`} />}</AdminPanel>

    <Modal isOpen={formOpen} onClose={() => !saveMutation.isPending && setFormOpen(false)} title={`${editing ? 'Edit' : 'Add'} ${config.singular}`}><form onSubmit={submit} className="max-h-[72vh] space-y-5 overflow-y-auto pr-1">{fields.map(([name, label, type, required, options]) => type === 'checkbox' ? <label key={name} className="flex items-center gap-3 rounded-xl border border-brand/10 bg-white p-4 text-sm font-bold text-brand"><input type="checkbox" checked={Boolean(values[name])} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.checked }))} className="size-4 accent-gold" />{label}</label> : <FieldLabel key={name} label={`${label}${required ? ' *' : ''}`}>{type === 'textarea' ? <textarea rows={name === 'content' ? 8 : 4} required={required} value={values[name] || ''} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))} className={`${adminInputClass} resize-y`} /> : type === 'select' || type === 'country' ? <select required={required} value={values[name] || ''} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))} className={adminInputClass}><option value="">Select {label.toLowerCase()}</option>{(options || []).map((option) => { const [value, text] = Array.isArray(option) ? option : [option, option.replaceAll('_', ' ')]; return <option key={value} value={value} className="capitalize">{text}</option>; })}</select> : <input type={type} required={required} min={type === 'number' ? 0 : undefined} value={values[name] || ''} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))} className={adminInputClass} />}</FieldLabel>)}{saveMutation.isError && <AdminError message={saveMutation.error?.message} />}<div className="sticky bottom-0 flex justify-end gap-3 border-t border-brand/10 bg-cream pt-5"><button type="button" onClick={() => setFormOpen(false)} className="rounded-full border border-brand/12 px-5 py-3 text-xs font-bold">Cancel</button><button type="submit" disabled={saveMutation.isPending} className="rounded-full bg-brand px-6 py-3 text-xs font-bold text-white disabled:opacity-50">{saveMutation.isPending ? 'Saving…' : 'Save changes'}</button></div></form></Modal>
    <Modal isOpen={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} title={`Delete ${config.singular}`}><p className="leading-7 text-ink-muted">This permanently removes <strong className="text-brand">{pendingDelete?.[config.identity]}</strong>. This action cannot be undone.</p>{deleteMutation.isError && <div className="mt-5"><AdminError message={deleteMutation.error?.message} /></div>}<div className="mt-8 flex justify-end gap-3"><button type="button" onClick={() => setPendingDelete(null)} className="rounded-full border border-brand/12 px-5 py-3 text-xs font-bold">Keep it</button><button type="button" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(pendingDelete._id)} className="rounded-full bg-red-700 px-5 py-3 text-xs font-bold text-white">{deleteMutation.isPending ? 'Deleting…' : 'Delete permanently'}</button></div></Modal>
  </div>;
}
