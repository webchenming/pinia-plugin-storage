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

const useUserStore = defineStore("user", {
  state: () => ({
    token: 1,
    userInfo: { name: "xxx" }
  }),
  storage: {
    // 配置是否启用，默认 true
    enabled: true,
    // 配置存储方式，默认 localStorage
    storage: localStorage,
    // 配置策略，默认存储全部
    strategies: [
      {
        // 存储的key
        key: "TOKEN",
        // 状态的key
        paths: "token",
        // 存储方式，优先级大于外层
        storage: localStorage
      },
      {
        key: "USER-INFO",
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
| `setItem` | 设置状态 | >= 0.0.5 |
| `getItem` | 获取状态 | >= 0.0.5 |
| `removeItem` | 移除状态 | >= 0.0.5 |
| `clear` | 清除状态 | >= 0.0.6 |

```ts
import { setItem, getItem } from 'pinia-plugin-storage'

setItem<{ name: string }>('USER-INFO', { name: 'yyy' })
const userInfo = getItem<{ name: string }>('USER-INFO')
console.log(userInfo)
```

类型说明

```ts
type setItem = <T>(key: string, value: T, storage = localStorage): void
type getItem = <R>(key: string, storage = localStorage): R
type removeItem = (key: string, storage = localStorage): void
type clear = (): void
```

