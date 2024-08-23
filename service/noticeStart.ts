import { User } from '../model/userModel.js'
import { noticeEvent } from '../model/notice.js'

import { Markup, Telegraf } from 'telegraf'
import { callbackQuery, message } from 'telegraf/filters'
import { IUserMessages } from '../type/userMessages.js'
import { InlineKeyboardButton } from '@telegraf/types'
import { bot } from '../connect/bot.js'

export const noticeStart = async (userMessages: IUserMessages[]) => {
  // bot.telegram.sendMessage(user.login, messageContent)
  let inline_keyboard_list: InlineKeyboardButton[][] = []

  userMessages.forEach((userMessage, indexUserMessage) => {
    setTimeout(() => {
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
      bot.telegram.sendMessage(userMessage.userLogin, 'start notice platform', {
        reply_markup: { inline_keyboard: inline_keyboard_list },
      })
    }, indexUserMessage * 50)
    inline_keyboard_list = []
  })
}
