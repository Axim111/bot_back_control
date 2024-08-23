import mongoose, { Schema, model, Types } from 'mongoose'
import { IUser } from '../type/model/user.js'
import { ITelegramNotice } from './../type/model/telegramNotice.js';



const telegramNoticeSchema = new Schema<ITelegramNotice>({
  chatName: { type: String },
  chatId:{type:String},
  lastMessageCheck:{type:Number},
  notice: [{type:String}],
})
export const telegramNotice = mongoose.model('telegramNotice', telegramNoticeSchema)
