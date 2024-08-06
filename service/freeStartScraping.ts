import { CronJob } from 'cron'
import cron from 'cron'
import { kworkMainScraping } from './kwork/kworkMainScrapingAndCreateNav.js'
import { notice } from './notice.js'
export const freeStartScraping = () => {
  const job = new CronJob(
    '13 4 * * *',
    async () => {
      await kworkMainScraping()
      notice()
    },
    null,
    true,
    'America/Los_Angeles'
  )
}
