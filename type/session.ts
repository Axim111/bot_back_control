import { Context } from 'telegraf'
import { IUser } from './user.js'



interface SessionData {
  user: IUser | any
  callbackMessage: string
  language: string
}

export interface IMyContext extends Context {
  session?: SessionData
}
