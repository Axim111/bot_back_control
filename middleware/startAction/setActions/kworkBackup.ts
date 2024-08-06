import { bot } from '../../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../../type/session.js'
import puppeteer from 'puppeteer'
import { it } from 'node:test'
import { match } from 'node:assert'
import { IWorkCase } from '../../../type/model/workCase.js'
import { nowCase } from '../../../model/nowCase.js'

export const kworkBackup = async () => {
  try {
    await nowCase.deleteMany({})
    let kworkObj: IWorkCase
    bot.action('kwork1', async (ctx: IMyContext) => {
      const browser = await puppeteer.launch({
        headless: false,
        timeout: 0,
        args: ['--proxy-server=socks5://65.169.38.73:26592'],
        ignoreHTTPSErrors: true,
      })
      const page = await browser.newPage()

      // await page.goto('https://httpbin.org/ip', {
      await page.goto('https://kwork.ru/projects', {
        waitUntil: 'networkidle2',
        timeout: 0,
      })
      page.setDefaultNavigationTimeout(0)

      await page.waitForSelector('.multilevel-list__label-title')

      const itemsOfCategory = await page.$$('.multilevel-list__label-title')

      let category: string

      for (const itemOfCategory of itemsOfCategory) {
        category = await itemOfCategory.evaluate((node) => node.innerHTML)
        console.log('category: ', category)

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
          console.log('sub:           ', sub)
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

            const cardSearch = async () => {
              let cards = await page.$$('.want-card')
              for (let card of cards) {
                const title = await card.evaluate(
                  (node) =>
                    node.querySelector('.wants-card__header-title a')
                      ?.textContent || ' '
                )

                const priceRaw = await card.evaluate(
                  (node) =>
                    node.querySelector('.wants-card__price .d-inline')
                      ?.textContent
                )
                const val = await card.evaluate(
                  (node) =>
                    node.querySelector('.wants-card__price .d-inline span')
                      ?.textContent
                )
                const price = priceRaw
                  ?.match(/\d*/g)
                  ?.reduce((acc, item) => (item ? acc + item : acc), '')

                const attributePart = await card.evaluate((node) =>
                  node
                    .querySelector('.wants-card__header-title a')
                    ?.getAttribute('href')
                )
                const attributeFull = `https://kwork.ru/${attributePart}/view`

                const textBlockButton = await card.$('.overflow-hidden')
                if (textBlockButton) {
                  await textBlockButton.$eval('.kw-link-dashed', (el) =>
                    (<HTMLElement>el).click()
                  )

                  const mainTextFullRow = await card.evaluate(
                    (node) => node.textContent || ' '
                  )
                  const mainTextFull =
                    mainTextFullRow.match(/.*(?=Скрыть)/gs)?.toString() || ' '

                  kworkObj = await nowCase.create({
                    title,
                    price: price ? price + ' ' + val : '',
                    attributeFull,
                    mainTextFull,
                    category,
                    sub,
                    subsub,
                  })
                  await kworkObj.save()
                }
              }
            }
            let pageDown
            do {
              await cardSearch()
              pageDown = await page.$('.pagination__arrow--next')
              if (pageDown) {
                await Promise.all([
                  page.waitForNavigation({ waitUntil: 'networkidle2' }),
                  pageDown.evaluate((node) => {
                    ;(<HTMLElement>node).click()
                  }),
                ])
              }
            } while (pageDown)
          }
        }
      }

      await ctx.reply('close')
      await browser.close()
    })
  } catch (e) {
    console.log(e)
  }
}
