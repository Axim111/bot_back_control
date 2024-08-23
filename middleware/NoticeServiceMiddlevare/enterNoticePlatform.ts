import { callbackQuery } from 'telegraf/filters'
import { Markup } from 'telegraf'
import { bot } from '../../connect/bot.js'
import { redisClient } from '../../connect/redis.js'
import { IMessage, IUserMessages } from '../../type/userMessages.js'
import { InlineKeyboardButton } from '@telegraf/types'
import { messageTransport } from '../../model/messageTransport.js'

export const enterNoticePlatform = async () => {
  bot.action(/enterPlatform/, async (ctx) => {
    if (ctx.has(callbackQuery('data'))) {
      const words = ctx.update.callback_query.data.split(/[ ]+/)
      const wordPlatform = words[1]
      const noticeMessageByUSer: IUserMessages | null =
        await messageTransport.findOne({ userLogin: ctx.session.user.login })

      // console.log(noticeMessageByUSer)

      // const noticeMessage: IUserMessages[] | '' = JSON.parse(
      //   (await redisClient.get('userMessages')) || ''
      // )
      
      if (noticeMessageByUSer) {
        const noticeByPlatform = noticeMessageByUSer!.messagesAndPlatform.find(
          (userMessagesAndPlatformItem) =>
            userMessagesAndPlatformItem.platform === wordPlatform
        )!.messages

        const noticePaginationList: IMessage[][] = [] // делаем пагинацию(группируем в массиве массивы)
        let temporaryNoticeForPagination: IMessage[] = []
        noticeByPlatform.forEach((item, id) => {
          if ((id + 1) % 5 === 0) {
            temporaryNoticeForPagination.push(item)
            noticePaginationList.push(temporaryNoticeForPagination)
            temporaryNoticeForPagination = []
          } else {
            temporaryNoticeForPagination.push(item)
          }
          if (id + 1 === noticeByPlatform.length) {
            if (temporaryNoticeForPagination.length !== 0) {
              noticePaginationList.push(temporaryNoticeForPagination)
            }
          }
        })
        ctx.session.noticePaginationList = noticePaginationList
        const current = 1
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
        //заполняем пагинацию

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
          if (noticePaginationList.length !== 1) {
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
                : noticePaginationList.length.toString(),
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
        const markPagination = noticePaginationList
        const text = `notice pagination`
        await ctx.editMessageText(text, {
          reply_markup: { inline_keyboard: markSettings },
        })
      }
    }
  })
}
