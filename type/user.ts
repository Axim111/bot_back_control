import { Schema } from 'mongoose'

export interface IUser {
  _id: string
  username: string
  isActive: boolean
  email: string
  isActiveEmail: boolean
  notice: Boolean
  createdAt: Schema.Types.Date
  buyMoney: Number
  refUSers: string
}
