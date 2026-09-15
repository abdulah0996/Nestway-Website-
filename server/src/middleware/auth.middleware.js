import jwt from 'jsonwebtoken';

export function requireAuth(request, response, next) {
  const authorization = request.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

  if (!token) {
    return response.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT secret unavailable');
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

export const ROLE_PERMISSIONS = Object.freeze({
  admin: ['*'],
  consultant: ['leads:view_assigned', 'leads:update_assigned', 'leads:notes_assigned'],
});

function permissionsFor(user) {
  return new Set([
    ...(ROLE_PERMISSIONS[user?.role] || []),
    ...(user?.role === 'admin' ? user.permissions || [] : []),
  ]);
}

export function requireRoles(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    return next();
  };
}

export function requirePermission(permission) {
  return (request, response, next) => {
    const permissions = permissionsFor(request.user);

    const cmsPermissions = new Set([
      'blogs:manage', 'services:manage', 'countries:manage', 'faqs:manage',
      'pathways:manage', 'universities:manage', 'testimonials:manage', 'team_members:manage', 'offices:manage',
    ]);
    const hasPermission = permissions.has('*')
      || permissions.has(permission)
      || (cmsPermissions.has(permission) && permissions.has('cms:manage'));
    if (!request.user || !hasPermission) {
      return response.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    return next();
  };
}

export function requireAnyPermission(...requiredPermissions) {
  return (request, response, next) => {
    const permissions = permissionsFor(request.user);
    const allowed = permissions.has('*') || requiredPermissions.some((permission) => permissions.has(permission));
    if (!request.user || !allowed) {
      return response.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    return next();
  };
}
