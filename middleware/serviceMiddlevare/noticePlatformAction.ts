import { callbackQuery } from 'telegraf/filters'
import { Markup } from 'telegraf'
import { bot } from '../../connect/bot.js'
import { redisClient } from '../../connect/redis.js'
import { IUserMessages } from '../../type/userMessages.js'

export const noticePlatformAction = async () => {
  bot.action(/platformNotice/, async (ctx) => {
    if (ctx.has(callbackQuery('data'))) {
      const words = ctx.update.callback_query.data.split(/[ ]+/)
      const wordPlatform = words[1]
      const noticeMessage: IUserMessages[] | '' = JSON.parse(
        (await redisClient.get('userMessages')) || ''
      )

      if (noticeMessage) {
        const noticeByUSer = noticeMessage.find(
          (userMessageItem) =>
            userMessageItem.userLogin === ctx.session.user.login
        )
        const noticeByPlatform = noticeByUSer?.messagesAndPlatform.find(
          (userMessagesAndPlatformItem) =>
            userMessagesAndPlatformItem.platform === wordPlatform
        )
        const messageNoticeRowList = noticeByPlatform!.messages
        const noticePaginationList: string[][] = [] // делаем пагинацию(группируем в массиве массивы)
        let temporaryNoticeForPagination: string[] = []
        messageNoticeRowList.forEach((item, id) => {
          if ((id + 1) % 5 === 0) {
            temporaryNoticeForPagination.push(item)
            noticePaginationList.push(temporaryNoticeForPagination)
            temporaryNoticeForPagination = []
          } else {
            temporaryNoticeForPagination.push(item)
          }
          if (id + 1 === messageNoticeRowList.length) {
            if (temporaryNoticeForPagination.length !== 0) {
              noticePaginationList.push(temporaryNoticeForPagination)
            }
          }
        })
        console.log(noticePaginationList)
        // const markPagination =
        // const text = `notice pagination`
        // await ctx.editMessageText(text, {
        //   reply_markup: { inline_keyboard: markSettings },
        // })
      }
    }
  })
}
