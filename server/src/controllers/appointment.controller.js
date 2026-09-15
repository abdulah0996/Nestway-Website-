import { assignAppointmentConsultant, createAppointment, listAppointments, updateAppointmentStatus } from '../services/appointment.service.js';

export async function bookAppointment(request, response, next) {
  try {
    const appointment = await createAppointment(request.body);
    response.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function assignConsultant(request, response, next) {
  try {
    const appointment = await assignAppointmentConsultant(request.params.id, request.body.consultant);
    response.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function getAppointments(request, response, next) {
  try {
    const appointments = await listAppointments(request.query);
    response.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
}

export async function changeAppointmentStatus(request, response, next) {
  try {
    const appointment = await updateAppointmentStatus(
      request.params.id,
      request.body.status,
      request.body.cancellationReason,
    );
    response.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}
