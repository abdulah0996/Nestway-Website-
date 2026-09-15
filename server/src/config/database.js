import mongoose from 'mongoose';

export default async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  mongoose.connection.on('connected', () => console.log('MongoDB connected'));
  mongoose.connection.on('error', (error) => console.error(`MongoDB error: ${error.message}`));

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
}
