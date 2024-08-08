import { bot } from '../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../type/session.js'
import puppeteer from 'puppeteer'
import { it } from 'node:test'
import { match } from 'node:assert'
import { IWorkCase } from '../../type/model/workCase.js'
import { nowCase } from '../../model/nowCase.js'
import { futureCase } from '../../model/futureCase.js'
import { kworkCards } from './kworkCardsScraping.js'
import { kworkObjectMatch } from './kworkNoticeMatchNClearCase.js'
import { navigate } from '../../model/navigate.js'
import { INavigation } from '../../type/model/navigationType.js'
//main script который собирает {1: парсер объекта навигации, 2: подключает парсер карточек, 3: вызывает логику сравнения объектов для нотификации }
export const kworkMainScraping = async () => {
  try {
    let categories: INavigation[] = []
    let subs: INavigation[] = [] //{ category: string; sub: string }[]
    let subsubs: INavigation[] = [] //{ category: string; sub: string; subsub: string }[]

    let kworkObj: IWorkCase
    console.log('under browser start')
    const browser = await puppeteer.launch({
      headless: false,
      timeout: 0,
      // args: ['--proxy-server=socks5://152.67.208.80:57048'],

      ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()

    // await page.goto('https://httpbin.org/ip', {
    await page.goto('https://kwork.ru/projects', {
      waitUntil: 'networkidle0',
      timeout: 0,
    })
    page.setDefaultNavigationTimeout(0)
    await page.waitForSelector('.multilevel-list__label-title')

    const itemsOfCategory = await page.$$('.multilevel-list__label-title')

    let category: string

    for (const itemOfCategory of itemsOfCategory) {
      category = await itemOfCategory.evaluate((node) => node.innerHTML)
      const categoryInsert = {
        platform: 'kwork',
        back: 'this',
        text: category,
        nextEnd: false,
        end: false,
      }
      categories.push(categoryInsert)

      console.log('category: ', category)

      await Promise.all([
        itemOfCategory.evaluate((node) => (<HTMLElement>node).click()),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
      ])

      const pageSub = await page.$$(
        '.multilevel-list__item ul li span div .multilevel-list__label-title'
      )

      for (const itemSub of pageSub) {
        const sub = await itemSub.evaluate(
          (node) => (<HTMLElement>node).innerHTML
        )
        const subInsert = {
          platform: 'kwork',
          back: category,
          text: sub,
          nextEnd: true,
          end: false,
        }
        subs.push(subInsert)
        console.log('sub:           ', sub)
        await itemSub.evaluate((node) => node.innerHTML)
        await Promise.all([
          itemSub.evaluate((node) => {
            ;(<HTMLElement>node).click()
          }),
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])
        const pageSubSub = await page.$$(
          '.multilevel-list__item ul li ul span div .multilevel-list__label-title'
        )
        for (const itemSubSub of pageSubSub) {
          const subsub = await itemSubSub.evaluate((node) => node.innerHTML)

          const subsubInsert: INavigation = {
            platform: 'kwork',
            back: sub,
            text: subsub,
            nextEnd: true,
            end: true,
          }
          subsubs.push(subsubInsert)
          await kworkCards(page, subsub) // search card for subsub + pagination
        }
      }
    }

    const pastCase = await nowCase.find({})

    const newCase = await futureCase.find({})
    await nowCase.deleteMany({})
    await nowCase.insertMany(newCase)
    await futureCase.deleteMany({})
    await navigate.deleteMany({})
    await navigate.insertMany([...categories, ...subs, ...subsubs])
    await kworkObjectMatch(pastCase, newCase)
    await browser.close()
  } catch (e) {
    console.log(e)
  }
}
