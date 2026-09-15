import bcrypt from 'bcryptjs';
import AdminUser from '../models/admin-user.model.js';
import { ApiError } from '../services/resource.service.js';

const ADMIN_ROLES = ['admin', 'consultant'];

function withoutPassword(user) {
  const data = user.toObject();
  delete data.passwordHash;
  return data;
}

export async function listAdminUsers(request, response, next) {
  try {
    const filter = {};
    if (request.query.role) {
      if (!ADMIN_ROLES.includes(request.query.role)) throw new ApiError(400, 'Invalid admin role');
      filter.role = request.query.role;
    }
    if (request.query.active === 'true') filter.isActive = true;
    if (request.query.active === 'false') filter.isActive = false;
    const users = await AdminUser.find(filter).sort({ firstName: 1, lastName: 1 });
    response.json({ success: true, data: users.map(withoutPassword) });
  } catch (error) {
    next(error);
  }
}

export async function createAdminUser(request, response, next) {
  try {
    const { firstName, lastName, email, password, role, permissions = [] } = request.body;
    if (!ADMIN_ROLES.includes(role)) throw new ApiError(400, 'Invalid admin role');
    if (typeof password !== 'string' || password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');

    const user = await AdminUser.create({
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role,
      permissions,
      createdBy: request.user.sub,
    });
    response.status(201).json({ success: true, data: withoutPassword(user) });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminUser(request, response, next) {
  try {
    const update = {};
    for (const field of ['firstName', 'lastName', 'role', 'permissions', 'isActive']) {
      if (request.body[field] !== undefined) update[field] = request.body[field];
    }
    if (update.role && !ADMIN_ROLES.includes(update.role)) throw new ApiError(400, 'Invalid admin role');
    if (request.body.password !== undefined) {
      if (typeof request.body.password !== 'string' || request.body.password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');
      update.passwordHash = await bcrypt.hash(request.body.password, 12);
    }

    const user = await AdminUser.findByIdAndUpdate(request.params.id, update, { new: true, runValidators: true });
    if (!user) throw new ApiError(404, 'Admin user not found');
    response.json({ success: true, data: withoutPassword(user) });
  } catch (error) {
    next(error);
  }
}
