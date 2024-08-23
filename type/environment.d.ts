export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string
      API: string
      PORT: string
      DATABASE_URL: string
      STRING_session: string
      apiId: number
      apiHash: string
    }
  }
}
