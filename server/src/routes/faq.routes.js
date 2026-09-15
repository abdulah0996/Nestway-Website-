import FAQ from '../models/faq.model.js';
import { createCrudRouter } from './resource.routes.js';

export default createCrudRouter({
  Model: FAQ,
  requiredFields: ['question', 'answer', 'category'],
  slug: false,
  populate: ['service', 'country'],
  permission: 'faqs:manage',
});
