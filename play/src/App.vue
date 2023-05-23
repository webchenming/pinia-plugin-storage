<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { getItem, removeItem, setItem } from 'pinia-plugin-storage'

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
const count = ref(token.value || 0)
const handleClick1 = () => {
  setItem('TOKEN', ++count.value)
}
const handleClick2 = () => {
  const user = getItem<User>('USER')
  user.token = ++count.value
  user.id = `token-${user.token}`
  setItem('USER', user)
}
const handleClick3 = () => {
  count.value = 0
  removeItem('TOKEN')
  removeItem('USER')
}

interface Menu {
  path?: string
  name?: string
  component?: string
}
const useMenuStore = defineStore({
  id: 'menu',
  state: (): Menu => ({
    path: '/',
    name: 'Index',
    component: 'layout',
  }),
  storage: {
    enabled: true,
  },
})
const menuStore = useMenuStore()
const handleClick4 = () => {
  const menu = getItem<Menu>('menu')
  menu.path = '/home'
  menu.name = 'Home'
  menu.component = '/views/home'
  setItem('menu', menu)
}
const handleClick5 = () => {
  removeItem('menu')
}
</script>

<template>
  <div>
    <pre>count: {{ count }}</pre>
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
</template>

<style>
button + button {
  margin-left: 8px;
}
</style>
