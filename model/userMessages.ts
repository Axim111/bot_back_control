import mongoose, { Schema, model, Types } from 'mongoose'
import { IUser } from '../type/model/user.js'
import { IUserMessages } from '../type/userMessages.js'



const userMessagesNoticeSchema = new Schema<IUserMessages>({
userLogin:{type:String},
messagesAndPlatform:[{
  platform:{type:String},
  methods:[{type:String}]
}]
})
export const userMessagesNotice = mongoose.model('UserMessages', userMessagesNoticeSchema)
