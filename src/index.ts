import type { PiniaPluginContext } from 'pinia'
import type { CustomStorage, StorageEvent } from './utils'
import { initStroage, stroageEventListener } from './utils'

type Store = PiniaPluginContext['store']

type State = Store['$state']

/**
 * 策略配置项类型
 * @param key 存储的key [String]
 * @param storage 存储方式 [localStorage | sessionStorage]
 * @param paths 状态的key [String | String[]]
 */
export interface PiniaStrategy {
  key?: string
  storage?: CustomStorage
  paths?: string | string[]
}

/**
 * 插件配置项类型
 * @param enabled 是否启用 [Boolean]
 * @param storage 存储方式 [localStorage | sessionStorage]
 * @param strategies 存储策略 [PiniaStrategy[]]
 */
export interface StorageOptions {
  enabled?: boolean
  storage?: CustomStorage
  strategies?: PiniaStrategy[]
}

declare module 'pinia' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    storage?: StorageOptions
  }
}

/**
 * 更新状态
 * @param strategy 更新策略
 * @param store pinia 状态
 * @param value 需要更新的值
 */
export const updateStore = (
  strategy: PiniaStrategy,
  store: Store,
  value: string,
) => {
  if (typeof strategy.paths === 'string')
    store[strategy.paths] = JSON.parse(value)
  else if (Array.isArray(strategy.paths)) store.$patch(JSON.parse(value))
}

/**
 * 更新存储
 * @param strategy 更新策略
 * @param store pinia 状态
 * @param storage storage 实例对象
 */
export const updateStorage = (
  strategy: PiniaStrategy,
  store: Store,
  storage: CustomStorage,
) => {
  const windowStorage = strategy.storage || storage
  const storeKey = strategy.key || store.$id

  if (typeof strategy.paths === 'string') {
    const storageKey = strategy.paths
    const storageVal = store.$state[storageKey]
    storageVal
      && windowStorage.setItem(storeKey, JSON.stringify(storageVal), true)
  }
  else if (Array.isArray(strategy.paths)) {
    const storageVal = strategy.paths.reduce((obj, key) => {
      obj[key] = store.$state[key]
      return obj
    }, {} as State)
    storageVal
      && windowStorage.setItem(storeKey, JSON.stringify(storageVal), true)
  }
  else {
    const storageVal = store.$state
    storageVal
      && windowStorage.setItem(storeKey, JSON.stringify(storageVal), true)
  }
}

/**
 * Pinia 持久化存储插件
 */
export const piniaPluginStorage = ({ options, store }: PiniaPluginContext) => {
  initStroage()
  if (Object.keys(options).includes('storage')) {
    const {
      enabled = true,
      storage = sessionStorage,
      strategies = [{ enabled: true, key: store.$id, storage: sessionStorage }],
    } = options.storage || {}
    if (enabled) {
      strategies.forEach((strategy) => {
        const windowStorage = strategy.storage || storage
        const storageKey = strategy.key || store.$id
        const storageVal = windowStorage.getItem(storageKey)
        if (storageVal) {
          // 存储更新状态
          updateStore(strategy, store, storageVal)
        }
        else {
          // 状态更新存储
          updateStorage(strategy, store, storage)
        }
        const callback = (event: StorageEvent) => {
          const { updata, newValue } = event
          if (!updata && newValue) updateStore(strategy, store, newValue)
        }
        // 监听 setItem 更新状态
        stroageEventListener('setItem', callback)
        // 监听 setItem 更新状态
        stroageEventListener('storage', callback)
      })
      store.$subscribe(() => {
        strategies.forEach((strategy) => {
          // 监听状态更新存储
          updateStorage(strategy, store, storage)
        })
      })
    }
  }
}

export { piniaPluginStorage as default }
