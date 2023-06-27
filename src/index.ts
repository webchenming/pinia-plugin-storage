import type { PiniaPluginContext } from 'pinia'
import { initStroage } from './utils'
import { type StorageOptions, init } from './core/init'

declare module 'pinia' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    storage?: StorageOptions
  }
}

/**
 * Pinia 持久化存储插件
 */
export const piniaPluginStorage = ({ options, store }: PiniaPluginContext) => {
  initStroage()
  init({ options, store })
}

export { piniaPluginStorage as default }

export * from './utils'
