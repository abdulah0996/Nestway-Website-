export function notFound(request, response) {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

export function errorHandler(error, _request, response, _next) {
  const validationError = error.name === 'ValidationError';
  const castError = error.name === 'CastError';
  const statusCode = error.statusCode
    || (error.name === 'MongoServerError' && error.code === 11000 ? 409 : null)
    || (validationError || castError ? 400 : 500);
  const message = error.code === 11000
    ? 'A record with a unique value already exists'
    : validationError
      ? Object.values(error.errors).map((item) => item.message).join('; ')
      : castError ? `Invalid ${error.path}` : error.message;

  response.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : message,
  });
}
