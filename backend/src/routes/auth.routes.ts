import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// Wrap async handlers if Express 5 isn't used (Manual implementation style for compatibility)
// Note: In Express 4, if a controller is async but doesn't return a promise passed to next(), 
// errors might hang. However, here we are handling errors carefully inside the controller.
router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));

export default router;
