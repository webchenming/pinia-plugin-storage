# Pinia-Plugin-Storage



## 概述

在使用之前请确保你已经 [安装 Pinia](https://pinia.vuejs.org/zh/getting-started.html)

- 支持单独配置
- 支持配置策略
- 支持存储状态双向更新

## 安装

```
pnpm i pinia-plugin-storage
```

## 使用

```ts
import { createPinia } from 'pinia'
import piniaPluginStorage from 'pinia-plugin-storage'

const pinia = createPinia()
pinia.use(piniaPluginStorage)

const useUserStore = defineStore('user', {
  state: () => ({
    token: 1,
    userInfo: { name: 'xxx' },
  }),
  storage: {
    // 配置是否启用，默认 true
    enabled: true,
    // 配置存储方式，默认 sessionStorage
    storage: localStorage,
    // 配置策略，默认存储全部
    strategies: [
      {
        // 存储的key
        key: '__TOKEN__',
        // 状态的key
        paths: 'token',
        // 存储方式，优先级大于外层
        storage: localStorage,
      },
      {
        key: '__USER_INFO__',
        paths: ['token', 'userInfo'],
      },
    ],
  },
})
```