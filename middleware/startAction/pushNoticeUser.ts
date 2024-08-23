import { bot } from '../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'
import { messageTransport } from '../../model/messageTransport.js'
import { noticeStart } from '../../service/noticeStart.js'
import { calculationNotice } from '../../service/calculationNotice.js'
import { IUserMessages } from '../../type/userMessages.js'
import { User } from '../../model/userModel.js'

export const pushUser = async () => {
  //проверяет наличие объекта, или
  bot.action('push', async (ctx) => {
    const user = await User.findOne({ login: ctx.session.user.login })
    // const user = users.find(
    //   (itemUser) => itemUser.login === ctx.session.user.login
    // )
    if (user) {
      let userMessages: IUserMessages[] = []
      let userMessage = (await calculationNotice(user, userMessages))[0] //так как calculationNotice

      if (userMessage) {
        const forDelateTransportPast = await messageTransport.findOne({
          userLogin: ctx.session.user.login,
        })
        if (forDelateTransportPast) {
          await messageTransport.deleteOne({
            userLogin: ctx.session.user.login,
          })
        }

        const shotNotice = await (
          await messageTransport.create(userMessage)
        ).save() // возвращает мутированный список
        await noticeStart([shotNotice])
      } else {
        ctx.reply('на площадке нет новых заказов(или проверьте ключевые слова)')
      }
    }

    // const text = `
    //   profile:
    //   id: ${ctx.session.user?.login}
    //   username: ${ctx.session.user?.username}
    //   `
    // const markProfile = [[Markup.button.callback('back to start', 'start')]]

    // await ctx.editMessageText(text, {
    //   reply_markup: { inline_keyboard: markProfile },
    // })
  })
}
