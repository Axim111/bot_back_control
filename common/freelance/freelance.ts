import { platform } from 'os'
import { redisClient } from '../../connect/redis.js'

import { settingsFreelance } from '../../model/settingsFreelance.js'
import { IUser } from '../../type/model/user.js'
import { IMyContext } from '../../type/session.js'
import { ISettingsType } from './../../type/model/settingsType.js'
export const createSettingsFreelance = async (
  namePlatforms: string[],
  ctx: IMyContext
) => {
  // вызывается после инициализации проекта,
  if (!ctx.session.settings) {
    const settings = await (
      await settingsFreelance.create({
        login: ctx.from!.id.toString(),
        platform: ['kwork', 'habr'],
        incomingCategory: [
          { platform: 'kwork', section: [] },
          { platform: 'habr', section: [] },
        ],
      })
    ).save()
    ctx.session.settings = {
      login: settings.login,
      platform: settings.platform,
      incomingCategory: settings.incomingCategory,
    }
  }

  const createObjectSettings: ISettingsType = ctx.session.settings // т.к нет ctx.session.settings до этого момента

  for (let namePlatform of namePlatforms) {
    createObjectSettings.platform.push(namePlatform)
    createObjectSettings.incomingCategory.push({
      platform: namePlatform,
      section: [],
    })
  }
  ctx.session.settings = createObjectSettings
}

export const initFreelance = async (ctx: IMyContext) => {
  try {
    const settingsItems = await settingsFreelance.findOne({
      login: ctx.from!.id,
    })
    if (!settingsItems) {
      createSettingsFreelance([], ctx)
      //
    } else {
      ctx.session.settings = {
        login: settingsItems.login,
        platform: settingsItems.platform,
        incomingCategory: settingsItems.incomingCategory,
      }
    }
  } catch (e) {
    console.log(e)
  }
}
