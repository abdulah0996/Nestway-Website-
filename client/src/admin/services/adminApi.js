import { apiClient, unwrap } from '../../services/apiClient.js';

export const loginAdmin = (credentials) => unwrap(apiClient.post('/auth/login', credentials));
export const getAdminProfile = () => unwrap(apiClient.get('/auth/profile'));

export const getDashboard = () => unwrap(apiClient.get('/admin/dashboard'));
export const getLeads = (params) => unwrap(apiClient.get('/leads', { params }));
export const updateLeadStatus = (id, status) => unwrap(apiClient.patch(`/leads/${id}/status`, { status }));
export const assignLead = (id, assignedTo) => unwrap(apiClient.patch(`/leads/${id}/assign`, { assignedTo }));
export const addLeadNote = (id, body) => unwrap(apiClient.post(`/leads/${id}/notes`, { body }));
export const updateLeadFollowUp = (id, followUpReminderAt) => unwrap(apiClient.patch(`/leads/${id}/follow-up`, { followUpReminderAt }));

export const getAppointments = (params) => unwrap(apiClient.get('/appointments', { params }));
export const updateAppointmentStatus = (id, status, cancellationReason) => unwrap(apiClient.patch(`/appointments/${id}/status`, { status, cancellationReason }));
export const assignAppointment = (id, consultant) => unwrap(apiClient.patch(`/appointments/${id}/assign`, { consultant }));

export const getAdminUsers = (params) => unwrap(apiClient.get('/admin-users', { params }));
export const getAssignableConsultants = () => getAdminUsers({ role: 'consultant', active: true });
export const createAdminUser = (payload) => unwrap(apiClient.post('/admin-users', payload));
export const updateAdminUser = (id, payload) => unwrap(apiClient.patch(`/admin-users/${id}`, payload));

export const getCmsItems = (resource, params) => unwrap(apiClient.get(`/${resource}`, { params }));
export const createCmsItem = (resource, payload) => unwrap(apiClient.post(`/${resource}`, payload));
export const updateCmsItem = (resource, id, payload) => unwrap(apiClient.put(`/${resource}/${id}`, payload));
export const deleteCmsItem = (resource, id) => apiClient.delete(`/${resource}/${id}`);
export const setServicePublication = (id, isPublished) => unwrap(apiClient.patch(`/services/${id}/publication`, { isPublished }));
export const setBlogStatus = (id, status) => unwrap(apiClient.patch(`/blogs/${id}/status`, { status }));
export const updateBlogSeo = (id, seo) => unwrap(apiClient.patch(`/blogs/${id}/seo`, seo));
export const approveTestimonial = (id) => unwrap(apiClient.patch(`/testimonials/${id}/approve`));
export const publishTestimonial = (id) => unwrap(apiClient.patch(`/testimonials/${id}/publish`));

export const getMedia = (params) => unwrap(apiClient.get('/admin/media', { params }));
export const createMedia = (payload) => unwrap(apiClient.post('/admin/media', payload));
export const updateMedia = (id, payload) => unwrap(apiClient.patch(`/admin/media/${id}`, payload));
export const deleteMedia = (id) => apiClient.delete(`/admin/media/${id}`);

export const getActivities = (params) => unwrap(apiClient.get('/admin/activities', { params }));
