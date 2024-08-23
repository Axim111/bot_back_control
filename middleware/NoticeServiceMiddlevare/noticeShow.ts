import { bot } from '../../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'
import { initFreelance } from '../../common/freelance/freelance.js'
import { callbackQuery } from 'telegraf/filters'
export const showNotice = async () => {
  bot.action(/show/, async (ctx) => {
    if (ctx.has(callbackQuery('data'))) {
      const words = ctx.update.callback_query.data.split(/[ ]+/)
      const wordAction = words[0]
      const wordPlatform = words[1]
      const wordPaginationNumber = words[2]
      const textTile = words.slice(3).join(' ')
      const thisMessageStructureItem =
        ctx.session.noticeThisMenuPaginationItem?.find((messageStructureItem) =>
          messageStructureItem.title.match(new RegExp(`${textTile}`, 'i'))
        )
      const text = `thisNotice

      section: ${thisMessageStructureItem?.section}


      title: ${thisMessageStructureItem?.title}


      mainTextFull: ${thisMessageStructureItem?.mainTextFull}

           

      price: ${thisMessageStructureItem?.price}

      refCase: ${thisMessageStructureItem?.refCase}

      from: ${thisMessageStructureItem?.from}
      `
      const markShow = [
        [
          Markup.button.callback(
            `back to ${wordPaginationNumber}`,
            'pagination ' + wordPlatform + ' ' + wordPaginationNumber
          ),
        ],
      ]
      await ctx.editMessageText(text, {
        reply_markup: { inline_keyboard: markShow },
      })
    }
  })
}
