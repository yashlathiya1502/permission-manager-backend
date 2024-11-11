import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
  },
  {
    timestamps: true,
  }
);

export const User = new mongoose.model('User', UserSchema);
