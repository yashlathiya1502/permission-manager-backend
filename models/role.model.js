import mongoose, { Schema } from 'mongoose';

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  create: {
    type: Boolean,
    default: true,
  },
  update: {
    type: Boolean,
    default: true,
  },
  delete: {
    type: Boolean,
    default: true,
  },
  view: {
    type: Boolean,
    default: true,
  },
});

export const Role = new mongoose.model('Role', RoleSchema);
