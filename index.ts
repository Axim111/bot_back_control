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
import { telegramMain } from './service/telegram/telegramMain.js'
import { habrMainScraping } from './service/habr/mainParser.js'
import { pushUser } from './middleware/startAction/pushNoticeUser.js'
import { keyWord } from './middleware/startAction/keyWord.js'
import { editKeyWord } from './middleware/startAction/editAction/editKeyWord.js'
import { clearKeyWord } from './middleware/startAction/editAction/clearKeyWord.js'
import { about } from './middleware/startAction/about.js'
await enterNoticePlatform()
await BDConnect()
await api()
await start()
await profile()
await set()
await kwork()
await navigatePlatform()
await navigatePlatformEnd()

await freeStartScraping()
await showNotice()
await startNoticePlatform()
await noticePagination()
await pushUser()
await keyWord()
await editKeyWord()
await clearKeyWord()
await about()
// await telegramMain()
// await noticeCreateObj()
// console.log((await kworkCase.find({})).length)
// console.log(await User.find({}).limit(10))
