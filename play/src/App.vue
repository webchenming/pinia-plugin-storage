<script setup lang="ts">
import { toRefs } from 'vue'
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    token: '1',
    userInfo: { name: 'xxx' },
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },
  },
  storage: {
    enabled: true,
    storage: sessionStorage,
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

const useCommonStore = defineStore('common', {
  state: () => ({
    msg: 'hello',
  }),
  storage: {
    enabled: false,
    storage: localStorage,
    strategies: [
      {
        key: '__MSG__',
        paths: 'msg',
      },
    ],
  },
})

const userStore = useUserStore()
const { token, userInfo } = toRefs(userStore)

const commonStore = useCommonStore()
const { msg } = toRefs(commonStore)

// userStore.setToken('2')
// userStore.setToken('3')
// userStore.setUserInfo({ name: 'yyy' })
// userInfo.value.name = 'yyy'
const handleClick = () => {
  // userStore.setUserInfo({ name: 'bbb' })
  userInfo.value.name = 'aaa'
}
</script>

<template>
  <div>{{ token }}</div>
  <div @click="handleClick">
    {{ userInfo }}
  </div>
  <div>{{ msg }}</div>
</template>

<style lang="less" scoped></style>
