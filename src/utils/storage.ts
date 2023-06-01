import { isNull, isObject, isUndefined, keys, omit } from 'lodash-es'
import { JSONParse, JSONStringify } from './utils'

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

export interface CustomStorage {
  readonly length: number
  setItem<K extends string, V>(key: K, value: V, noRefresh?: boolean): void
  clear(): void
  getItem(key: string): string | null
  key(index: number): string | null
  removeItem(key: string): void
  [name: string]: any
}

export interface StorageEvent extends Event {
  key?: string
  newValue?: any
  oldValue?: any
  storage?: Storage
  noRefresh?: boolean
}

const initSetItem = (storage: CustomStorage) => {
  storage.setItem = function <V>(key: string, value: V, noRefresh?: boolean) {
    if (isObject(value)) {
      return console.error(
        `请通过 JSON.stringify 方法将 ${JSONStringify(value)} 进行转换。`,
      )
    }
    const oldValue = Reflect.get(storage, key, storage)
    Reflect.set(storage, key, value, storage)
    const event = new Event('setItem') as StorageEvent
    event.key = key
    event.newValue = value
    event.oldValue = oldValue
    event.noRefresh = noRefresh
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
    const filter = omit(storage, [
      'clear',
      'setItem',
      'getItem',
      'removeItem',
      'length',
      'key',
    ])
    const storageKeys = keys(filter)
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

export const getItem = <V>(key: string, storage = localStorage) => {
  const value = storage.getItem(key)
  if (isNull(value) || isUndefined(value)) return null
  else return JSONParse(value) as V
}

export const setItem = <V>(key: string, value: V, storage = localStorage) => {
  storage.setItem(key, JSONStringify(value), false)
}

export const removeItem = (key: string, storage = localStorage) => {
  storage.removeItem(key)
}

export const clear = (storage = localStorage) => {
  storage.clear()
}
