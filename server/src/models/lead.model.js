import mongoose from 'mongoose';
import { emailValidator, objectId, timestamps } from './common.js';

const leadActivitySchema = new mongoose.Schema({
  type: { type: String, enum: ['created', 'status_changed', 'assigned', 'unassigned', 'note_added', 'follow_up_scheduled', 'follow_up_cleared'], required: true },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  actor: objectId('AdminUser'),
  fromStatus: { type: String, trim: true },
  toStatus: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const leadSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: emailValidator,
    phone: { type: String, trim: true },
    countryOfResidence: { type: String, trim: true },
    nationality: { type: String, trim: true },
    interestedCountry: objectId('Country'),
    interestedService: objectId('Service'),
    interestedPathway: objectId('ImmigrationPathway'),
    message: { type: String, trim: true, maxlength: 3000 },
    source: { type: String, enum: ['website', 'referral', 'social', 'phone', 'walk_in', 'other'], default: 'website' },
    status: { type: String, enum: ['new', 'contacted', 'follow_up', 'documents_pending', 'application_started', 'submitted', 'approved', 'rejected'], default: 'new' },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    assignedTo: objectId('AdminUser'),
    notes: [{ body: { type: String, required: true, trim: true, maxlength: 2000 }, author: objectId('AdminUser'), createdAt: { type: Date, default: Date.now } }],
    activities: { type: [leadActivitySchema], default: [] },
    consentToContact: { type: Boolean, required: true, validate: { validator: (value) => value === true, message: 'Contact consent is required' } },
    lastContactedAt: { type: Date },
    followUpReminderAt: { type: Date },
  },
  timestamps,
);

leadSchema.index({ status: 1, priority: 1, createdAt: -1 });
leadSchema.index({ email: 1 });
leadSchema.index({ followUpReminderAt: 1, assignedTo: 1 });
export default mongoose.model('Lead', leadSchema);
