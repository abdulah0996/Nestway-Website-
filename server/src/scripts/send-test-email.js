import 'dotenv/config';
import { emailNotificationsConfigured, sendNewLeadNotification } from '../services/email.service.js';

if (!emailNotificationsConfigured()) {
  throw new Error('Email is not configured. Add EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD and ADMIN_EMAIL to server/.env first.');
}

const result = await sendNewLeadNotification({
  firstName: 'Nestway',
  lastName: 'SMTP Test',
  email: process.env.EMAIL_USER,
  phone: 'Configuration test',
  interestedCountry: { name: 'Test destination' },
  interestedService: { name: 'Email delivery verification' },
  message: 'This message confirms that the Nestway new-lead SMTP notification workflow can reach the configured administrator inbox.',
  createdAt: new Date(),
});

console.log(`Test notification sent successfully. Message ID: ${result.messageId}`);
