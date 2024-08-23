import { Telegraf, Composer, Scenes, Context, Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'
import { WizardContext } from 'telegraf/scenes'
import { User } from '../../model/userModel.js'
import { redisClient } from '../redis.js'
import { IUser } from '../../type/model/user.js'
const startStep = new Composer<IMyContext>()
const twoStep = new Composer<IMyContext>()

startStep.on('text', async (ctx) => {
  ctx.session.user.keyWord = ctx.message.text
  await User.updateOne(
    { login: ctx.session.user.login },
    { keyWord: ctx.message.text }
  )
  const redisForSaveCashJSON = await redisClient.get(ctx.session.user.login) //для кэширования (делать при любой мутации user)
  if (redisForSaveCashJSON) {
    const redisForSaveCash: IUser = JSON.parse(redisForSaveCashJSON)
    redisForSaveCash!.keyWord = ctx.message.text
    await redisClient.set(
      ctx.session.user.login,
      JSON.stringify(redisForSaveCash)
    )
  }
  ctx.reply(
    ctx.message.text,
    Markup.inlineKeyboard([
      [Markup.button.callback('изменить ключевые слова', 'editKeyWord')],
      [Markup.button.callback('очистить ключевые слова', 'clearKeyWord')],
      [Markup.button.callback('back to start', 'start')],
    ])
  )
  ctx.scene.leave()
})

export const keyWord = new Scenes.WizardScene<IMyContext>('keyWord', startStep)
