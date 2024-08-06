import { Context } from 'telegraf'
import { IUser } from './model/user.js'
import { ISettingsType } from './model/settingsType.js'
import { INavigation, INavigationDocument } from './model/navigationType.js'

interface SessionData {
  user: IUser | any

  language: string
  settings: ISettingsType|null
  platform: string
  navigateOptions: INavigationDocument[]
  lastNavigation: INavigation | null
  actionRout:{endSectionBackWord:string}
}

export interface IMyContext extends Context {
  session: SessionData
  // update:Context["update"]&{
  //   callback_query:{data:string}
  // }
}
// export type IMyContext = Context & {
//   session:SessionData
// }
