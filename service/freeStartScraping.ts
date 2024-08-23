import { CronJob } from 'cron'
import cron from 'cron'
import { kworkMainScraping } from './kwork/kworkMainScrapingAndCreateNav.js'
import { noticeCreateObj } from './noticeCreateObj.js'
import { habrMainScraping } from './habr/mainParser.js'
import { navigate } from '../model/navigate.js'
import { nowCase } from '../model/nowCase.js'
import { futureCase } from '../model/futureCase.js'
import { navigateFuture } from '../model/navigateFuture.js'
export const freeStartScraping = async () => {
  const job = new CronJob(
    '57 9 * * *',
    async () => {
      // await kworkMainScraping()
      const kworkPastCase = await nowCase.find({ from: 'kwork' })
      const habrPastCase = await nowCase.find({ from: 'habr' })
      await nowCase.deleteMany({})

      await futureCase.deleteMany({})
      // await noticeEvent.deleteMany({})
      await habrMainScraping(habrPastCase)
      await kworkMainScraping(kworkPastCase)

      const nowNavigate = await navigateFuture.find({})
      await navigateFuture.deleteMany({})
      await navigate.deleteMany({})
      await navigate.insertMany(nowNavigate)
      noticeCreateObj()
    },
    null,
    true,
    'America/Los_Angeles'
  )
}
