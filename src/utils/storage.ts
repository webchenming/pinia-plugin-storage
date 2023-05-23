declare let localStorage: CustomStorage
declare let sessionStorage: CustomStorage

type EventKey = keyof EventMap
type Listener = (event: EventMap[EventKey]) => void
interface EventMap {
  setItem: StorageEvent
  getItem: StorageEvent
  removeItem: StorageEvent
  storage: StorageEvent
}

export interface CustomStorage extends Storage {
  setItem(key: string, value: string, update?: boolean): void
}

export interface StorageEvent extends Event {
  key?: string
  newValue?: string | null
  oldValue?: string | null
  storage?: Storage
  update?: boolean
  eventKey?: EventKey
}

const isJson = (str: string) => {
  try {
    JSON.parse(str)
  }
  catch (e) {
    return false
  }
  return true
}

const initSetItem = (storage: CustomStorage) => {
  storage.setItem = function (key: string, value: string, update?: boolean) {
    if (isJson(value)) {
      Reflect.set(storage, key, value, storage)
      const event = new Event('setItem') as StorageEvent
      event.key = key
      event.newValue = value
      event.oldValue = null
      event.update = update
      event.storage = storage
      event.eventKey = 'setItem'
      dispatchEvent(event)
    }
    else {
      throw new TypeError(`${JSON.stringify(value)} is not valid JSON`)
    }
  }
}

const initGetItem = (storage: CustomStorage) => {
  storage.getItem = function (key: string) {
    const value = Reflect.get(storage, key, storage)
    const event = new Event('getItem') as StorageEvent
    event.key = key
    event.newValue = value
    event.oldValue = null
    event.storage = storage
    event.eventKey = 'getItem'
    dispatchEvent(event)
    return value
  }
}

const initRemoveItem = (storage: CustomStorage) => {
  storage.removeItem = function (key: string) {
    const value = Reflect.get(storage, key, storage)
    const falg = Reflect.deleteProperty(storage, key)
    if (falg) {
      const event = new Event('removeItem') as StorageEvent
      event.key = key
      event.newValue = undefined
      event.oldValue = value
      event.storage = storage
      event.eventKey = 'removeItem'
      dispatchEvent(event)
    }
  }
}

export const initStroage = () => {
  [localStorage, sessionStorage].forEach((storage) => {
    initSetItem(storage)
    initGetItem(storage)
    initRemoveItem(storage)
  })
}

export const stroageEventListener = (type: EventKey, listener: Listener) => {
  window.addEventListener(type, listener)
}

export const getItem = <R>(key: string, storage = localStorage) => {
  return JSON.parse(storage.getItem(key) || '{}') as R
}

export const setItem = <T>(key: string, value: T, storage = localStorage) => {
  storage.setItem(key, JSON.stringify(value))
}

export const removeItem = (key: string, storage = localStorage) => {
  storage.removeItem(key)
}
