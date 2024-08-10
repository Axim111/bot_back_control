import { bot } from '../../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'
import { initFreelance } from '../../common/freelance/freelance.js'
import { callbackQuery } from 'telegraf/filters'
import { InlineKeyboardButton } from '@telegraf/types'
import { redisClient } from '../../connect/redis.js'
import { IUserMessages } from '../../type/userMessages.js'
export const startNoticePlatform = async () => {
  bot.action(/startPlatform/, async (ctx) => {
    if (ctx.has(callbackQuery('data'))) {
      const words = ctx.update.callback_query.data.split(/[ ]+/)

      let inline_keyboard_list: InlineKeyboardButton[][] = []
      const userMessageList: IUserMessages[] = JSON.parse(
        (await redisClient.get('userMessages')) || ''
      )
      const userMessage = userMessageList.find(
        (userMessageItem) =>
          userMessageItem.userLogin === ctx.from.id.toString()
      )!

      inline_keyboard_list = userMessage.messagesAndPlatform.reduce(
        (acc, message) => {
          acc.push([
            Markup.button.callback(
              message.platform,
              'enterPlatform' + ' ' + message.platform
            ),
          ])
          return acc
        },
        [] as InlineKeyboardButton[][]
      )

      const text = `start notice platform`

      await ctx.editMessageText(text, {
        reply_markup: { inline_keyboard: inline_keyboard_list },
      })
    }
  })
}
