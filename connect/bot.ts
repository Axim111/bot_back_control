import { Telegraf, session, Markup } from 'telegraf'
export const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(
  session({
    defaultSession: () => ({}),
  })
)
