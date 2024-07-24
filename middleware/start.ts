import { initUser } from '../common/user/initUser.js'
import { bot } from '../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../type/session.js'
export const start = async () => {
  bot.start(async (ctx: IMyContext) => {
    await initUser(ctx)
    await ctx.reply(
      'start',
      Markup.inlineKeyboard([
        [Markup.button.callback('profile', 'profile')],
        [Markup.button.callback('groups', 'groups')],
        [Markup.button.callback('parsing', 'parsing')],
        [Markup.button.callback('delete spam', 'deleteSpam')],
        [Markup.button.callback('about the bot', 'about')],
      ])
    )
  })
}
