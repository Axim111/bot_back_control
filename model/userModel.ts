import mongoose, { Schema, model, Types } from 'mongoose'
import { IUser } from '../type/model/user.js'



const userSchema = new Schema<IUser>({
  login: { type: String },
  username: { type: String },
  isActive: { type: Boolean, default: false },
  email: { type: String, default: '' },
  isActiveEmail: { type: Boolean, default: false },

  notice: { type: Boolean, default: true },
 

  createdAt: { type: Date, default: Date.now },
  refUSers: { type: String, ref: 'User' },
})
export const User = mongoose.model('User', userSchema)
