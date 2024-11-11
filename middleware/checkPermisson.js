import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const checkPermissions = (permission) => {
  return async (req, res, next) => {
      try {
        const user = await User.findById(req.user.id).populate('role');
      if (user.role[permission]) {
        next();
      } else {
        return res
          .status(400)
          .json(new ApiResponse(400, null, 'Access denied: permission not granted'));
      }
    } catch (error) {
      return res
          .status(500)
          .json(new ApiResponse(500, null, 'Role not found'));
    }
  };
};
