import { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  login: string
  username: string
  isActive: boolean
  email: string
  isActiveEmail: boolean
  notice: Boolean
  createdAt: Schema.Types.Date
  buyMoney: Number
  noticeSection: string
  noticeFrom: string
  keyWord:string
  
}
