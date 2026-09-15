import TeamMember from '../models/team-member.model.js';
import { createCrudRouter } from './resource.routes.js';

export default createCrudRouter({
  Model: TeamMember,
  requiredFields: ['firstName', 'lastName', 'jobTitle', 'bio'],
  slug: false,
  populate: ['linkedUser'],
});