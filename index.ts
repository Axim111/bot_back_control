//t.me/control_monitoring_bot
import 'dotenv/config'
import {} from './type/main.js'
import { start } from './middleware/start.js'
import { api } from './connect/api.js'
import { profile } from './middleware/startAction/profile.js'
import { kwork } from './middleware/startAction/setActions/kwork.js'
import { set } from './middleware/startAction/set.js'
import { BDConnect } from './connect/dbConnect.js'

BDConnect()
api()
start()
profile()
set()
kwork()
