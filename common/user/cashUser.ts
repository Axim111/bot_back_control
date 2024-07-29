import { redisClient } from '../../connect/redis.js'
import { IMyContext } from '../../type/session.js'
import { json } from 'stream/consumers'
import { IUser } from '../../type/user.js'
export const inspectUserCash = async (id: string) => {
  try {
    const shotCash = await redisClient.get(id)
    if (shotCash != null) {
      const user: IUser = JSON.parse(shotCash)
      return user
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
  }
}
export const saveUserCash = async (user: IUser) => {
  try {
    await redisClient.set(user._id, JSON.stringify(user))
  } catch (e) {
    console.log(e)
  }
}
