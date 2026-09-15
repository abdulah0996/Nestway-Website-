export function requireBodyFields(...fields) {
  return (request, response, next) => {
    const missing = fields.filter((field) => {
      const value = request.body?.[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return response.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
    }

    return next();
  };
}

export function validateEnum(field, values) {
  return (request, response, next) => {
    const value = request.body?.[field];
    if (value !== undefined && !values.includes(value)) {
      return response.status(400).json({ success: false, message: `${field} must be one of: ${values.join(', ')}` });
    }

    return next();
  };
}

export function validateQueryEnum(field, values) {
  return (request, response, next) => {
    const value = request.query?.[field];
    if (value !== undefined && !values.includes(value)) {
      return response.status(400).json({ success: false, message: `${field} must be one of: ${values.join(', ')}` });
    }
    return next();
  };
}
