import { isObject, keys, omit } from 'lodash-es'

declare let localStorage: CustomStorage
declare let sessionStorage: CustomStorage

type EventKey = keyof EventMap
type Listener = (event: EventMap[EventKey]) => void
interface EventMap {
  clear: StorageEvent
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
  newValue?: any
  oldValue?: any
  storage?: Storage
  update?: boolean
}

const initSetItem = (storage: CustomStorage) => {
  storage.setItem = function <T>(key: string, value: T, update?: boolean) {
    if (isObject(value)) {
      return console.error(
        `请通过 JSON.stringify 方法将 ${JSON.stringify(value)} 进行转换。`,
      )
    }
    Reflect.set(storage, key, value, storage)
    const event = new Event('setItem') as StorageEvent
    event.key = key
    event.newValue = value
    event.oldValue = null
    event.update = update
    event.storage = storage
    dispatchEvent(event)
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
      dispatchEvent(event)
    }
  }
}

const initClear = (storage: CustomStorage) => {
  storage.clear = function () {
    const storageKeys = keys(
      omit(storage, [
        'clear',
        'setItem',
        'getItem',
        'removeItem',
        'length',
        'key',
      ]),
    )
    storageKeys.forEach((storageKey) =>
      Reflect.deleteProperty(storage, storageKey),
    )
    const event = new Event('clear') as StorageEvent
    dispatchEvent(event)
  }
}

export const initStroage = () => {
  [localStorage, sessionStorage].forEach((storage) => {
    initSetItem(storage)
    initGetItem(storage)
    initRemoveItem(storage)
    initClear(storage)
  })
}

export const stroageEventListener = (type: EventKey, listener: Listener) => {
  window.addEventListener(type, listener)
}

export const getItem = <R>(key: string, storage = localStorage) =>
  JSON.parse(storage.getItem(key) || '{}') as R

export const setItem = <T>(key: string, value: T, storage = localStorage) =>
  storage.setItem(key, JSON.stringify(value))

export const removeItem = (key: string, storage = localStorage) =>
  storage.removeItem(key)

export const clear = (storage = localStorage) => storage.clear()
