import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDatabase from '../config/database.js';
import AdminUser from '../models/admin-user.model.js';

const firstName = (process.env.SEED_CONSULTANT_FIRST_NAME || 'Umar').trim();
const lastName = (process.env.SEED_CONSULTANT_LAST_NAME || 'Hanan Baig').trim();
const email = process.env.SEED_CONSULTANT_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_CONSULTANT_PASSWORD;

if (!email || !password) {
  throw new Error('SEED_CONSULTANT_EMAIL and SEED_CONSULTANT_PASSWORD must be configured before seeding');
}

if (password.length < 8) {
  throw new Error('SEED_CONSULTANT_PASSWORD must contain at least 8 characters');
}

try {
  await connectDatabase();
  const existingConsultant = await AdminUser.exists({ email });
  const consultant = await AdminUser.findOneAndUpdate(
    { email },
    {
      $set: {
        firstName,
        lastName,
        passwordHash: await bcrypt.hash(password, 12),
        role: 'consultant',
        isActive: true,
      },
      $setOnInsert: { permissions: [] },
    },
    { new: true, upsert: true, runValidators: true },
  );
  console.log(`${existingConsultant ? 'Updated' : 'Created'} consultant: ${consultant.email} (${consultant.role})`);
} finally {
  await mongoose.connection.close();
}
