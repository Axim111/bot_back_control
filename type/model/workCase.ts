import mongoose, { Document } from 'mongoose';
export interface IWorkCase extends Document {
  title: string
  price: string
  refCase: string
  mainTextFull: string
  section: string
  feedback:string
  from:string
}
