import { message } from 'antd'

export const notifySuccess = (text: string) => {
  message.success(text)
}
export const notifyWarning = (text: string) => {
  message.warning(text)
}
export const notifyError = (text: string, err?: Error) => {
  message.error(text)
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}
