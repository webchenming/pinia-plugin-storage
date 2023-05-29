<script setup lang="ts">
import { toRefs } from 'vue'
import { defineStore } from 'pinia'
import { clear, getItem, removeItem, setItem } from 'pinia-plugin-storage'

interface User {
  id?: string
  token?: number
}
const useUserStore = defineStore({
  id: 'user',
  state: (): User => ({
    id: undefined,
    token: undefined,
  }),
  storage: {
    enabled: true,
    strategies: [
      {
        key: 'TOKEN',
        paths: 'token',
      },
      {
        key: 'USER',
        paths: ['token', 'id'],
      },
    ],
  },
})
const userStore = useUserStore()
const { token } = toRefs(userStore)
const handleClick1 = () => {
  token.value = token.value ? token.value + 1 : 1
  setItem('TOKEN', token.value)
}
const handleClick2 = () => {
  const user = getItem<User>('USER')
  user.token = token.value ? token.value + 1 : 1
  user.id = `token-${user.token}`
  setItem('USER', user)
}
const handleClick3 = () => {
  removeItem('TOKEN')
  removeItem('USER')
}

interface Menu {
  menu: {
    path?: string
    name?: string
    component?: string
  }[]
  count?: number
}
const useMenuStore = defineStore({
  id: 'menu',
  state: (): Menu => ({
    menu: [
      {
        path: '/home',
        name: 'Home',
        component: '/views/home',
      },
    ],
    count: 1,
  }),
  storage: {
    enabled: true,
    globalKey: 'Menu',
  },
})
const menuStore = useMenuStore()
const handleClick4 = () => {
  const res = getItem<Menu>('menu')
  if (!res.menu?.length) res.menu = []
  res.menu.push({
    path: '/home',
    name: 'Home',
    component: '/views/home',
  })
  res.count = res.count ? res.count + 1 : 1
  setItem('menu', res)
}
const handleClick5 = () => {
  removeItem('menu')
}

const handleClick6 = () => {
  clear()
}
</script>

<template>
  <div>
    <button @click="handleClick6">
      清除全部
    </button>
  </div>
  <br>
  <div>
    <button @click="handleClick1">
      通过 setItem 更新 TOKEN 状态
    </button>
    <button @click="handleClick2">
      通过 setItem 更新 USER 状态
    </button>
    <button @click="handleClick3">
      清除存储与状态
    </button>
    <pre>token: {{ token }}</pre>
    <pre>{{ userStore.$state }}</pre>
  </div>
  <div>
    <button @click="handleClick4">
      通过 setItem 更新 menu 状态
    </button>
    <button @click="handleClick5">
      清除存储与状态
    </button>
    <pre>{{ menuStore.$state }}</pre>
  </div>
</template>

<style>
button + button {
  margin-left: 8px;
}
</style>
