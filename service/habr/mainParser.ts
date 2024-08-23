import puppeteer from 'puppeteer'

import { INavigation } from '../../type/model/navigationType.js'
import { habrCards } from './habrCard.js'
import { IWorkCase } from '../../type/model/workCase.js'
import { futureCase } from '../../model/futureCase.js'
import { nowCase } from '../../model/nowCase.js'
import { navigate } from '../../model/navigate.js'
import { workObjectMatch } from '../workNoticeMatchNClearCase.js'
import { navigateFuture } from '../../model/navigateFuture.js'
import { noticeEvent } from '../../model/notice.js'
//main script который собирает {1: парсер объекта навигации, 2: подключает парсер карточек, 3: вызывает логику сравнения объектов для нотификации }
export const habrMainScraping = async (habrPastCase: IWorkCase[]) => {
  // жалко удалять. основная в kwork
  try {
    let categories: INavigation[] = []
    let subs: INavigation[] = []
    console.log('under browser start')
    const browser = await puppeteer.launch({
      // browser: 'firefox',
      headless: false,
      timeout: 0,
      defaultViewport: {
        width: 1080,
        height: 1080,
      },
      // args: ['--proxy-server=socks5://152.67.208.80:57048'],
    })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    // await page.goto('https://httpbin.org/ip', {
    await page.goto('https://freelance.habr.com/tasks', {
      waitUntil: 'networkidle2',
      timeout: 0,
    })
    page.setDefaultNavigationTimeout(0)
    await page.waitForSelector('.category-group')

    const itemsOfCategory = await page.$$(
      '.category-group .category-group__folder'
    )

    let categoryText: string

    for (const itemOfCategory of itemsOfCategory) {
      let category = (await itemOfCategory.evaluate((node) => {
        let nodeItem = node.querySelector(
          '.category-group__name > .link_dotted'
        ) as HTMLElement
        nodeItem?.click()
        return nodeItem?.textContent
      }))!.match(/[\n](.*)[\n]/)![1]
      console.log('category', category)
      const itemOfCategories = {
        platform: 'habr',
        back: 'this',
        text: category,
        nextEnd: true,
        end: false,
      }
      categories.push(itemOfCategories)
      const itemsOfSub = await itemOfCategory.$$(
        '.category-group__folder > .sub-categories > .sub-categories__item >.checkbox_flat> .checkbox__label'
      )
      for (let subCategory of itemsOfSub) {
        let subCategoryText = await subCategory.evaluate(
          (node) => node.innerHTML?.match(/[\n](.*)[\n]/)![1]
        )
        console.log('sub     ', subCategoryText)
        const itemOfSub = {
          platform: 'habr',
          back: category,
          text: subCategoryText,
          nextEnd: true,
          end: true,
        }
        subs.push(itemOfSub)
        await Promise.all([
          subCategory.evaluate((node) => (<HTMLElement>node).click()),
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])
        const newPAth = await page.url()
        console.log('newPAth ', newPAth)
        const pageCard = await browser.newPage()
        await pageCard.goto(newPAth, {
          waitUntil: 'networkidle2',
          // timeout: 0,
        })
        await habrCards(pageCard, subCategoryText, browser)
        console.log(1)
        await Promise.all([
          subCategory.evaluate((node) => (<HTMLElement>node).click()),
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])
        console.log(2)
      }
    }
    const pastCase = habrPastCase

    const newCase = await futureCase.find({})
    await futureCase.deleteMany()
    await nowCase.insertMany(newCase)

    await navigateFuture.insertMany([...categories, ...subs])
    await noticeEvent.deleteMany({ from: 'habr' })
    await workObjectMatch(pastCase, newCase)
    await browser.close()
  } catch (e) {
    console.log(e)
  }
}
