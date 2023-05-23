<script setup lang="ts">
import { toRefs } from 'vue'
import { defineStore } from 'pinia'

const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: undefined,
    userInfo: undefined,
  }),
  storage: {
    storage: localStorage,
    strategies: [
      {
        key: '__TOKEN__',
        paths: 'token',
      },
      {
        key: '__USER_INFO__',
        paths: 'userInfo',
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
