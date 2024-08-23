import { initUser } from '../common/user/initUser.js'
import { bot } from '../connect/bot.js'
import { Markup } from 'telegraf'
import { IMyContext } from '../type/session.js'
import { initFreelance } from '../common/freelance/freelance.js'
import { User } from '../model/userModel.js'
import { callbackQuery } from 'telegraf/filters'
import { redisClient } from '../connect/redis.js'
import { IUser } from '../type/model/user.js'
export const start = async () => {
  const messageForStart = (ctx: IMyContext) => {
    const markForStart = [
      [Markup.button.callback('профиль', 'profile')],
      [Markup.button.callback('настройка фриланса', 'settings')],
      [
        Markup.button.callback(
          ctx.session.user.notice ? 'уведомления ✅' : 'уведомления ❌',
          'start changeNotice'
        ),
      ],
      [Markup.button.callback('получить кейсы', 'push')],
      [Markup.button.callback('ключевые слова', 'keyWord')],
      [Markup.button.callback('о боте', 'about')],
    ]
    return markForStart
  }

  bot.start(async (ctx) => {
    try {
      await initUser(ctx)
      await initFreelance(ctx)

      await ctx.reply('start', Markup.inlineKeyboard(messageForStart(ctx)))
    } catch (err) {
      console.log(err)
    }
  })
  bot.action(/start/, async (ctx) => {
    try {
      if (ctx.has(callbackQuery('data'))) {
        const words = ctx.update.callback_query.data.split(/[ ]+/)
        const wordAction = words[1]
        if (wordAction === 'changeNotice') {
          await User.updateOne(
            { login: ctx.session.user.login },
            { notice: !ctx.session.user.notice }
          )
          ctx.session.user.notice = !ctx.session.user.notice
          const userInCashRow = await redisClient.get(ctx.session.user.login)
          if (userInCashRow) {
            const UserInCash: IUser = JSON.parse(userInCashRow)
            UserInCash.notice = !UserInCash.notice
            await redisClient.set(
              ctx.session.user.login,
              JSON.stringify(UserInCash)
            )
          }
        }
      }
      const text = `start`

      await ctx.editMessageText(text, {
        reply_markup: { inline_keyboard: messageForStart(ctx) },
      })
    } catch (err) {
      console.log(err)
    }
  })
}
