import { isJson } from './type'

declare let localStorage: CustomStorage
declare let sessionStorage: CustomStorage

export interface CustomStorage extends Storage {
  setItem(key: string, value: string, updata?: boolean): void
}

export interface StorageEvent extends Event {
  key?: string
  newValue?: string | null
  oldValue?: string | null
  storage?: Storage
  updata?: boolean
}

const initSetItem = (storage: CustomStorage) => {
  storage.setItem = function (key: string, value: string, updata?: boolean) {
    if (isJson(value)) {
      Reflect.set(storage, key, value, storage)
      const event = new Event('setItem') as StorageEvent
      event.key = key
      event.newValue = value
      event.oldValue = null
      event.updata = updata
      event.storage = storage
      dispatchEvent(event)
    }
    else {
      console.error(
        `key [${key}] value [${JSON.stringify(value)}] is not valid JSON`,
      )
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
      event.newValue = null
      event.oldValue = value
      event.storage = storage
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

type Key = keyof EventMap
type Listener = (event: EventMap[Key]) => void
interface EventMap {
  setItem: StorageEvent
  getItem: StorageEvent
  removeItem: StorageEvent
  storage: StorageEvent
}

export const stroageEventListener = (type: Key, listener: Listener) => {
  window.addEventListener(type, listener)
}
