import { bot } from '../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'
import puppeteer from 'puppeteer'
import { it } from 'node:test'
import { match } from 'node:assert'
import { IWorkCase } from '../../type/model/workCase.js'
import { futureCase } from '../../model/futureCase.js'

export const kworkCards = async (page: puppeteer.Page, subsub: string) => {
  let kworkObj: IWorkCase
  const cardSearch = async () => {
    let cards = await page.$$('.want-card')
    for (let card of cards) {
      const title = await card.evaluate(
        (node) =>
          node.querySelector('.wants-card__header-title a')?.textContent || ' '
      )

      const priceRaw = await card.evaluate(
        (node) =>
          node.querySelector('.wants-card__price .d-inline')?.textContent
      )
      const val = await card.evaluate(
        (node) =>
          node.querySelector('.wants-card__price .d-inline span')?.textContent
      )
      const price = priceRaw
        ?.match(/\d*/g)
        ?.reduce((acc, item) => (item ? acc + item : acc), '')

      const attributePart = await card.evaluate((node) =>
        node.querySelector('.wants-card__header-title a')?.getAttribute('href')
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

        kworkObj = await futureCase.create({
          title,
          price: price ? price + ' ' + val : '',
          refCase: attributeFull,
          mainTextFull,
          section: subsub,
          from: 'kwork',
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
