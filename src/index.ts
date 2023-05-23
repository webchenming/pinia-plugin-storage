import type { PiniaPluginContext } from 'pinia'
import { has, isArray, isEmpty, isString } from 'lodash-es'
import { initStroage, stroageEventListener } from './utils'
import type { CustomStorage, StorageEvent } from './utils'

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
 * 清除全部状态
 */
export const clearAllState = (store: Store) => {
  const stateKeys = Object.keys(store.$state)
  stateKeys.forEach((stateKey) => (store.$state[stateKey] = undefined))
}

/**
 * 清除单个状态
 */
export const clearSingleState = (
  store: Store,
  path: string,
  value: string | null | undefined,
) => {
  store[path] = value ? JSON.parse(value) : value
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
  value: string | null | undefined,
) => {
  if (isString(strategy.paths))
    store[strategy.paths] = value ? JSON.parse(value) : value
  else store.$patch(value ? JSON.parse(value) : value)
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

  if (isString(strategy.paths)) {
    const storageKey = strategy.paths
    const storageVal = store.$state[storageKey]
    if (![undefined].includes(storageVal))
      windowStorage.setItem(storeKey, JSON.stringify(storageVal), true)
  }
  else if (isArray(strategy.paths)) {
    const storageVal = strategy.paths.reduce((obj, key) => {
      obj[key] = store.$state[key]
      return obj
    }, {} as State)
    if (storageVal)
      windowStorage.setItem(storeKey, JSON.stringify(storageVal), true)
  }
  else {
    const storageVal = store.$state
    if (storageVal)
      windowStorage.setItem(storeKey, JSON.stringify(storageVal), true)
  }
}

/**
 * Pinia 持久化存储插件
 */
export const piniaPluginStorage = ({ options, store }: PiniaPluginContext) => {
  initStroage()
  if (has(options, 'storage')) {
    const {
      enabled = false,
      storage = localStorage,
      strategies = [{ key: store.$id, storage: localStorage }],
    } = options.storage || {}

    if (enabled) {
      strategies.forEach((strategy) => {
        const windowStorage = strategy.storage || storage
        const storageKey = strategy.key || store.$id
        const storageVal = windowStorage.getItem(storageKey)
        // 存储更新状态
        if (storageVal) updateStore(strategy, store, storageVal)
        // 状态更新存储
        else updateStorage(strategy, store, storage)
      })

      const callback = (event: StorageEvent) => {
        const { update, newValue, key, type } = event
        // 全部清除
        if (isEmpty(key)) return clearAllState(store)
        const strategy = strategies.find((strategy) => strategy.key === key)
        if (!update && strategy) {
          const isRemove = ['removeItem'].includes(type)
          if (isRemove) {
            // 移除单个
            if (isArray(strategy.paths)) {
              return strategy.paths.forEach((path) =>
                clearSingleState(store, path, newValue),
              )
            }
            // 全部清除
            if (!has(strategy, 'paths')) clearAllState(store)
          }
          else {
            updateStore(strategy, store, newValue)
          }
        }
      }
      // 监听 storage 更新状态
      stroageEventListener('storage', callback)
      // 监听 setItem 更新状态
      stroageEventListener('setItem', callback)
      // 监听 removeItem 更新状态
      stroageEventListener('removeItem', callback)
      // 监听 clear 更新状态
      stroageEventListener('clear', callback)
      // 监听状态更新存储
      store.$subscribe(() => {
        strategies.forEach((strategy) =>
          updateStorage(strategy, store, storage),
        )
      })
    }
  }
}

export { piniaPluginStorage as default }

export * from './utils'
