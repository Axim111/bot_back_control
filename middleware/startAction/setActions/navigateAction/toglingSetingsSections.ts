import { bot } from '../../../../connect/bot.js'
import { Context, Markup } from 'telegraf'
import { IMyContext } from '../../../../type/session.js'
import { callbackQuery } from 'telegraf/filters'
import { navigate } from '../../../../model/navigate.js'
import { settingsFreelance } from '../../../../model/settingsFreelance.js'
import { platform } from 'os'

export const navigatePlatformEnd = async () => {
  bot.action(/end/, async (ctx) => {
    try {
      if (ctx.has(callbackQuery('data'))) {
        const words = ctx.update.callback_query.data.split(/[ ]+/)
        const wordAction = words[0]
        const wordPlatform = words[1]
        const backText = words.slice(2).join(' ')
        let markProfile = []

        if (wordAction === 'end') {
          ctx.session.actionRout.endSectionBackWord = backText // самый первый заход в сессии
        } //, для того, чтобы прололжал тотже markup кидать
        const lastSection = ctx.session.navigateOptions.filter((item) =>
          item.text.match(
            new RegExp(`${ctx.session.actionRout.endSectionBackWord}`, 'i')
          )
        )[0]
        const navigateInCategoryCases = ctx.session.navigateOptions.filter(
          (item) =>
            item.back.match(
              new RegExp(`${ctx.session.actionRout.endSectionBackWord}`, 'i')
            )
        )

        //console.log(ctx.session.settings!.incomingCategory) // обязательно добавить новую платформу в common/freelance
        let thisSectionSettingsPlatform =
          ctx.session.settings!.incomingCategory.filter(
            (item) => item.platform === wordPlatform
          )[0]

        if (thisSectionSettingsPlatform) {
        }

        if (wordAction === 'endUp') {
          const isInSettingsSection = thisSectionSettingsPlatform.section.some(
            (itemSettingsSection) =>
              itemSettingsSection.match(new RegExp(`${backText}`, 'i'))
          )
          ctx.session.settings!.incomingCategory =
            ctx.session.settings!.incomingCategory.filter(
              (itemOnPlatform) => itemOnPlatform.platform !== wordPlatform
            ) //удаляем массив платформы, чтобы потома его заменить
          if (isInSettingsSection) {
            // удаляем, если объект был

            const newSectionAfterDelete =
              thisSectionSettingsPlatform.section.filter(
                (itemSection) =>
                  !itemSection.match(new RegExp(`${backText}`, 'i'))
              )

            ctx.session.settings!.incomingCategory.push({
              platform: wordPlatform,
              section: newSectionAfterDelete,
            })

            await settingsFreelance.findOneAndUpdate(
              { login: ctx.from.id },
              { incomingCategory: ctx.session.settings!.incomingCategory },
              { new: true }
            )
            thisSectionSettingsPlatform =
              ctx.session.settings!.incomingCategory.filter(
                (item) => item.platform === wordPlatform
              )[0]
          } else {
            thisSectionSettingsPlatform.section.push(backText)
            ctx.session.settings!.incomingCategory.push({
              platform: wordPlatform,
              section: thisSectionSettingsPlatform.section,
            })

            await settingsFreelance.findOneAndUpdate(
              { login: ctx.from.id },
              { incomingCategory: ctx.session.settings!.incomingCategory },
              { new: true }
            )
            thisSectionSettingsPlatform =
              ctx.session.settings!.incomingCategory.filter(
                (item) => item.platform === wordPlatform
              )[0]
          }
        }

        navigateInCategoryCases.forEach((itemNavigation) => {
          const isActiveSection = thisSectionSettingsPlatform.section.some(
            (itemSettingsSection) => {
              const sortSection = [
                itemNavigation.text,
                itemSettingsSection,
              ].sort()
              return sortSection[1].match(new RegExp(`${sortSection[0]}`, 'i'))
            }
          )

          const textButtonSection = isActiveSection
            ? itemNavigation.text + ' ✅'
            : itemNavigation.text + ' ❌'
          let textActionCallback =
            itemNavigation.text.length <= 20
              ? itemNavigation.text
              : itemNavigation.text.slice(0, 20)
          markProfile.push([
            Markup.button.callback(
              textButtonSection,
              'endUp ' + wordPlatform + ' ' + textActionCallback
            ),
          ])
        })
        markProfile.push([
          Markup.button.callback(
            'back',
            'Next ' + wordPlatform + ' ' + lastSection.back
          ),
        ])
        const text = `sections`
        try {
          await ctx.editMessageText(text, {
            reply_markup: { inline_keyboard: markProfile },
          })
        } catch (err) {
          console.log(err)
        }
      }
    } catch (err) {
      console.log(err)
    }
  })
}
