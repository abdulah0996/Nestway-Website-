import mongoose from 'mongoose';
import { objectId, timestamps } from './common.js';

const appointmentSchema = new mongoose.Schema(
  {
    lead: { ...objectId('Lead'), required: true },
    client: objectId('User'),
    consultant: objectId('AdminUser'),
    office: objectId('Office'),
    service: objectId('Service'),
    pathway: objectId('ImmigrationPathway'),
    scheduledAt: { type: Date, required: true, validate: { validator: (value) => value > new Date(), message: 'Appointment must be scheduled in the future' } },
    durationMinutes: { type: Number, required: true, min: 15, max: 240, default: 30 },
    timezone: { type: String, required: true, trim: true },
    meetingType: { type: String, enum: ['in_person', 'video', 'phone'], required: true },
    meetingLink: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    clientNotes: { type: String, trim: true, maxlength: 2000 },
    internalNotes: { type: String, trim: true, maxlength: 2000 },
    cancelledAt: { type: Date },
    cancellationReason: { type: String, trim: true, maxlength: 500 },
    createdBy: objectId('AdminUser'),
  },
  timestamps,
);

appointmentSchema.index({ consultant: 1, scheduledAt: 1 });
appointmentSchema.index({ status: 1, scheduledAt: 1 });
export default mongoose.model('Appointment', appointmentSchema);
