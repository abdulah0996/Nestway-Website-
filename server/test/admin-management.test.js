import assert from 'node:assert/strict';
import test from 'node:test';
import Appointment from '../src/models/appointment.model.js';
import Blog from '../src/models/blog.model.js';
import Country from '../src/models/country.model.js';
import Lead from '../src/models/lead.model.js';
import Service from '../src/models/service.model.js';
import University from '../src/models/university.model.js';
import AdminUser from '../src/models/admin-user.model.js';
import app from '../src/app.js';
import { getDashboardStatistics } from '../src/services/dashboard.service.js';

process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long';

test('admin management routes reject unauthenticated requests', async (context) => {
  const server = app.listen(0);
  context.after(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  const cases = [
    ['GET', '/api/admin/dashboard'],
    ['GET', '/api/admin/activities'],
    ['GET', '/api/admin/media'],
    ['GET', '/api/leads'],
    ['PATCH', '/api/leads/507f1f77bcf86cd799439011/follow-up'],
    ['GET', '/api/appointments'],
    ['PATCH', '/api/services/507f1f77bcf86cd799439011/publication'],
    ['PATCH', '/api/blogs/507f1f77bcf86cd799439011/status'],
    ['PATCH', '/api/testimonials/507f1f77bcf86cd799439011/approve'],
  ];

  for (const [method, path] of cases) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      body: method === 'GET' ? undefined : '{}',
    });
    assert.equal(response.status, 401, `${method} ${path}`);
  }
});

test('lead and appointment schemas enforce the management lifecycle statuses', () => {
  assert.deepEqual(Lead.schema.path('status').enumValues, [
    'new', 'contacted', 'follow_up', 'documents_pending', 'application_started', 'submitted', 'approved', 'rejected',
  ]);
  assert.deepEqual(Appointment.schema.path('status').enumValues, ['pending', 'confirmed', 'completed', 'cancelled']);
  assert.deepEqual(AdminUser.schema.path('role').enumValues, ['admin', 'consultant']);
  assert.equal(Lead.schema.path('followUpReminderAt').instance, 'Date');
  assert.equal(Lead.schema.path('lastContactedAt').instance, 'Date');
  assert.deepEqual(Lead.schema.path('activities').schema.path('type').enumValues, [
    'created', 'status_changed', 'assigned', 'unassigned', 'note_added', 'follow_up_scheduled', 'follow_up_cleared',
  ]);
});

test('dashboard analytics returns CRM pipeline and content counters', async (context) => {
  const models = [Lead, Appointment, Service, Country, Blog, University];
  const originals = models.map((model) => model.countDocuments);
  context.after(() => models.forEach((model, index) => { model.countDocuments = originals[index]; }));

  let leadCall = 0;
  let appointmentCall = 0;
  Lead.countDocuments = async () => [12, 3, 4, 2, 5, 6][leadCall++];
  Appointment.countDocuments = async () => [4, 5][appointmentCall++];
  Service.countDocuments = async () => 6;
  Country.countDocuments = async () => 7;
  Blog.countDocuments = async () => 8;
  University.countDocuments = async () => 9;

  assert.deepEqual(await getDashboardStatistics(), {
    totalLeads: 12,
    newLeadsToday: 3,
    newLeads: 4,
    followUps: 2,
    applications: 5,
    applicationsStarted: 5,
    approvedCases: 6,
    pendingAppointments: 4,
    confirmedAppointments: 5,
    totalServices: 6,
    totalCountries: 7,
    totalBlogs: 8,
    totalUniversities: 9,
  });
});
