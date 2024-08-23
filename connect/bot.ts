import { Telegraf, session, Scenes, Context } from 'telegraf'
import { IMyContext } from '../type/session.js'
import { keyWord } from './scenes/keyWordScene.js'
export const bot = new Telegraf<IMyContext>(process.env.BOT_TOKEN, {
  handlerTimeout: 2000000,
})
const stage = new Scenes.Stage([keyWord])
bot.use(
  session({
    defaultSession: () => ({
      user: 'init',

      language: 'ru',
      settings: null,
      platform: 'init',
      navigateOptions: [],
      lastNavigation: null,
      actionRout: { endSectionBackWord: '' },
      objectNotice: [],

      noticePaginationList: null,
      noticeThisMenuPaginationItem: null,
    }),
  })
)
bot.use(stage.middleware())