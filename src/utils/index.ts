export * from './storage'

export const isJson = (str: string) => {
  try {
    JSON.parse(str)
  }
  catch (e) {
    return false
  }
  return true
}
