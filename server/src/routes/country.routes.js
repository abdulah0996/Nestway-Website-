import Country from '../models/country.model.js';
import { createCrudRouter } from './resource.routes.js';

export default createCrudRouter({
  Model: Country,
  requiredFields: ['name', 'code', 'slug'],
  populate: ['popularServices', 'universities'],
  permission: 'countries:manage',
});
