<script setup lang="ts">
import { toRefs } from 'vue'
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    token: 1,
    userInfo: { name: 'xxx' },
  }),
  storage: {
    strategies: [
      {
        key: '__TOKEN__',
        paths: 'token',
        storage: localStorage,
      },
      {
        key: '__USER_INFO__',
        paths: ['token', 'userInfo'],
      },
    ],
  },
})

const userStore = useUserStore()
const { token } = toRefs(userStore)

const handleClick = () => {
  localStorage.setItem('__TOKEN__', JSON.stringify(++token.value))
}
</script>

<template>
  <div>{{ token }}</div>
  <button @click="handleClick">
    点击通过 localStorage.setItem 更新状态
  </button>
</template>

<style lang="less" scoped></style>
