import { Router } from "express";
import { createRole, deleteRole, getRoles, updateRolePermissions } from "../controllers/role.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
import { checkPermissions } from "../middleware/checkPermisson.js";

const router = Router();

router.post('/create',authenticateJWT, checkPermissions('create'), createRole);
router.get('/getAllRoles', authenticateJWT,checkPermissions('view'), getRoles);
router.delete('/delete/:roleId', authenticateJWT,checkPermissions('delete'), deleteRole);
router.put('/update/permissions/:roleId', authenticateJWT, checkPermissions('update'), updateRolePermissions);

export default router;
