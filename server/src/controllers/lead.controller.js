import { ApiError } from '../services/resource.service.js';
import { addLeadNote, assignLead, createPublicLead, listLeads, updateLeadFollowUp, updateLeadStatus } from '../services/lead.service.js';
import { sendNewLeadNotification } from '../services/email.service.js';

const LEAD_STATUSES = ['new', 'contacted', 'follow_up', 'documents_pending', 'application_started', 'submitted', 'approved', 'rejected'];
const CONSULTANT_STATUSES = ['contacted', 'follow_up', 'documents_pending', 'application_started', 'submitted'];

export async function createEnquiry(request, response, next) {
  try {
    const lead = await createPublicLead(request.body);
    try {
      await sendNewLeadNotification(lead);
    } catch (notificationError) {
      console.error(`Lead ${lead._id} was saved, but its email notification failed: ${notificationError.message}`);
    }
    response.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

export async function getLeads(request, response, next) {
  try {
    const query = request.user.role === 'consultant'
      ? { ...request.query, assignedTo: request.user.sub }
      : request.query;
    const data = await listLeads(query);
    response.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function changeLeadStatus(request, response, next) {
  try {
    const { status } = request.body;
    if (!LEAD_STATUSES.includes(status)) {
      throw new ApiError(400, 'Invalid lead status');
    }
    if (request.user.role === 'consultant' && !CONSULTANT_STATUSES.includes(status)) {
      throw new ApiError(403, 'Consultants can only update active follow-up stages');
    }
    const lead = await updateLeadStatus(request.params.id, status, request.user);
    response.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

export async function assignLeadToAdviser(request, response, next) {
  try {
    if (!Object.hasOwn(request.body, 'assignedTo')) throw new ApiError(400, 'assignedTo is required');
    const lead = await assignLead(request.params.id, request.body.assignedTo, request.user);
    response.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

export async function createLeadNote(request, response, next) {
  try {
    const body = request.body.body?.trim();
    if (!body) throw new ApiError(400, 'Note body is required');
    const lead = await addLeadNote(request.params.id, body, request.user);
    response.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}

export async function scheduleLeadFollowUp(request, response, next) {
  try {
    const { followUpReminderAt } = request.body;
    if (followUpReminderAt) {
      const reminder = new Date(followUpReminderAt);
      if (Number.isNaN(reminder.getTime())) throw new ApiError(400, 'A valid follow-up date is required');
    }
    const lead = await updateLeadFollowUp(request.params.id, followUpReminderAt || null, request.user);
    response.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
}
