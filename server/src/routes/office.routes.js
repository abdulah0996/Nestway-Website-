import Office from '../models/office.model.js';
import { createCrudRouter } from './resource.routes.js';

export default createCrudRouter({
  Model: Office,
  requiredFields: ['name', 'slug', 'address', 'phone', 'email', 'timezone'],
  populate: ['consultants'],
});