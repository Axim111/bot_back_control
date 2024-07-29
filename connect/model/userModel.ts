import mongoose, { Schema, model, Types } from 'mongoose'
import { IUser } from '../../type/user.js'

const userSchema = new Schema<IUser>({
  _id: { type: String },
  username: { type: String },
  isActive: { type: Boolean, default: false },
  email: { type: String, default: '' },
  isActiveEmail: { type: Boolean, default: false },

  notice: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  refUSers: { type: String, ref: 'User' },
})
export const User = mongoose.model('User', userSchema)
