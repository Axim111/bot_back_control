import { IWorkCase } from '../type/model/workCase.js'
import { noticeEvent } from '../model/notice.js'
import { futureCase } from '../model/futureCase.js'
import { nowCase } from '../model/nowCase.js'

export const workObjectMatch = async (
  pastWorkCase: IWorkCase[],
  newWorkCase: IWorkCase[]
) => {
  const differenceKwork = newWorkCase.filter(
    (itemNew) =>
      !pastWorkCase.some(
        (itemPast) =>
          itemPast.refCase + itemPast.section ===
          itemNew.refCase + itemNew.section
      )
  )

  const noticeEventDifference = await noticeEvent.insertMany(differenceKwork)

  return noticeEventDifference
}
