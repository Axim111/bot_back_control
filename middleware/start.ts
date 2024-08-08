import { initUser } from '../common/user/initUser.js'
import { bot } from '../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../type/session.js'
import { initFreelance } from '../common/freelance/freelance.js'
export const start = async () => {
  bot.start(async (ctx) => {
    await initUser(ctx)
    await initFreelance(ctx)
    await ctx.reply(
      'start',
      Markup.inlineKeyboard([
        [Markup.button.callback('profile', 'profile')],
        [Markup.button.callback('settings freelance', 'settings')],
        [Markup.button.callback('about the bot', 'about')],
      ])
    )
  })
  bot.action('start', async (ctx) => {
    const text = `start`
    const markProfile = [
      [Markup.button.callback('profile', 'profile')],
      [Markup.button.callback('settings freelance', 'settings')],
      [Markup.button.callback('about the bot', 'about')],
    ]

    await ctx.editMessageText(text, {
      reply_markup: { inline_keyboard: markProfile },
    })
  })
}
