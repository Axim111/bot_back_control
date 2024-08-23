import { bot } from '../../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'
import { initFreelance } from '../../common/freelance/freelance.js'
import { callbackQuery } from 'telegraf/filters'
export const showNotice = async () => {
  bot.action(/show/, async (ctx) => {
    try {
      if (ctx.has(callbackQuery('data'))) {
        const words = ctx.update.callback_query.data.split(/[ ]+/)
        const wordAction = words[0]
        const wordPlatform = words[1]
        const wordPaginationNumber = words[2]
        const textTile = words.slice(3).join(' ')
        const thisMessageStructureItem =
          ctx.session.noticeThisMenuPaginationItem?.find(
            (messageStructureItem) =>
              messageStructureItem.title.match(new RegExp(`${textTile}`, 'i'))
          )
        const text = `кейс
  
        секция: ${thisMessageStructureItem?.section}
  
  
        название: ${thisMessageStructureItem?.title}
  
  
        описание: ${thisMessageStructureItem?.mainTextFull}
  
             
  
        цена: ${thisMessageStructureItem?.price}
  
        ссылка: ${thisMessageStructureItem?.refCase}
  
        платформа: ${thisMessageStructureItem?.from}
        `
        const markShow = [
          [
            Markup.button.callback(
              `страница ${wordPaginationNumber}`,
              'pagination ' + wordPlatform + ' ' + wordPaginationNumber
            ),
          ],
        ]
        await ctx.editMessageText(text, {
          reply_markup: { inline_keyboard: markShow },
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
}
