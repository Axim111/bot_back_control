import { Api, TelegramClient } from 'telegram'

import readline from 'readline'
import { NewMessage, NewMessageEvent } from 'telegram/events/index.js'
import 'dotenv/config'
import { telegramNotice } from '../../model/telegramNotice.js'
import { ITelegramNotice } from '../../type/model/telegramNotice.js'
import { message } from 'telegraf/filters'
import bigInt from 'big-integer'
import { StringSession } from 'telegram/sessions/StringSession.js'
export const telegramMain = async () => {
  const apiId = process.env.apiId
  const apiHash = process.env.apiHash

  const stringsession = new StringSession(process.env.STRING_session) // fill this later with the value from session.save()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  ;(async () => {
    console.log('Loading interactive example...')
    const client = new TelegramClient(stringsession, apiId, apiHash, {
      connectionRetries: 5,
    })
    await client.start({
      phoneNumber: async () =>
        new Promise((resolve) =>
          rl.question('Please enter your number: ', resolve)
        ),
      password: async () =>
        new Promise((resolve) =>
          rl.question('Please enter your password: ', resolve)
        ),
      phoneCode: async () =>
        new Promise((resolve) =>
          rl.question('Please enter the code you received: ', resolve)
        ),
      onError: (err) => console.log(err),
    })
    console.log('You should now be connected.')
    console.log(client.session.save()) // Save this string to avoid logging in again

    const result1 = await client.getMessages('javascript_jobs', {
      limit: 1,
    })

    const listChat: string[] = [
      'nodejs_jobs',
      'jsspeak',
      'javascriptjobjs',
      'java_jobsit',
      'python_django_work',
      'golang_jobsgo',
    ]
    let telegramNoticeObject: ITelegramNotice
    let temp
    const searchIdChannel = async (name: string) => {
      const result = await client.invoke(
        new Api.channels.GetFullChannel({
          channel: name,
        })
      )
      return +result.fullChat.id
    }

    for (let chatItem of listChat) {
      temp = await telegramNotice.findOne({ chatName: chatItem })
      if (!temp) {
        //init после дроп базы
        const chatId = await searchIdChannel(chatItem)
        const msgs = await client.getMessages(chatItem, {
          limit: 10,
        })
        let messagesStartNotice: string[] = []
        let lastIndex
        msgs.forEach((itemMessage, index) => {
          if (index === 0) {
            lastIndex = itemMessage.id
          }
          messagesStartNotice.push(itemMessage.text)
        })
        telegramNoticeObject = await (
          await telegramNotice.create({
            chatId,
            chatName: chatItem,
            lastMessageCheck: lastIndex,
            notice: messagesStartNotice,
          })
        ).save()
      } else {
        //новые до прошлого индекса
        telegramNoticeObject = temp
        let idNow = (
          await client.getMessages(chatItem, {
            limit: 1,
          })
        )[0].id

        const lastMessageCheck = telegramNoticeObject.lastMessageCheck
        console.log(lastMessageCheck, idNow)
        while (lastMessageCheck != idNow) {
          const result = await client.invoke(
            new Api.channels.GetMessages({
              channel: chatItem,
              //@ts-ignore
              id: [idNow],
            })
          )
          //@ts-ignore
          if (result.messages[0].message) {
            //@ts-ignore
            console.log(result.messages[0].message)
          }

          idNow--
        }
      } //убедились что telegramNoticeObjec
    }

    // console.log(result)
    // console.log(result1[0].id)
  })()
}
