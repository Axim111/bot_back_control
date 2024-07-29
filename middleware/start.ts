import { initUser } from '../common/user/initUser.js'
import { bot } from '../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../type/session.js'
export const start = async () => {
  bot.start(async (ctx: IMyContext) => {
    await initUser(ctx)
    await ctx.reply(
      'start',
      Markup.inlineKeyboard([
        [Markup.button.callback('profile', 'profile')],
        [Markup.button.callback('set', 'set')],
        [Markup.button.callback('about the bot', 'about')],
      ])
    )
  })
  bot.action('start', async (ctx) => {
    const text = `start`
    const markProfile = [
      [Markup.button.callback('profile', 'profile')],
      [Markup.button.callback('set', 'set')],
      [Markup.button.callback('about the bot', 'about')],
    ]

    await ctx.editMessageText(text, {
      reply_markup: { inline_keyboard: markProfile },
    })
  })
}
