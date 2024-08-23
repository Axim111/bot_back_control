import mongoose, { Schema, model, Types } from 'mongoose'
import { INavigationDocument } from '../type/model/navigationType.js'
// const KworkSectionSchema = new Schema<IKworkSectionSchema>({
//   sectionText: String,
// })
// const KworkSubCategorySchema = new Schema<IKworkSubCategorySchema>({
//   section: [KworkSectionSchema],
// })
// const KworkCategorySchema = new Schema<IKworkCategorySchema>({
//   subCategory: KworkSubCategorySchema,
// })

const navigateFutureSchema = new Schema<INavigationDocument>({
  platform: { type: String },
  back: { type: String },
  text: { type: String },
  nextEnd:{ type: Boolean },
  end: { type: Boolean },
})

export const navigateFuture = mongoose.model('navigateFuture', navigateFutureSchema)
