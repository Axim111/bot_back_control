import { Telegraf, session, Markup } from 'telegraf'
import { IMyContext } from '../type/session.js'

export const bot = new Telegraf<IMyContext>(process.env.BOT_TOKEN, {
  handlerTimeout: 2000000,
})
bot.use(
  session({
    defaultSession: () => ({
      user: 'init',

      language: 'ru',
      settings: null,
      platform: 'init',
      navigateOptions: [],
      lastNavigation: null,
      actionRout:{endSectionBackWord:""}
    }),
  })
)
