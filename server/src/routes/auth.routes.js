import { Router } from 'express';
import { login, profile, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireBodyFields } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/register', requireBodyFields('firstName', 'lastName', 'email', 'password'), register);
router.post('/login', requireBodyFields('email', 'password'), login);
router.get('/profile', requireAuth, profile);

export default router;
