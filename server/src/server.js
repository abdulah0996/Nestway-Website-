import 'dotenv/config';
import app from './app.js';
import connectDatabase from './config/database.js';

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error(`MongoDB connection unavailable: ${error.message}`);
    console.warn('Starting API without database access. Check MONGO_URI before using data endpoints.');
  }

  app.listen(port, () => {
    console.log(`Nestway API listening on port ${port}`);
  });
}

startServer();
