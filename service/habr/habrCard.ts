import puppeteer from 'puppeteer'

import { IWorkCase } from '../../type/model/workCase.js'
import { futureCase } from '../../model/futureCase.js'
import { describe } from 'node:test'

export const habrCards = async (
  page: puppeteer.Page,
  subCategoryText: string,
  browser: puppeteer.Browser
) => {
  let habrkObj: IWorkCase
  let paginationNextBottom
  let isPaginationNextBottom

  do {
    const itemsOfCard = await page.$$(
      '.content-list .content-list__item .task_list' // .task__column_desc .task__header .task__title a
    )
    for (let cardRefTitle of itemsOfCard) {
      try {
        
        const title = await cardRefTitle.evaluate(
          (title) =>
            title.querySelector(
              '.task__column_desc .task__header .task__title a'
            )?.textContent
        )
        console.log(title)
        const ref = await cardRefTitle.evaluate((ref) =>
          ref
            .querySelector('.task__column_desc .task__header .task__title a')
            ?.getAttribute('href')
        )
        const refCase = 'https://freelance.habr.com' + ref
        let price = await cardRefTitle.evaluate(
          (cost) =>
            cost.querySelector('.task__column_price .task__price .count')
              ?.textContent
        )
        if (!price) {
          price = 'договорная'
        }
        const pageCard = await browser.newPage()
        pageCard.setDefaultNavigationTimeout(0)
        const [got, wai] = await Promise.all([
          pageCard.goto(refCase),
          pageCard.waitForSelector('.task__title'),
        ])

        const description = (
          await pageCard.$eval(
            //для просмотра каждого кейса
            '.task__description',
            (item) => item.textContent
          )
        )?.match(/[\n](.*)[\n]/)![1]
        pageCard.close()
        let habrkObj = await futureCase.create({
          title,
          price: price,
          refCase,
          mainTextFull: description,
          section: subCategoryText,
          from: 'habr',
        })
        await habrkObj.save()
      } catch (err) {
        console.log(err)
      }
    }
    paginationNextBottom = await page.$('.next_page')
    isPaginationNextBottom = await page.$('.next_page.disabled')
    if (!isPaginationNextBottom && paginationNextBottom) {
      console.log('pag')
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),

        paginationNextBottom.evaluate((node) => {
          ;(<HTMLElement>node).click()
        }),
      ])
    }

    console.log(!isPaginationNextBottom)
  } while (!isPaginationNextBottom && paginationNextBottom)
  await page.close()
}
