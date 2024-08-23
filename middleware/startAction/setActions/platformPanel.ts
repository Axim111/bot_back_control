import { Markup } from 'telegraf'
import { bot } from '../../../connect/bot.js'
import { IMyContext } from '../../../type/session.js'
import { settingsFreelance } from '../../../model/settingsFreelance.js'
import { callbackQuery } from 'telegraf/filters'

export const kwork = async () => {
  try {
    bot.action(/platformItem|disable|enable/, async (ctx) => {
      if (ctx.has(callbackQuery('data'))) {
        const words = ctx.update.callback_query.data.split(/[ ]+/)
        const wordActin = words[0]
        const wordPlatform = words[1]
        if (wordActin === 'enable') {
          ctx.session.settings!.platform.push(wordPlatform)
          const updatedPlatform = ctx.session.settings!.platform
          const settings = await settingsFreelance.findOneAndUpdate(
            { login: ctx.session.user.login },
            { platform: updatedPlatform },
            { new: true }
          )

          if (settings) {
            ctx.session.settings = settings
          } else {
            console.log('ctx.session.settings', ' пуст')
          }
        }
        if (wordActin === 'disable') {
          const updatedPlatform = ctx.session.settings!.platform.filter(
            (item: any) => item != wordPlatform
          )
          const settings = await settingsFreelance.findOneAndUpdate(
            { login: ctx.session.user.login },
            { platform: updatedPlatform },
            { new: true }
          )
          if (settings) {
            ctx.session.settings = settings
          } else {
            console.log('ctx.session.settings', ' пуст')
          }
        }

        const text = `настройки ${wordPlatform}`
        const markSettings = [
          [
            Markup.button.callback(
              'настроить категории',
              'navigate ' + wordPlatform + ' this'
            ),
          ],

          ctx.session.settings!.platform.includes(wordPlatform)
            ? [Markup.button.callback('выключить', 'disable ' + wordPlatform)]
            : [Markup.button.callback('включить', 'enable ' + wordPlatform)],

          [Markup.button.callback('к началу', 'settings')],
        ]

        await ctx.editMessageText(text, {
          reply_markup: { inline_keyboard: markSettings },
        })
      }
    })
  } catch (err) {
    console.log(err)
  }
}
