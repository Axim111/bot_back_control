import express from 'express'
import { bot } from './bot.js'
import {} from '../type/environment.js'

const app = express()

// Set the bot API endpoint
export const api = async () => {
  app.use(await bot.createWebhook({ domain: process.env.API }))
  bot.launch()
  app.listen(process.env.PORT, () =>
    console.log('Listening on port', process.env.PORT)
  )
}
