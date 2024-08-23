import { bot } from '../../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { User } from '../../../model/userModel.js'
import { redisClient } from '../../../connect/redis.js'
import { IUser } from './../../../type/model/user.js'

export const editKeyWord = async () => {
  bot.action('editKeyWord', async (ctx, next) => {
    await ctx.reply('вводите слова от wizard')
    await ctx.scene.enter('keyWord')

    // const text = ctx.session.user.keyWord
    // const markProfile = [
    //   [Markup.button.callback('изменить ключевые слова', 'editKeyWord')],
    //   [Markup.button.callback('back to start', 'start')],
    // ]
    // ctx.reply(text, Markup.inlineKeyboard(markProfile))
  })
}
