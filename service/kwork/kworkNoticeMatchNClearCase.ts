import { IWorkCase } from '../../type/model/workCase.js'
import { noticeEvent } from '../../model/notice.js'
import { futureCase } from '../../model/futureCase.js'
import { nowCase } from '../../model/nowCase.js'

export const kworkObjectMatch = async (
  pastKworkCase: IWorkCase[],
  newKworkCase: IWorkCase[]
) => {
  const differenceKwork = newKworkCase.filter(
    (itemNew) =>
      !pastKworkCase.some(
        (itemPast) =>
          itemPast.refCase + itemPast.section ===
          itemNew.refCase + itemPast.section
      )
  )
  await noticeEvent.deleteMany({})
  const noticeEventDifference = await noticeEvent.insertMany(differenceKwork)
  console.log('pastKworkCase.length', pastKworkCase.length)
  console.log('newKworkCase.length', newKworkCase.length)
  console.log('noticeEvent.length', noticeEvent.length)
  await nowCase.insertMany(newKworkCase)
  await futureCase.deleteMany({})

  return noticeEventDifference
}
