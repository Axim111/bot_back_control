import { Schema, Document } from 'mongoose'


export interface INavigationDocument extends Document {
  platform: string
  back: string
  text: string
  nextEnd: Boolean
  end: Boolean
}
export interface INavigation{
  platform: string
  back: string
  text: string
  nextEnd: Boolean
  end: Boolean
}
