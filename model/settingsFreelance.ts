import mongoose, { Schema, model, Types } from 'mongoose'
import { IUser } from '../type/model/user.js'
import { IWorkCase } from '../type/model/workCase.js'
import { ISettingsType } from '../type/model/settingsType.js'

const settingsFreelanceSchema = new Schema<ISettingsType>({
  login: { type: String, require: true },
  platform: [{ type: String }],
  incomingCategory: [
    { platform: { type: String }, section: [{ type: String }] },
  ],
})

export const settingsFreelance = mongoose.model(
  'Settings',
  settingsFreelanceSchema
)
