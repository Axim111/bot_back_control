import { Context } from 'telegraf'

import { User } from '@prisma/client'

interface SessionData {
  user: User | any
  callbackMessage: string
  language: string
}

export interface IMyContext extends Context {
  session?: SessionData
}
