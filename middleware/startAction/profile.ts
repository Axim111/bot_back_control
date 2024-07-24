import { bot } from '../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'

export const profile = async () => {
  bot.action('profile', async (ctx: IMyContext) => {

    await ctx.reply(`
      profile:
      id: ${ctx.session?.user.id}
      username: ${ctx.session?.user.username}
      `)
  })
}
