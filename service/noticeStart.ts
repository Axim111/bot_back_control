import { User } from '../model/userModel.js'
import { noticeEvent } from '../model/notice.js'

import { Markup, Telegraf } from 'telegraf'
import { callbackQuery, message } from 'telegraf/filters'
import { IUserMessages } from '../type/userMessages.js'
import { InlineKeyboardButton } from '@telegraf/types'
import { bot } from '../connect/bot.js'
import { errors } from 'telegram'
import { settingsFreelance } from '../model/settingsFreelance.js'
import { redisClient } from '../connect/redis.js'

export const noticeStart = async (userMessages: IUserMessages[]) => {
  // bot.telegram.sendMessage(user.login, messageContent)
  let inline_keyboard_list: InlineKeyboardButton[][] = []
  let indexUserMessage = 0
  // userMessages.forEach((userMessage, indexUserMessage) => {
  for (let userMessage of userMessages) {
    indexUserMessage += 1
    setTimeout(async () => {
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
      // console.log(inline_keyboard_list)
      try {
        await bot.telegram.sendMessage(
          userMessage.userLogin,
          'кейсы',
          {
            reply_markup: { inline_keyboard: inline_keyboard_list },
          }
        )
      } catch (err: any) {
        console.log(err)
        if ('response' in err) {
          if ('error_code' in err.response)
            if (err.response.error_code === 403) {
              try {
                await User.deleteOne({ login: userMessage.userLogin })
                await settingsFreelance.deleteOne({
                  login: userMessage.userLogin,
                })
                await redisClient.del(userMessage.userLogin)
              } catch (err) {
                console.log(err)
              }
            }
        }
      }
    }, indexUserMessage * 50)
    inline_keyboard_list = []
  }
}
