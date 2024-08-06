import { platform } from 'os'
import { redisClient } from '../../connect/redis.js'

import { settingsFreelance } from '../../model/settingsFreelance.js'
import { IUser } from '../../type/model/user.js'
import { IMyContext } from '../../type/session.js'

export const initFreelance = async (ctx: IMyContext) => {
  try {
    const settingsItems = await settingsFreelance.findOne({
      login: ctx.from!.id,
    })
    if (!settingsItems) {
      const settings = await (
        await settingsFreelance.create({
          login: ctx.from!.id.toString(),
          platform: ['kwork'],
          incomingCategory: [{ platform: 'kwork', section: [] }],
        })
      ).save()
      ctx.session.settings = {login:settings.login, platform:settings.platform, incomingCategory:settings.incomingCategory}
    } else {
      ctx.session.settings = {login:settingsItems.login, platform:settingsItems.platform, incomingCategory:settingsItems.incomingCategory}
    }
  } catch (e) {
    console.log(e)
  }
}
