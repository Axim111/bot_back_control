import { prisma } from '../../connect/db.js'
import { IMyContext } from '../../type/session.js'
import { inspectUserCash, saveUserCash } from './cashUser.js'
export const initUser = async (ctx: IMyContext) => {
  try {
    if (ctx.from?.id) {
      if (ctx.session) {
        let user
        const cashShot = inspectUserCash(ctx.from?.id.toString())
        if (cashShot != null) {
          user = await cashShot
        } else {
          user = await prisma.user.findUnique({
            where: {
              id: ctx.from?.id.toString(),
            },
          })
        }
        if (user) {
          if (user.username != ctx.from.first_name) {
            const updatedUser = await prisma.user.update({
              where: {
                id: ctx.from.id.toString(),
              },
              data: {
                username: ctx.from.first_name,
              },
            })
            ctx.session.user = updatedUser
            await saveUserCash(updatedUser)
            return
          }
          ctx.session.user = user
          await saveUserCash(user)
        } else {
          const CreatedUser = await prisma.user.create({
            data: {
              id: ctx.from.id.toString(),
              username: ctx.from.username,
            },
          })
          ctx.session.user = CreatedUser
          await saveUserCash(CreatedUser)
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}
