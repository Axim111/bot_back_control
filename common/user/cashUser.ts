import { User } from '@prisma/client'
import { redisClient } from '../../connect/redis.js'
import { IMyContext } from '../../type/session.js'
import { json } from 'stream/consumers'
export const inspectUserCash = async (id: string) => {
  try {
    const shotCash = await redisClient.get(id)
    if (shotCash != null) {
      const user: User = JSON.parse(shotCash)
      return user
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
  }
}
export const saveUserCash = async (user: User) => {
  try {
    const shotCash = await redisClient.set(user.id, JSON.stringify(user))
  } catch (e) {
    console.log(e)
  }
}
