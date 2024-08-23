import { Context, Scenes } from 'telegraf'
import { IUser } from './model/user.js'
import { ISettingsType } from './model/settingsType.js'
import { INavigation, INavigationDocument } from './model/navigationType.js'
import { IMessage, IUserMessages } from './userMessages.js'

interface MyWizardSession extends Scenes.WizardSessionData {
  // will be available under `ctx.scene.session.myWizardSessionProp`
  keyWordType: string
}
interface sessionDate extends Scenes.WizardSession<MyWizardSession> {
  user: IUser | any
  language: string
  settings: ISettingsType | null
  platform: string
  navigateOptions: INavigationDocument[]
  lastNavigation: INavigation | null
  actionRout: { endSectionBackWord: string }
  objectNotice: IUserMessages[]
  noticePaginationList: IMessage[][] | null
  noticeThisMenuPaginationItem: IMessage[] | null
}

export interface IMyContext extends Context {
  session: sessionDate

  scene: Scenes.SceneContextScene<IMyContext, MyWizardSession>
  wizard: Scenes.WizardContextWizard<IMyContext>

  // update:Context["update"]&{
  //   callback_query:{data:string}
  // }
}

// export type IMyContext = Context & {
//   session:session
// }
