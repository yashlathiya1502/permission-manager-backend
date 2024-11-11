import { Router } from 'express';
import {
    deleteUser,
  getUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUser,
} from '../controllers/user.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { checkPermissions } from '../middleware/checkPermisson.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', authenticateJWT, logoutUser);
router.get('/getAllUsers', authenticateJWT,checkPermissions('view'), getUsers);
router.put('/update/:userId', authenticateJWT,checkPermissions('update'), updateUser);
router.delete('/delete/:userId', authenticateJWT,checkPermissions('delete'), deleteUser);

export default router;
