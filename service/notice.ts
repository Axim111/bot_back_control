import { User } from '../model/userModel.js'
import { noticeEvent } from '../model/notice.js'

import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

export const bot = new Telegraf(process.env.BOT_TOKEN, {
  handlerTimeout: 2000000,
})

export const notice = async () => {
  const users = await User.find({ notice: true })
  const noticeItems = await noticeEvent.find({})
  await noticeEvent.deleteMany({})
  let counter = 0

  users.forEach(async (user, idUser) => {
    console.log('new user')
    setTimeout(() => {
      noticeItems.forEach(async (noticeItem, idNotice) => {
        let messageContent = `
          ${noticeItem.title}
      
          ${noticeItem.mainTextFull}
      
          ${noticeItem.price}
          
          ${noticeItem.from}
          `

        setTimeout(() => {
          bot.telegram.sendMessage(user.login, messageContent)
          counter++
          console.log(counter)
        }, 2500 * idNotice)
      })
    }, 50 * idUser)
  })
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
