export const roleLabels = {
  admin: 'Admin',
  consultant: 'Consultant',
};

const access = {
  dashboard: ['admin'],
  leads: ['admin', 'consultant'],
  appointments: ['admin'],
  consultants: ['admin'],
  core_cms: ['admin'],
  extended_cms: ['admin'],
  media: ['admin'],
  activity: ['admin'],
};

export function canAccess(role, section) {
  return Boolean(role && access[section]?.includes(role));
}

export function adminHomeFor(role) {
  if (canAccess(role, 'dashboard')) return '/admin/dashboard';
  return '/admin/leads';
}
