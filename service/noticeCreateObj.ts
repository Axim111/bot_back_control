import { User } from '../model/userModel.js'
import { noticeEvent } from '../model/notice.js'

import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { IUserMessages } from '../type/userMessages.js'
import { noticeStart } from './noticeStart.js'
import { settingsFreelance } from '../model/settingsFreelance.js'
import { userMessagesNotice } from '../model/userMessages.js'
import { bot } from '../connect/bot.js'
import { redisClient } from '../connect/redis.js'
import { messageTransport } from '../model/messageTransport.js'
import { IUser } from '../type/model/user.js'
import { calculationNotice } from './calculationNotice.js'

export const noticeCreateObj = async () => {
  const users = await User.find({ notice: true })
  

  let userMessages: IUserMessages[] = []

  for (let user of users) {
    // await users.forEach(async (user) => {
      userMessages = await calculationNotice(user, userMessages)
     
    }
    if (userMessages.length !== 0) {
      await messageTransport.deleteMany({})
     const times = await messageTransport.insertMany(userMessages)
    //  await redisClient.set('userMessages', JSON.stringify(userMessages))
      
    noticeStart(userMessages)
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
