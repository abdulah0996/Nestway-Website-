import { getDashboardStatistics } from '../services/dashboard.service.js';

export async function getDashboard(request, response, next) {
  try {
    const data = await getDashboardStatistics();
    response.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
