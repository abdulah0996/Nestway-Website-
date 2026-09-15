import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import appointmentRoutes from './routes/appointment.routes.js';
import adminActivityRoutes from './routes/admin-activity.routes.js';
import adminUserRoutes from './routes/admin-user.routes.js';
import authRoutes from './routes/auth.routes.js';
import blogRoutes from './routes/blog.routes.js';
import countryRoutes from './routes/country.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import faqRoutes from './routes/faq.routes.js';
import healthRoutes from './routes/health.routes.js';
import leadRoutes from './routes/lead.routes.js';
import mediaRoutes from './routes/media.routes.js';
import officeRoutes from './routes/office.routes.js';
import pathwayRoutes from './routes/pathway.routes.js';
import serviceRoutes from './routes/service.routes.js';
import teamMemberRoutes from './routes/team-member.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import universityRoutes from './routes/university.routes.js';

const app = express();
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientBuildDirectory = path.resolve(serverDirectory, '../../client/dist');

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin-users', adminUserRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/activities', adminActivityRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/pathways', pathwayRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/appointments', appointmentRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildDirectory));
  app.get('/{*path}', (request, response, next) => {
    if (!request.accepts('html')) return next();
    return response.sendFile(path.join(clientBuildDirectory, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
