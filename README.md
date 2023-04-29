# Pinia-Plugin-Storage



## 概述

在使用之前请确保你已经 [安装 Pinia](https://pinia.vuejs.org/zh/getting-started.html)

- 支持单独配置
- 支持配置策略
- 支持存储修改更新状态

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

const useUserStore
```

