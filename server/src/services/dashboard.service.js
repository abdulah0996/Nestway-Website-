import Appointment from '../models/appointment.model.js';
import Blog from '../models/blog.model.js';
import Country from '../models/country.model.js';
import Lead from '../models/lead.model.js';
import Service from '../models/service.model.js';
import University from '../models/university.model.js';

export async function getDashboardStatistics() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const [totalLeads, newLeadsToday, newLeads, followUps, applicationsStarted, approvedCases, pendingAppointments, confirmedAppointments, totalServices, totalCountries, totalBlogs, totalUniversities] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
    Lead.countDocuments({ status: 'new' }),
    Lead.countDocuments({ status: 'follow_up' }),
    Lead.countDocuments({ status: 'application_started' }),
    Lead.countDocuments({ status: 'approved' }),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({ status: 'confirmed' }),
    Service.countDocuments(),
    Country.countDocuments(),
    Blog.countDocuments(),
    University.countDocuments(),
  ]);

  return { totalLeads, newLeadsToday, newLeads, followUps, applications: applicationsStarted, applicationsStarted, approvedCases, pendingAppointments, confirmedAppointments, totalServices, totalCountries, totalBlogs, totalUniversities };
}
