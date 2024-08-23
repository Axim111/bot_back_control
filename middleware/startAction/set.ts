import { bot } from '../../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'

export const set = async () => {
  try {
    bot.action('settings', async (ctx) => {
      const addEmojiByStatus = (category: string) => {
        if (ctx.session.settings!.platform.includes(category)) {
          return category + ' ✅'
        }
        return category + ' ❌'
      }
      const text = `выберите платформу`
      const markProfile = [
        [
          Markup.button.callback(
            addEmojiByStatus('kwork'),
            'platformItem kwork'
          ),
          Markup.button.callback(addEmojiByStatus('habr'), 'platformItem habr'),
        ],
        [Markup.button.callback('к старту', 'start')],
      ]

      await ctx.editMessageText(text, {
        reply_markup: { inline_keyboard: markProfile },
      })
    })
  } catch (err) {
    console.log(err)
  }
}
