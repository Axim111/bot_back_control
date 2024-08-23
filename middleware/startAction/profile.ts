import { bot } from '../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'

export const profile = async () => {
  bot.action('profile', async (ctx) => {
    const text = `
      profile:
      id: ${ctx.session.user?.login}
      username: ${ctx.session.user?.username}
      `
    const markProfile = [[Markup.button.callback('back to start', 'start')]]

    await ctx.editMessageText(text, {
      reply_markup: { inline_keyboard: markProfile },
    })
  })
}
