import { bot } from '../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../type/session.js'
import puppeteer from 'puppeteer'
import { it } from 'node:test'
import { match } from 'node:assert'

interface kworkCase {
  title: string
  price: string
  attributeFull: string
  mainTextFull: string
  category: string
  sub: string
  subsub: string
}
export const kwork = async () => {
  try {
    const kworkObj: kworkCase[] = []
    bot.action('kwork', async (ctx: IMyContext) => {
      const browser = await puppeteer.launch({
        headless: false,
        timeout: 0,
        // args: ['--proxy-server=socks5://162.19.7.56:29519'],
        ignoreHTTPSErrors: true,
      })
      const page = await browser.newPage()

      // await page.goto('https://httpbin.org/ip', {
      await page.goto('https://kwork.ru/projects', {
        waitUntil: 'networkidle2',
        timeout: 0,
      })

      await page.waitForSelector('.multilevel-list__label-title')

      const itemsOfCategory = await page.$$('.multilevel-list__label-title')

      let category: string

      for (const itemOfCategory of itemsOfCategory) {
        category = await itemOfCategory.evaluate((node) => node.innerHTML)
        // console.log('category: ', category)

        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          itemOfCategory.evaluate((node) => (<HTMLElement>node).click()),
        ])

        const pageSub = await page.$$(
          '.multilevel-list__item ul li span div .multilevel-list__label-title'
        )

        for (const itemSub of pageSub) {
          const sub = await itemSub.evaluate(
            (node) => (<HTMLElement>node).innerHTML
          )
          // console.log('sub:           ', sub)
          await itemSub.evaluate((node) => node.innerHTML)
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            itemSub.evaluate((node) => {
              ;(<HTMLElement>node).click()
            }),
          ])
          const pageSubSub = await page.$$(
            '.multilevel-list__item ul li ul span div .multilevel-list__label-title'
          )
          for (const itemSubSub of pageSubSub) {
            const subsub = await itemSubSub.evaluate((node) => node.innerHTML)
            // console.log('subsub:                      ', subsub)
            const cards = await page.$$('.want-card')
          }
          console.log(sub)
        }
      }
      console.log(kworkObj.length, kworkObj[kworkObj.length - 1])
      await browser.close()

      // после 1 рендера страницы

      // const text = `start`
      // const markProfile = [
      //   [Markup.button.callback('profile', 'profile')],
      //   [Markup.button.callback('set', 'set')],
      //   [Markup.button.callback('about the bot', 'about')],
      // ]

      // await ctx.editMessageText(text, {
      //   reply_markup: { inline_keyboard: markProfile },
      // })
    })
  } catch (e) {
    console.log(e)
  }

  // await browser.close()
}
