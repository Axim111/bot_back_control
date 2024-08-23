import { bot } from '../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'

export const profile = async () => {
  bot.action('profile', async (ctx) => {
    
    try {
      const text = `
        профиль:
        id: ${ctx.session.user?.login}
        никнейм: ${ctx.session.user?.username}
        `
      const markProfile = [[Markup.button.callback('к старту', 'start')]]

      await ctx.editMessageText(text, {
        reply_markup: { inline_keyboard: markProfile },
      })
    } catch (err) {
      console.log(err)
    }
  })
}
