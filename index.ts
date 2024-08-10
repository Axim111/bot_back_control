//t.me/monitoring_freelance_work_bot
import 'dotenv/config'
import {} from './type/main.js'
import { start } from './middleware/start.js'
import { api } from './connect/api.js'
import { profile } from './middleware/startAction/profile.js'
import { set } from './middleware/startAction/set.js'
import { BDConnect } from './connect/dbConnect.js'

import { User } from './model/userModel.js'
import { kwork } from './middleware/startAction/setActions/platformPanel.js'
import { freeStartScraping } from './service/freeStartScraping.js'
import { navigatePlatform } from './middleware/startAction/setActions/navigateAction/navigate.js'
import { navigatePlatformEnd } from './middleware/startAction/setActions/navigateAction/toglingSetingsSections.js'
import { bot } from './connect/bot.js'
import { enterNoticePlatform } from './middleware/NoticeServiceMiddlevare/enterNoticePlatform.js'
import { noticeCreateObj } from './service/noticeCreateObj.js'
import { showNotice } from './middleware/NoticeServiceMiddlevare/noticeShow.js'
import { startNoticePlatform } from './middleware/NoticeServiceMiddlevare/startNoticePlatform.js'
import { noticePagination } from './middleware/NoticeServiceMiddlevare/noticePagination.js'
await enterNoticePlatform()
await BDConnect()
await api()
await start()
await profile()
await set()
await kwork()
await navigatePlatform()
await navigatePlatformEnd()
await noticeCreateObj()
await freeStartScraping()
await showNotice()
await startNoticePlatform()
await noticePagination()
// console.log((await kworkCase.find({})).length)
// console.log(await User.find({}).limit(10))
