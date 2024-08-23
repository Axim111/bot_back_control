import mongoose, { Schema, model, Types } from 'mongoose'
import { IUser } from '../type/model/user.js'
import { IWorkCase } from '../type/model/workCase.js'
import { IMessage, IUserMessages } from '../type/userMessages.js'


const messageNoticeItemSchema = new Schema<IMessage>({
  title: { type: String },
  mainTextFull: { type: String },
  section: { type: String },
  price: { type: String },
  refCase: { type: String },
  from: { type: String },
})
const messageTransportSchema = new Schema<IUserMessages>({
  userLogin:{type:String},
  messagesAndPlatform:[{platform:{type:String},messages:[messageNoticeItemSchema]}]
})
export const messageTransport = mongoose.model('messageTransport', messageTransportSchema)
