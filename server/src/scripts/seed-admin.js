import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDatabase from '../config/database.js';
import AdminUser from '../models/admin-user.model.js';

const firstName = (process.env.SEED_ADMIN_FIRST_NAME || 'Nestway').trim();
const lastName = (process.env.SEED_ADMIN_LAST_NAME || 'Admin').trim();
const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be configured before seeding');
}

if (password.length < 8) {
  throw new Error('SEED_ADMIN_PASSWORD must contain at least 8 characters');
}

try {
  await connectDatabase();
  const existingAdmin = await AdminUser.exists({ email });
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await AdminUser.findOneAndUpdate(
    { email },
    {
      $set: {
        firstName,
        lastName,
        passwordHash,
        role: 'admin',
        isActive: true,
      },
      $setOnInsert: { permissions: [] },
    },
    { new: true, upsert: true, runValidators: true },
  );

  console.log(`${existingAdmin ? 'Updated' : 'Created'} admin: ${admin.email} (${admin.role})`);
} finally {
  await mongoose.connection.close();
}
