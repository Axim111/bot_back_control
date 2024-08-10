import { User } from '../model/userModel.js'
import { noticeEvent } from '../model/notice.js'

import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { IUserMessages } from '../type/userMessages.js'
import { notice } from './notice.js'
import { settingsFreelance } from '../model/settingsFreelance.js'
import { userMessagesNotice } from '../model/userMessages.js'
import { bot } from '../connect/bot.js'
import { redisClient } from '../connect/redis.js'

export const noticeCreateObj = async () => {
  const users = await User.find({ notice: true })
  const noticeItems = await noticeEvent.find({})

  let userMessages: IUserMessages[] = []
  for (let user of users) {
    // await users.forEach(async (user) => {

    for (let noticeItem of noticeItems) {
      // await noticeItems.forEach(async (noticeItem) => {
      let messageContent = {
        title: noticeItem.title,

        mainTextFull: noticeItem.mainTextFull,

        section: noticeItem.section,

        price: noticeItem.price,

        from: noticeItem.from,
      }

      let createdUserMessagesByLogin = userMessages.find(
        (item) => item.userLogin === user.login
      )

      const settingsUserByLogin = await settingsFreelance.findOne({
        login: user.login,
      }) //поиск платформы
      const isUserSubscribePlatform = settingsUserByLogin?.platform.some(
        (userItemPlatform) => userItemPlatform === noticeItem.from
      )
      const findSectionListByPlatform =
        settingsUserByLogin!.incomingCategory.find(
          (settingsObjectSectionSubscribe) =>
            settingsObjectSectionSubscribe.platform === noticeItem.from
        ) //поиск секции

      const isUserSubscribeSection = findSectionListByPlatform!.section.some(
        (section) => section === noticeItem.section
      )

      if (isUserSubscribePlatform && isUserSubscribeSection) {
        // если человек подписан на сообщение, то создаём объект нотиса
        if (createdUserMessagesByLogin) {
          const createdUserMessageObjectByPlatform =
            createdUserMessagesByLogin.messagesAndPlatform.find(
              (platformMessage) => {
                return platformMessage.platform === noticeItem.from
              }
            )

          if (createdUserMessageObjectByPlatform) {
            //если есть площадка

            createdUserMessageObjectByPlatform.messages.push(messageContent)
            createdUserMessagesByLogin.messagesAndPlatform =
              createdUserMessagesByLogin.messagesAndPlatform.filter(
                (messagesAndPlatformItem) => {
                  return messagesAndPlatformItem.platform !== noticeItem.from
                }
              )

            createdUserMessagesByLogin.messagesAndPlatform.push(
              createdUserMessageObjectByPlatform
            )
          } else {
            createdUserMessagesByLogin.messagesAndPlatform.push({
              platform: noticeItem.from,
              messages: [messageContent],
            })
          }

          userMessages = userMessages.filter(
            (user) => user.userLogin !== user.userLogin
          )
          userMessages.push(createdUserMessagesByLogin)
        } else {
          userMessages.push({
            userLogin: user.login,
            messagesAndPlatform: [
              { platform: noticeItem.from, messages: [messageContent] },
            ],
          })
        }
      }
    }
    if (userMessages.length !== 0) {
      notice(userMessages)
      await redisClient.set('userMessages', JSON.stringify(userMessages))
    }

    // await userMessagesNotice.insertMany(userMessages)
  }
}

// import { User } from '../connect/model/userModel.js'
// import { NoticeEvent } from '../connect/model/notice.js'
// import { kworkCase } from '../connect/model/kworkCaseModel.js'

// import { Telegraf } from 'telegraf'
// import { message } from 'telegraf/filters'

// export const bot = new Telegraf(process.env.BOT_TOKEN, {
//   handlerTimeout: 2000000,
// })

// type typeNoticePayloadNUser = { login: string; messageContent: string }
// const NoticePayloadNUser: typeNoticePayloadNUser[] = []
// export const notice = async () => {
//   const users = await User.find({ notice: true })
//   const noticeItems = await kworkCase.find({})
//   noticeItems.forEach(async (noticeItem) => {
//     let messageContent = `
//     ${noticeItem.title}

//     ${noticeItem.mainTextFull}

//     ${noticeItem.price}

//     ${noticeItem.from}
//     `

//     users.forEach(async (user) => {
//       NoticePayloadNUser.push({ login: user.login, messageContent })
//     })
//   })
//   function* dumpGen({
//     iter,
//     mass,
//   }: {
//     iter: NodeJS.Timeout
//     mass: typeNoticePayloadNUser[]
//   }) {
//     for (let item of mass) {
//       yield bot.telegram.sendMessage(item.login, item.messageContent)
//     }
//     return clearInterval(iter)
//   }

//   const interval = () =>
//     setInterval(() => {
//       iterator.next()
//     }, 300)

//   const iterator = dumpGen({ iter: interval(), mass: NoticePayloadNUser })
// }
