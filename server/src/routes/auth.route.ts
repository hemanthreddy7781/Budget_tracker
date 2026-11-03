import { Router } from 'express';
import { z } from 'zod';
import { register, login, me } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(190),
  password: z.string().min(8).max(72),
});
const loginSchema = z.object({ email:z.string().trim().email(), password:z.string().min(1).max(72) });
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, me);
export default router;
