import { Role } from '../models/role.model.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});

    if (!roles.length) {
      return res.status(200).json(new ApiResponse(200, [], 'No roles'));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, roles, 'roles retrieved successfully'));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Failed to retrieve roles'));
  }
};

const createRole = async (req, res) => {
    try {
        const { name } = req.body;
  
      if (
        [name].some(
          (field) => !field || field.trim() === ''
        )
      ) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, 'role name required'));
      }
      const existedRole = await Role.findOne({ name });
      
      if (existedRole) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, 'role already registered'));
      }

      const role = await Role.create({
        name,
      });
      
      return res
        .status(201)
        .json(new ApiResponse(201, role, 'role register successfully'));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Failed to retrieve roles'));
    }
  };

const deleteRole = async (req, res) => {
    const { roleId } = req.params;
    try {
      const usersWithRole = await User.findOne({ role: roleId });

      if (usersWithRole) {
        return res
          .status(400)
          .json({ status: 400, message: 'Role cannot be deleted as it is assigned to one or more users' });
      }

      const deletedRole = await Role.findOneAndDelete({ _id: roleId });
  
      if (!deletedRole) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, 'role not found'));
      }
  
      return res.status(200).json(new ApiResponse(200, deletedRole, 'role deleted successfully'));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Failed to delete role'));
    }
  };

  const updateRolePermissions = async (req, res) => {
    const { roleId } = req.params;
    const { create, update, delete: deletePermission, view } = req.body;
  
    try {
      const updatedRole = await Role.findByIdAndUpdate(
        roleId,
        { create, update, delete: deletePermission, view },
        { new: true }
      );
  
      if (!updatedRole) {
        return res.status(404).json(new ApiResponse(404, null, 'Role not found'));
      }
  
      return res.status(200).json(new ApiResponse(200, updatedRole, 'Permissions updated successfully'));
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, null, 'Failed to update permissions'));
    }
  };

  export { getRoles,createRole, deleteRole, updateRolePermissions };
