import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Role } from '../models/role.model.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const registerUser = async (req, res) => {
  try {
    const { userName, email, password, roleName } = req.body;

    if (
      [userName, password, email, roleName].some(
        (field) => !field || field.trim() === ''
      )
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'All fields are required'));
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'user with email already registered'));
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'Role not found'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      role: role._id,
    });

    await user.save();

    const newUser = await User.findById(user._id).select('-password');

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, 'User registered successfully'));
  } catch (error) {
    console.log('error', error.message);
    res.status(500).json('Registration failed');
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([password, email].some((field) => !field || field.trim() === '')) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'All fields are required'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json(new ApiResponse(400, null, 'user not found'));
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'Invalid user credentials'));
    }

    const role = await Role.findOne({ _id: user?.role});

      if (!role) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, 'Role not found'));
      }

    const userData = {
      _id: user._id,
      email: user.email,
      userName: user.userName,
      role: role
    };

    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken({ _id: user._id });

    if (!accessToken || !refreshToken) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'Error in token creation'));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userData, accessToken, refreshToken },
          'Loggin success'
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'ogin failed'));
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  return res.status(200).json(new ApiResponse(200, {}, 'User logged out'));
};

const refreshAccessToken = async (req,res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json(new ApiResponse(401, null, "Refresh token required"));
          }

          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
              return res.status(403).json(new ApiResponse(403, null, "Invalid or expired refresh token"));
            }
      
            const user = await User.findById(decoded._id);
            if (!user) {
              return res.status(404).json(new ApiResponse(404, null, "User not found"));
            }
      
            const userData = {
              _id: user._id,
              email: user.email,
              username: user.username
            };
        
            const accessToken = generateAccessToken(userData);
            const newRefreshToken = generateRefreshToken({ _id: user._id });
      
            if (!accessToken || !newRefreshToken) {
              return res
                .status(400)
                .json(new ApiResponse(400, null, "Error in token creation"));
            }
        
            return res
              .status(200)
              .json(
                new ApiResponse(
                  200,
                  { accessToken, refreshToken: newRefreshToken },
                  "Access token refreshed"
                )
              );
      
          });

    } catch (error) {
        return res
      .status(500)
      .json(new ApiResponse(500, null, 'Failed to refresh access token'));
    }
}

const getUsers = async (req, res) => {
    try {
      const users = await User.find({});
  
      if (!users.length) {
        return res
          .status(200)
          .json(new ApiResponse(200, [], 'No users'));
      }
  
      return res.status(200).json(new ApiResponse(200, users, 'users retrieved successfully'));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Failed to retrieve users'));
    }
  };

  const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {

      if (req.user.id === userId) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, 'You cannot delete your own account'));
      }
      
      const deletedUser = await User.findOneAndDelete({ _id: userId });
  
      if (!deletedUser) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, 'user not found'));
      }
  
      return res.status(200).json(new ApiResponse(200, deletedUser, 'User deleted successfully'));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Failed to delete user'));
    }
  };

 const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { userName, email, roleName } = req.body;
  
      if (!userName || !email || !roleName) {
          return res
            .status(400)
            .json(new ApiResponse(400, null, 'data are required'));
        }

      const role = await Role.findOne({ name: roleName });

      if (!role) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, 'Role not found'));
      }
  
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {userName, email, role: role._id},
        { new: true }
      );
  
      if (!updatedUser) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, 'User not found or not authorized'));
      }
  
      return res.status(200).json(new ApiResponse(200, updatedUser, 'User updated successfully'));
    } catch (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Failed to update user'));
    }
  };

export { registerUser, loginUser, logoutUser, refreshAccessToken, getUsers, updateUser, deleteUser };
