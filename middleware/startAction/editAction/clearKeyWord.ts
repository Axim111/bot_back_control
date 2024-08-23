import { bot } from '../../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { User } from '../../../model/userModel.js'
import { redisClient } from '../../../connect/redis.js'
import { IUser } from './../../../type/model/user.js'

export const clearKeyWord = async () => {
  bot.action('clearKeyWord', async (ctx, next) => {
    await User.updateOne(
      { login: ctx.session.user.login },
      { keyWord: ""}
    )
    const redisForSaveCashJSON = await redisClient.get(ctx.session.user.login) //для кэширования (делать при любой мутации user)
    if (redisForSaveCashJSON) {
      const redisForSaveCash: IUser = JSON.parse(redisForSaveCashJSON)
      redisForSaveCash!.keyWord = ''
      await redisClient.set(
        ctx.session.user.login,
        JSON.stringify(redisForSaveCash)
      )
    }
    ctx.session.user.keyWord=''
    const text = `у вас нет ключевых слов`
    const markProfile = [
      [Markup.button.callback('изменить ключевые слова', 'editKeyWord')],
      [Markup.button.callback('очистить ключевые слова', 'clearKeyWord')],
      [Markup.button.callback('back to start', 'start')],
    ]
    ctx.reply(text, Markup.inlineKeyboard(markProfile))
  })
}
