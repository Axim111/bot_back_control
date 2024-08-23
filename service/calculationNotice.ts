import { noticeEvent } from '../model/notice.js'
import { settingsFreelance } from '../model/settingsFreelance.js'
import { IUser } from '../type/model/user.js'
import { IUserMessages } from '../type/userMessages.js'

export const calculationNotice = async (
  user: IUser,
  userMessages: IUserMessages[]
) => {
  const noticeItems = await noticeEvent.find({})
  for (let noticeItem of noticeItems) {
    try {
      // await noticeItems.forEach(async (noticeItem) => {
      let messageContent = {
        title: noticeItem.title,

        mainTextFull: noticeItem.mainTextFull,

        section: noticeItem.section,

        price: noticeItem.price,

        refCase: noticeItem.refCase,

        from: noticeItem.from,
      }

      if (user.keyWord) {
        let keyWords = user.keyWord.split(/[ ]+/)
        let consistInKeyWord = keyWords.some((keyWord) => {
          const inMainText = noticeItem.mainTextFull.match(
            new RegExp(`${keyWord}`, 'i')
          )
          if (inMainText) {
            return inMainText
          }
          return noticeItem.title.match(new RegExp(`${keyWord}`, 'i'))
        })
        if (!consistInKeyWord) {
          continue
        }
      }
      let createdUserMessagesByLogin = userMessages.find(
        (item) => item.userLogin === user.login
      )

      const settingsUserByLogin = await settingsFreelance.findOne({
        login: user.login,
      }) //поиск платформы

      const isUserSubscribePlatform = settingsUserByLogin?.platform.some(
        (userItemPlatform) => userItemPlatform === noticeItem.from
      ) //есть ли платформа в сетингсах юзера
      const findSectionListByPlatform =
        settingsUserByLogin!.incomingCategory.find(
          (settingsObjectSectionSubscribe) => {
            return settingsObjectSectionSubscribe.platform === noticeItem.from
          }
        ) //поиск секции

      let isUserSubscribeSection = false
      if (findSectionListByPlatform) {
        isUserSubscribeSection = findSectionListByPlatform!.section.some(
          (section) => section === noticeItem.section
        )
      }

      if (isUserSubscribePlatform && isUserSubscribeSection) {
        // если человек подписан на сообщение, то создаём объект нотиса
        if (createdUserMessagesByLogin) {
          const createdUserMessageObjectByPlatform =
            createdUserMessagesByLogin.messagesAndPlatform.find(
              (platformMessage) => {
                return platformMessage.platform === noticeItem.from
              }
            )

          if (createdUserMessageObjectByPlatform) {
            //если есть площадка

            createdUserMessageObjectByPlatform.messages.push(messageContent)
            createdUserMessagesByLogin.messagesAndPlatform =
              createdUserMessagesByLogin.messagesAndPlatform.filter(
                (messagesAndPlatformItem) => {
                  return messagesAndPlatformItem.platform !== noticeItem.from
                }
              )

            createdUserMessagesByLogin.messagesAndPlatform.push(
              createdUserMessageObjectByPlatform
            )
          } else {
            createdUserMessagesByLogin.messagesAndPlatform.push({
              platform: noticeItem.from,
              messages: [messageContent],
            })
          }
          userMessages = userMessages.filter(
            (user) => user.userLogin !== user.userLogin
          )

          userMessages.push(createdUserMessagesByLogin)
        } else {
          userMessages.push({
            userLogin: user.login,
            messagesAndPlatform: [
              { platform: noticeItem.from, messages: [messageContent] },
            ],
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return userMessages
}
