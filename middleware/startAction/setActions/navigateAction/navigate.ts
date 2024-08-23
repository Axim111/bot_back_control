import { bot } from '../../../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../../../type/session.js'
import { callbackQuery } from 'telegraf/filters'
import { navigate } from '../../../../model/navigate.js'
import { settingsFreelance } from '../../../../model/settingsFreelance.js'

export const navigatePlatform = async () => {
  bot.action(/navigate|Next/, async (ctx) => {
    try {
      if (ctx.has(callbackQuery('data'))) {
        const words = ctx.update.callback_query.data.split(/[ ]+/)
        const wordAction = words[0]
        const wordPlatform = words[1]
        const backText = words.slice(2).join(' ')
        let markProfile = []

        if (wordAction === 'navigate') {
          ctx.session.navigateOptions = await navigate.find({
            platform: wordPlatform,
          })
        }
        const lastSection = ctx.session.navigateOptions.filter((item) =>
          item.text.match(new RegExp(`${backText}`, 'i'))
        )[0]
        ctx.session.lastNavigation = lastSection

        const navigateInCategoryCases = ctx.session.navigateOptions.filter(
          (item) => item.back == backText
        )

        navigateInCategoryCases.forEach((item) => {
          let textActionCallback =
            item.text.length <= 20 ? item.text : item.text.slice(0, 20)
          if (!item.nextEnd) {
            markProfile.push([
              Markup.button.callback(
                item.text,
                'Next ' + wordPlatform + ' ' + textActionCallback
              ),
            ])
          } else {
            markProfile.push([
              Markup.button.callback(
                item.text,
                'end ' + wordPlatform + ' ' + textActionCallback
              ),
            ])
          }
        })

        if (backText == 'this') {
          markProfile.push([
            Markup.button.callback(
              'back to, ' + wordPlatform,
              'platformItem ' + wordPlatform
            ),
          ])
        } else {
          markProfile.push([
            Markup.button.callback(
              'back',
              'Next ' + wordPlatform + ' ' + lastSection!.back
            ),
          ])
        }

        const text = wordPlatform

        await ctx.editMessageText(text, {
          reply_markup: { inline_keyboard: markProfile },
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
}
