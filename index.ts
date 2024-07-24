//t.me/control_monitoring_bot
import 'dotenv/config'
import {} from './type/main.js'
import { start } from './middleware/start.js'
import { api } from './connect/api.js'
import { profile } from './middleware/startAction/profile.js'

api()
start()
profile()
