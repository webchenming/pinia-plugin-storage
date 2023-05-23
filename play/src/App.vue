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
  setItem('TOKEN', ++token.value)
}
const handleClick2 = () => {
  const user = getItem<User>('USER')
  user.token = ++token.value || 0
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
}
const useMenuStore = defineStore({
  id: 'menu',
  state: (): Menu => ({
    menu: [
      // {
      //   path: '/',
      //   name: 'Index',
      //   component: 'layout',
      // },
    ],
  }),
  storage: {
    enabled: true,
    strategies: [
      {
        key: 'menu',
        paths: 'menu',
      },
    ],
  },
})
const menuStore = useMenuStore()
const handleClick4 = () => {
  const menu = getItem<Menu>('menu')
  // menu.path = '/home'
  // menu.name = 'Home'
  // menu.component = '/views/home'
  setItem('menu', menu)
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
    <pre>token: {{ token }}</pre>
    <pre>{{ userStore.$state }}</pre>
    <button @click="handleClick1">
      通过 setItem 更新 TOKEN 状态
    </button>
    <button @click="handleClick2">
      通过 setItem 更新 USER 状态
    </button>
    <button @click="handleClick3">
      清除存储与状态
    </button>
  </div>
  <div>
    <pre>{{ menuStore.$state }}</pre>
    <button @click="handleClick4">
      通过 setItem 更新 menu 状态
    </button>
    <button @click="handleClick5">
      清除存储与状态
    </button>
  </div>
  <br>
  <div>
    <button @click="handleClick6">
      清除全部
    </button>
  </div>
</template>

<style>
button + button {
  margin-left: 8px;
}
</style>
