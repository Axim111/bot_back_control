import { bot } from '../../connect/bot.js'
import { Markup } from 'telegraf'

export const keyWord = async () => {
  bot.action('keyWord', async (ctx) => {
    try {
      let text = ``
      let markProfile = []
      if (ctx.session.user.keyWord) {
        text = ctx.session.user.keyWord
        markProfile = [
          [Markup.button.callback('изменить ключевые слова', 'editKeyWord')],
          [Markup.button.callback('очистить ключевые слова', 'clearKeyWord')],
          [Markup.button.callback('back to start', 'start')],
        ]
      } else {
        text = `у вас нет ключевых слов`
        markProfile = [
          [Markup.button.callback('добавить ключевые слова', 'editKeyWord')],
          [Markup.button.callback('очистить ключевые слова', 'clearKeyWord')],
          [Markup.button.callback('back to start', 'start')],
        ]
      }

      await ctx.editMessageText(text, {
        reply_markup: { inline_keyboard: markProfile },
      })
    } catch (err) {
      console.log(err)
    }
  })
}
