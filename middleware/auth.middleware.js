import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';

export const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, 'Unauthorized request'));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      throw new ApiResponse(401, null,'Invalid Access Token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiResponse(401,null, error?.message || 'Invalid access Token');
  }
};
