import assert from 'node:assert/strict';
import test from 'node:test';
import { buildLeadNotification, sendNewLeadNotification } from '../src/services/email.service.js';

const lead = {
  firstName: 'Ayesha',
  lastName: 'Khan',
  email: 'ayesha@example.com',
  phone: '+92 300 0000000',
  interestedService: { name: 'Study Visa' },
  interestedCountry: { name: 'Australia' },
  message: 'Please review my profile.',
  createdAt: new Date('2026-09-15T08:00:00.000Z'),
};

test('lead notification includes the required CRM details', () => {
  const notification = buildLeadNotification(lead);
  assert.equal(notification.subject, 'New Immigration Lead Received - Nestway Immigration');
  assert.match(notification.html, /Open lead in admin dashboard/);
  for (const expected of ['Ayesha Khan', 'ayesha@example.com', 'Study Visa', 'Australia', 'Please review my profile.']) {
    assert.match(notification.text, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('lead notification sends to the configured administrator', async (context) => {
  const originalAdminEmail = process.env.ADMIN_EMAIL;
  const originalEmailUser = process.env.EMAIL_USER;
  context.after(() => {
    if (originalAdminEmail === undefined) delete process.env.ADMIN_EMAIL; else process.env.ADMIN_EMAIL = originalAdminEmail;
    if (originalEmailUser === undefined) delete process.env.EMAIL_USER; else process.env.EMAIL_USER = originalEmailUser;
  });
  process.env.ADMIN_EMAIL = 'admin@nestway.test';
  process.env.EMAIL_USER = 'notifications@nestway.test';
  let sentMessage;
  const result = await sendNewLeadNotification(lead, { async sendMail(message) { sentMessage = message; return { messageId: 'test-message' }; } });
  assert.equal(result.sent, true);
  assert.equal(sentMessage.to, 'admin@nestway.test');
  assert.equal(sentMessage.replyTo, lead.email);
  assert.equal(sentMessage.subject, 'New Immigration Lead Received - Nestway Immigration');
});
