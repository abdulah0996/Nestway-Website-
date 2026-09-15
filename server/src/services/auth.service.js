import bcrypt from 'bcryptjs';
import AdminUser from '../models/admin-user.model.js';
import User from '../models/user.model.js';
import { createAccessToken } from './token.service.js';
import { ApiError } from './resource.service.js';

const SALT_ROUNDS = 12;

function publicAccount(account, accountType) {
  return {
    id: account._id,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    role: account.role,
    accountType,
    ...(accountType === 'admin' ? { permissions: account.permissions || [] } : {}),
  };
}

function issueToken(account, accountType) {
  return createAccessToken({
    sub: account._id.toString(),
    accountType,
    role: account.role,
    permissions: account.permissions || [],
  });
}

export async function registerUser({ firstName, lastName, email, password, ...profile }) {
  const normalizedEmail = email.trim().toLowerCase();
  const exists = await User.exists({ email: normalizedEmail });
  if (exists) throw new ApiError(409, 'An account with this email already exists');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    firstName,
    lastName,
    email: normalizedEmail,
    passwordHash,
    phone: profile.phone,
    countryOfResidence: profile.countryOfResidence,
    preferredContactMethod: profile.preferredContactMethod,
    role: 'client',
  });

  return { user: publicAccount(user, 'user'), token: issueToken(user, 'user') };
}

export async function loginAccount(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  let account = await AdminUser.findOne({ email: normalizedEmail }).select('+passwordHash');
  let accountType = 'admin';

  if (!account) {
    account = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    accountType = 'user';
  }

  if (!account || !account.isActive || !(await bcrypt.compare(password, account.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (accountType === 'admin') {
    account.lastLoginAt = new Date();
    await account.save();
  }

  return { user: publicAccount(account, accountType), token: issueToken(account, accountType) };
}

export async function getAccountProfile({ sub, accountType }) {
  const Model = accountType === 'admin' ? AdminUser : User;
  const account = await Model.findById(sub);
  if (!account || !account.isActive) throw new ApiError(401, 'Account is unavailable');
  return publicAccount(account, accountType);
}
