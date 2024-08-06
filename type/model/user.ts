import { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  login: string
  username: string
  isActive: boolean
  email: string
  isActiveEmail: boolean
  notice: Boolean
  noticeState: { noticeFrom: string; noticeSection: string }[]
  createdAt: Schema.Types.Date
  buyMoney: Number
  refUSers: string
  noticeSection: string
  noticeFrom: string
}
