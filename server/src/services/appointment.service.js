import Appointment from '../models/appointment.model.js';
import AdminUser from '../models/admin-user.model.js';
import { ApiError } from './resource.service.js';

export async function createAppointment(payload) {
  return Appointment.create(payload);
}

export async function listAppointments({ status, consultant, from, to } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (consultant) filter.consultant = consultant;
  if (from || to) {
    filter.scheduledAt = {};
    if (from) filter.scheduledAt.$gte = new Date(from);
    if (to) filter.scheduledAt.$lte = new Date(to);
  }

  return Appointment.find(filter)
    .sort({ scheduledAt: 1 })
    .populate('lead client consultant office service pathway');
}

export async function updateAppointmentStatus(id, status, cancellationReason) {
  const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowedStatuses.includes(status)) throw new ApiError(400, 'Invalid appointment status');

  const update = { status };
  if (status === 'cancelled') {
    update.cancelledAt = new Date();
    update.cancellationReason = cancellationReason;
  }

  const appointment = await Appointment.findByIdAndUpdate(id, update, { new: true, runValidators: true })
    .populate('lead client consultant office service pathway');
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  return appointment;
}

export async function assignAppointmentConsultant(id, consultant) {
  const assignedConsultant = await AdminUser.findOne({ _id: consultant, role: 'consultant', isActive: true });
  if (!assignedConsultant) throw new ApiError(400, 'Consultant must be an active consultant');
  const appointment = await Appointment.findByIdAndUpdate(id, { consultant }, { new: true, runValidators: true })
    .populate('lead client consultant office service pathway');
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  return appointment;
}
