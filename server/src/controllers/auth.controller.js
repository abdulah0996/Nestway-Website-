import { getAccountProfile, loginAccount, registerUser } from '../services/auth.service.js';
import { ApiError } from '../services/resource.service.js';

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }
}

export async function register(request, response, next) {
  try {
    validatePassword(request.body.password);
    const data = await registerUser(request.body);
    response.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    validatePassword(request.body.password);
    const data = await loginAccount(request.body.email, request.body.password);
    response.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function profile(request, response, next) {
  try {
    const data = await getAccountProfile(request.user);
    response.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
