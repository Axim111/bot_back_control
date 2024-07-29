import mongoose from 'mongoose'
import { User } from '../../connect/model/userModel.js'
import { IMyContext } from '../../type/session.js'
import { inspectUserCash, saveUserCash } from './cashUser.js'
export const initUser = async (ctx: IMyContext) => {
  try {
    if (ctx.from?.id) {
      if (ctx.session) {
        let user
        const cashShot = await inspectUserCash(ctx.from?.id.toString())
        if (cashShot) {
          user = cashShot
        } else {
          user = await User.findOneAndUpdate(
            { _id: ctx.from?.id.toString() },
            { username: ctx.from.first_name },
            { new: true }
          )
        }
        if (user) {
          ctx.session.user = user
          await saveUserCash(user)
        } else {
          const CreatedUser = await User.create({
            _id: ctx.from.id.toString(),
            username: ctx.from.first_name,
          })

          const user = await CreatedUser.save()
          console.log('TEST', user)
          ctx.session.user = user
          await saveUserCash(user)
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}
