import mongoose from 'mongoose';

export function getHealth(_request, response) {
  const databaseState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  response.status(200).json({
    success: true,
    service: 'nestway-api',
    status: 'ok',
    database: databaseState,
    timestamp: new Date().toISOString(),
  });
}
