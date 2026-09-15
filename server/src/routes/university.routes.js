import University from '../models/university.model.js';
import { createCrudRouter } from './resource.routes.js';

export default createCrudRouter({
  Model: University,
  requiredFields: ['name', 'slug', 'country', 'city'],
  populate: ['country'],
});