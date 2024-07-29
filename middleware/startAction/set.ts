import { bot } from '../../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'

export const set = async () => {
  bot.action('set', async (ctx: IMyContext) => {
    const text = `set you freelance exchanges`
    const markProfile = [
      [Markup.button.callback('kwork', 'kwork')],
      [Markup.button.callback('back to start', 'start')],
    ]


    await ctx.editMessageText(text, {
      reply_markup: { inline_keyboard: markProfile },
    })
  })
}
