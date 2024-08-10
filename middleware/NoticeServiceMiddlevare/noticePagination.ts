import { bot } from '../../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'
import { initFreelance } from '../../common/freelance/freelance.js'
import { callbackQuery } from 'telegraf/filters'
import { InlineKeyboardButton } from '@telegraf/types'
export const noticePagination = async () => {
  bot.action(/pagination/, async (ctx) => {
    if (ctx.has(callbackQuery('data'))) {
      const words = ctx.update.callback_query.data.split(/[ ]+/)
      const wordAction = words[0]
      const wordPlatform = words[1]
      const current: number = +words[2]
      const noticePaginationList = ctx.session.noticePaginationList!
      const markSettings = noticePaginationList[current - 1].reduce(
        (listButtonCase, buttonCase) => {
          listButtonCase.push([
            Markup.button.callback(
              buttonCase.title,
              'show ' +
                wordPlatform +
                ' ' +
                current +
                ' ' +
                buttonCase.title.slice(0, 25)
            ),
          ])
          return listButtonCase
        },
        [] as InlineKeyboardButton[][]
      )
      let listButtonPagination: InlineKeyboardButton[] = []
      const styleCurrent = (cur: number, isCurrent: number): string => {
        if (cur === isCurrent) {
          return `${isCurrent}^`
        } else {
          return isCurrent.toString()
        }
      }

      if (noticePaginationList.length <= 6) {
        // логика всё вместится
        for (let indexButton in noticePaginationList) {
          let indexButtonVisibleIndex = +indexButton + 1
          let itemMarkup = Markup.button.callback(
            styleCurrent(current, +indexButtonVisibleIndex),
            'pagination ' +
              wordPlatform +
              ' ' +
              (+indexButtonVisibleIndex).toString()
          )
          listButtonPagination.push(itemMarkup)
        }
      } else {
        //логика многоточий...

        listButtonPagination.push(
          Markup.button.callback(
            current - 2 > 2 ? '1...' : styleCurrent(current, 1),
            'pagination ' + wordPlatform + ' ' + '1'
          )
        )
        let indexButtonVisibleIndex = current - 2
        for (
          indexButtonVisibleIndex;
          indexButtonVisibleIndex <= current + 2;
          indexButtonVisibleIndex++
        ) {
          if (
            indexButtonVisibleIndex > 1 &&
            indexButtonVisibleIndex < noticePaginationList.length
          ) {
            let itemMarkup = Markup.button.callback(
              styleCurrent(current, +indexButtonVisibleIndex),
              'pagination ' +
                wordPlatform +
                ' ' +
                (+indexButtonVisibleIndex).toString()
            )
            listButtonPagination.push(itemMarkup)
          }
        }
        listButtonPagination.push(
          Markup.button.callback(
            current + 3 < noticePaginationList.length
              ? '...' + noticePaginationList.length.toString()
              : styleCurrent(current, noticePaginationList.length),
            'pagination ' +
              wordPlatform +
              ' ' +
              noticePaginationList.length.toString()
          )
        )
      }
      markSettings.push(listButtonPagination)

      markSettings.push([
        Markup.button.callback('back to platform', 'startPlatform'),
      ])
      // markSettings.push([
      //   Markup.button.callback('back to platform notice', 'platformNotice'),
      // ])

      ctx.session.noticeThisMenuPaginationItem =
        noticePaginationList[current - 1] // то, где show будет искать

      const text = `notice pagination`
      await ctx.editMessageText(text, {
        reply_markup: { inline_keyboard: markSettings },
      })
    }
  })
}
