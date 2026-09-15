import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import AdminUser from '../src/models/admin-user.model.js';
import { requireAuth, requirePermission } from '../src/middleware/auth.middleware.js';
import { loginAccount } from '../src/services/auth.service.js';

process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long';

function checkPermission(role, permission) {
  let passed = false;
  let status;
  const middleware = requirePermission(permission);
  middleware(
    { user: { role, permissions: [] } },
    { status(code) { status = code; return this; }, json() { return this; } },
    () => { passed = true; },
  );
  return { passed, status };
}

function checkCustomPermission(role, permission) {
  let passed = false;
  let status;
  requirePermission(permission)(
    { user: { role, permissions: ['*'] } },
    { status(code) { status = code; return this; }, json() { return this; } },
    () => { passed = true; },
  );
  return { passed, status };
}

test('role permission matrix restricts CMS resources', () => {
  assert.equal(checkPermission('admin', 'universities:manage').passed, true);
  assert.equal(checkPermission('admin', 'appointments:manage').passed, true);
  assert.equal(checkPermission('admin', 'admin_users:view').passed, true);
  assert.equal(checkPermission('consultant', 'leads:view_assigned').passed, true);
  assert.equal(checkPermission('consultant', 'leads:update_assigned').passed, true);
  assert.equal(checkPermission('consultant', 'leads:notes_assigned').passed, true);
  assert.equal(checkPermission('consultant', 'blogs:manage').status, 403);
  assert.equal(checkPermission('consultant', 'appointments:manage').status, 403);
  assert.equal(checkPermission('consultant', 'dashboard:view').status, 403);
  assert.equal(checkCustomPermission('consultant', 'dashboard:view').status, 403);
});

test('protected route rejects requests without a token', async (context) => {
  const server = app.listen(0);
  context.after(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/auth/profile`);
  assert.equal(response.status, 401);
});

test('valid JWT is verified and attached to the request', () => {
  const token = jwt.sign({ sub: '507f1f77bcf86cd799439011', accountType: 'user', role: 'client' }, process.env.JWT_SECRET);
  const request = { headers: { authorization: `Bearer ${token}` } };
  let passed = false;
  requireAuth(request, { status() { return this; }, json() { return this; } }, () => { passed = true; });
  assert.equal(passed, true);
  assert.equal(request.user.role, 'client');
});

test('admin login verifies a bcrypt password and returns a usable JWT', async (context) => {
  const originalFindOne = AdminUser.findOne;
  context.after(() => { AdminUser.findOne = originalFindOne; });
  const account = {
    _id: { toString: () => '507f1f77bcf86cd799439011' },
    firstName: 'Nestway', lastName: 'Admin', email: 'admin@nestway.local',
    role: 'admin', permissions: [], isActive: true,
    passwordHash: await bcrypt.hash('NestwayDev!2026', 4),
    async save() {},
  };
  AdminUser.findOne = () => ({ select: async () => account });

  const result = await loginAccount('ADMIN@NESTWAY.LOCAL', 'NestwayDev!2026');
  const payload = jwt.verify(result.token, process.env.JWT_SECRET);
  assert.equal(result.user.role, 'admin');
  assert.equal(payload.accountType, 'admin');
  assert.equal(payload.sub, '507f1f77bcf86cd799439011');
});
