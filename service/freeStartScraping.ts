import { CronJob } from 'cron'
import cron from 'cron'
import { kworkMainScraping } from './kwork/kworkMainScrapingAndCreateNav.js'
import { noticeCreateObj } from './noticeCreateObj.js'
export const freeStartScraping = async () => {
  const job = new CronJob(
    '19 4 * * *',
    async () => {
      await kworkMainScraping()
      noticeCreateObj()
    },
    null,
    true,
    'America/Los_Angeles'
  )
}
