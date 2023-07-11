# Pinia-Plugin-Storage

## 概述

在使用之前请确保你已经 [安装 Pinia](https://pinia.vuejs.org/zh/getting-started.html)

- 支持单独配置
- 支持配置策略
- 内置方法
- 支持存储状态双向更新

## 安装

```
pnpm i pinia-plugin-storage
```

## 使用

```ts
import { createPinia } from "pinia"
import piniaPluginStorage from "pinia-plugin-storage"

const pinia = createPinia()
pinia.use(piniaPluginStorage)

const useUserStore = defineStore({
  id: "user",
  state: () => ({
    token: 1,
    userInfo: { name: "xxx" }
  }),
  storage: {
    // 全局存储 key，默认 store 的 id
    globalKey: 'GLOBAL-KEY',
    // 配置是否启用，默认 false
    enabled: true,
    // 配置存储方式，默认 localStorage
    storage: localStorage,
    // 配置策略，默认存储全部
    strategies: [
      {
        // 存储的 key
        key: "TOKEN",
        // 存储单个状态，数据类型为状态类型
        paths: "token",
        // 存储方式，优先级大于外层
        storage: localStorage
      },
      {
        key: "USER-INFO",
        // 存储多个状态为一个对象，数组的每一项为对象的 key
        paths: ["token", "userInfo"]
      }
    ]
  }
})
```

可以通过原生 `localStorage.setItem` 更新状态

```ts
localStorage.setItem("TOKEN", 2)
```

## 方法

| 方法名    | 说明     | 版本     |
| --------- | -------- | -------- |
| `setItem` | 设置状态 | >= 0.0.6 |
| `getItem` | 获取状态 | >= 0.0.6 |
| `removeItem` | 移除状态 | >= 0.0.6 |
| `clear` | 清除状态 | >= 0.0.6 |
| `JSONParse` | JSON反序列化，支持 function 和 symbol | >= 0.0.8 |
| `JSONStringify` | JSON序列化，支持 function 和 symbol | >= 0.0.8 |

```ts
import { setItem, getItem } from 'pinia-plugin-storage'

interface User { name: string }

setItem<User>('USER-INFO', { name: 'yyy' })
const userInfo = getItem<User>('USER-INFO')
console.log(userInfo)
```

类型说明

```ts
clear(): void
removeItem(key: string, storage: Storage): void

getItem<V>(key: string, storage: Storage): V | null
setItem<V>(key: string, value: V, storage: Storage): void

JSONParse<V>(data: string): V
JSONStringify<T>(data: T): void
```

