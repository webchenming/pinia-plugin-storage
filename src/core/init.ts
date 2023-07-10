import type { PiniaPluginContext } from 'pinia'
import {
  forEach,
  has,
  isArray,
  isEmpty,
  isString,
  isUndefined,
  reduce,
} from 'lodash-es'
import type { CustomStorage, StorageEvent } from '../utils'
import { JSONParse, JSONStringify, stroageEventListener } from '../utils'

export type Store = PiniaPluginContext['store']

export type State = Store['$state']

/**
 * 策略配置项类型
 * @param key 存储的key [String]
 * @param storage 存储方式 [localStorage | sessionStorage]
 * @param paths 状态的key [String | String[]]
 */
export interface PiniaStrategy {
  key: string
  storage?: Storage
  paths: null | string | string[]
}

/**
 * 插件配置项类型
 * @param enabled 是否启用 [Boolean]
 * @param storage 存储方式 [localStorage | sessionStorage]
 * @param strategies 存储策略 [PiniaStrategy[]]
 */
export interface StorageOptions {
  enabled: boolean
  globalKey?: string
  storage?: Storage
  strategies?: PiniaStrategy[]
}

/**
 * 清除全部状态
 */
export const clearAllState = (store: Store) => {
  const stateKeys = Object.keys(store.$state)
  forEach(stateKeys, (stateKey) => (store.$state[stateKey] = undefined))
}

/**
 * 清除单个状态
 */
export const clearSingleState = (
  store: Store,
  path: string,
  value: string | null | undefined,
) => {
  const o = value ? JSONParse<any>(value) : value
  store[path] = o
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
  if (isString(strategy.paths)) {
    const o = value ? JSONParse<any>(value) : value
    store[strategy.paths] = o
  }
  else {
    const o = value ? JSONParse<any>(value) : value
    store.$patch(o)
  }
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
  globalKey?: string,
) => {
  const storeKey = strategy.key || globalKey || store.$id

  if (isString(strategy.paths)) {
    const storageKey = strategy.paths
    const storageVal = store.$state[storageKey]
    if (!isUndefined(storageVal))
      storage.setItem(storeKey, JSONStringify(storageVal), true)
  }
  else {
    let storageVal
    if (isArray(strategy.paths)) {
      storageVal = reduce(
        strategy.paths,
        (res, key) => {
          res[key] = store.$state[key]
          return res
        },
        {} as State,
      )
    }
    else {
      storageVal = store.$state
    }
    // 除去 undefined
    storageVal = storageVal ? JSONParse<any>(JSONStringify(storageVal)) : {}
    if (!isEmpty(storageVal))
      storage.setItem(storeKey, JSONStringify(storageVal), true)
  }
}

/**
 * 初始化
 */
export const init = ({ options, store }: Partial<PiniaPluginContext>) => {
  if (options && store && has(options, 'storage')) {
    let {
      globalKey,
      enabled = false,
      storage = localStorage,
      strategies,
    } = options.storage || {}

    if (!strategies?.length)
      strategies = [{ key: globalKey || store.$id, storage, paths: null }]

    if (enabled) {
      // 初始化状态与存储
      forEach(strategies, (strategy) => {
        const windowStorage = (strategy.storage || storage) as CustomStorage
        const storageKey = strategy.key || store.$id
        const storageVal = windowStorage.getItem(storageKey)
        // 存储更新状态
        if (storageVal) updateStore(strategy, store, storageVal)
        // 状态更新存储
        else updateStorage(strategy, store, windowStorage, globalKey)
      })

      // 监听 storage 更新状态
      stroageEventListener('storage', () => {
        clearAllState(store)
      })

      // 监听 setItem 更新状态
      stroageEventListener('setItem', (event: StorageEvent) => {
        const { noRefresh, newValue, key } = event
        const strategy = strategies?.find((strategy) => strategy.key === key)
        if (!noRefresh && strategy) updateStore(strategy, store, newValue)
      })

      // 监听 removeItem 更新状态
      stroageEventListener('removeItem', (event: StorageEvent) => {
        const { newValue, key } = event
        const strategy = strategies?.find((strategy) => strategy.key === key)
        if (strategy) {
          if (isString(strategy.paths)) {
            const { paths } = strategy
            clearSingleState(store, paths, newValue)
          }
          else if (isArray(strategy.paths)) {
            forEach(strategy.paths, (path) => {
              clearSingleState(store, path, newValue)
            })
          }
          else {
            clearAllState(store)
          }
        }
      })

      // 监听 clear 更新状态
      stroageEventListener('clear', () => {
        clearAllState(store)
      })

      // 监听状态更新存储
      store.$subscribe(() => {
        forEach(strategies, (strategy) => {
          const windowStorage = (strategy.storage || storage) as CustomStorage
          updateStorage(strategy, store, windowStorage, globalKey)
        })
      })
    }
  }
}
