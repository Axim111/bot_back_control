import mongoose, { Schema, model, Types } from 'mongoose'
import { IUser } from '../type/model/user.js'
import { IWorkCase } from '../type/model/workCase.js'

const nowCaseSchema = new Schema<IWorkCase>({
  title: { type: String },
  price: { type: String },
  refCase: { type: String },
  mainTextFull: { type: String },
  section: { type: String },
  feedback: { type: String },
  from: { type: String },
})
export const nowCase = mongoose.model('NowCase', nowCaseSchema)
