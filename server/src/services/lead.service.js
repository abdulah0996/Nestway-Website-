import Lead from '../models/lead.model.js';
import AdminUser from '../models/admin-user.model.js';
import { ApiError } from './resource.service.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function createPublicLead(payload) {
  const source = payload.source || 'website';
  const lead = await Lead.create({
    ...payload,
    activities: [{ type: 'created', description: `Lead created from ${source.replaceAll('_', ' ')}` }],
  });
  return lead.populate('interestedCountry interestedService interestedPathway');
}

export async function listLeads({ status, assignedTo, assignedCounsellor, country, service, search, page = 1, limit = 20 }) {
  const filter = {};
  if (status) filter.status = status;
  if (assignedTo || assignedCounsellor) filter.assignedTo = assignedTo || assignedCounsellor;
  if (country) filter.interestedCountry = country;
  if (service) filter.interestedService = service;
  if (search?.trim()) {
    const term = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ firstName: term }, { lastName: term }, { email: term }, { phone: term }];
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).populate('interestedCountry interestedService interestedPathway assignedTo notes.author activities.actor'),
    Lead.countDocuments(filter),
  ]);

  return { items, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } };
}

function leadAccessFilter(id, actor) {
  return actor?.role === 'consultant' ? { _id: id, assignedTo: actor.sub } : { _id: id };
}

export async function updateLeadStatus(id, status, actor) {
  const currentLead = await Lead.findOne(leadAccessFilter(id, actor)).select('status');
  if (!currentLead) throw new ApiError(404, actor?.role === 'consultant' ? 'Lead not found or not assigned to you' : 'Lead not found');
  const now = new Date();
  const update = {
    $set: { status },
    $push: { activities: { type: 'status_changed', description: `Status changed to ${status.replaceAll('_', ' ')}`, actor: actor?.sub, fromStatus: currentLead.status, toStatus: status, createdAt: now } },
  };
  if (['contacted', 'follow_up'].includes(status)) update.$set.lastContactedAt = now;
  const lead = await Lead.findOneAndUpdate(leadAccessFilter(id, actor), update, { new: true, runValidators: true })
    .populate('interestedCountry interestedService interestedPathway assignedTo notes.author activities.actor');
  if (!lead) throw new ApiError(404, actor?.role === 'consultant' ? 'Lead not found or not assigned to you' : 'Lead not found');
  return lead;
}

export async function assignLead(id, assignedTo, actor) {
  if (!assignedTo) {
    const unassignedLead = await Lead.findByIdAndUpdate(id, {
      $unset: { assignedTo: 1 },
      $push: { activities: { type: 'unassigned', description: 'Consultant assignment removed', actor: actor?.sub } },
    }, { new: true, runValidators: true })
      .populate('interestedCountry interestedService interestedPathway assignedTo notes.author activities.actor');
    if (!unassignedLead) throw new ApiError(404, 'Lead not found');
    return unassignedLead;
  }

  const consultant = await AdminUser.findOne({ _id: assignedTo, role: 'consultant', isActive: true });
  if (!consultant) throw new ApiError(400, 'Assigned user must be an active consultant');
  const consultantName = `${consultant.firstName} ${consultant.lastName}`.trim();
  const lead = await Lead.findByIdAndUpdate(id, {
    $set: { assignedTo },
    $push: { activities: { type: 'assigned', description: `Assigned to ${consultantName}`, actor: actor?.sub } },
  }, { new: true, runValidators: true })
    .populate('interestedCountry interestedService interestedPathway assignedTo notes.author activities.actor');
  if (!lead) throw new ApiError(404, 'Lead not found');
  return lead;
}

export async function addLeadNote(id, body, actor) {
  const lead = await Lead.findOneAndUpdate(
    leadAccessFilter(id, actor),
    { $set: { lastContactedAt: new Date() }, $push: { notes: { body, author: actor.sub }, activities: { type: 'note_added', description: 'Follow-up note added', actor: actor.sub } } },
    { new: true, runValidators: true },
  ).populate('interestedCountry interestedService interestedPathway assignedTo notes.author activities.actor');
  if (!lead) throw new ApiError(404, actor?.role === 'consultant' ? 'Lead not found or not assigned to you' : 'Lead not found');
  return lead;
}

export async function updateLeadFollowUp(id, followUpReminderAt, actor) {
  const reminder = followUpReminderAt ? new Date(followUpReminderAt) : null;
  const clearing = !reminder;
  const update = {
    ...(clearing ? { $unset: { followUpReminderAt: 1 } } : { $set: { followUpReminderAt: reminder } }),
    $push: { activities: {
      type: clearing ? 'follow_up_cleared' : 'follow_up_scheduled',
      description: clearing ? 'Follow-up reminder cleared' : `Follow-up scheduled for ${reminder.toISOString()}`,
      actor: actor?.sub,
    } },
  };
  const lead = await Lead.findOneAndUpdate(leadAccessFilter(id, actor), update, { new: true, runValidators: true })
    .populate('interestedCountry interestedService interestedPathway assignedTo notes.author activities.actor');
  if (!lead) throw new ApiError(404, actor?.role === 'consultant' ? 'Lead not found or not assigned to you' : 'Lead not found');
  return lead;
}
