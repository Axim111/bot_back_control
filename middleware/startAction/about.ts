import { bot } from '../../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'

export const about = async () => {
  bot.action('about', async (ctx) => {
    const addEmojiByStatus = (category: string) => {
      if (ctx.session.settings!.platform.includes(category)) {
        return category + ' ✅'
      }
      return category + ' ❌'
    }
    const text = `
    _______________________________________________________________
      system message:
          >_ About.init()
    _______________________________________________________________

    описание:

     бот собирает заказы с фриланс бирж/telegram каналов.

    _______________________________________________________________

    как настроить:

      уведомления -> ✅

      
      -> настройка фриланса/

          -> {платформа} -> ✅

      -> настройка фриланса/
          -> настройки платформы/
              -> категории/подкатегории.../
                  -> ✅


    как проверить:
      -> получить кейсы


    как только у нас появятся новые заказы, они к вам тоже придут

  _______________________________________________________________
    system message:
        >_ About.close()
    `
    const markProfile = [[Markup.button.callback('к началу', 'start')]]

    await ctx.editMessageText(text, {
      reply_markup: { inline_keyboard: markProfile },
    })
  })
}
