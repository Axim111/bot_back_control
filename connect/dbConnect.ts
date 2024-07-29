import mongoose, { ConnectOptions } from 'mongoose'
export const BDConnect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/neo_free', {
      dbName: 'event_db',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    await mongoose.connect('mongodb://localhost:27017/neo_free')
  } catch (err) {
    console.log(err)
  }
}
