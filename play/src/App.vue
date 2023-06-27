<script setup lang="ts">
import { defineStore } from 'pinia'
import { clear, getItem, removeItem, setItem } from 'pinia-plugin-storage'

interface State {
  num: number
  str: string
  obj: object
  arr: any[]
  _null: null
  _undefined: undefined
  fn: Function
  syb: Symbol
}
const useUserStore = defineStore({
  id: 'type',
  state: (): State => ({
    num: 0,
    str: '',
    obj: {},
    arr: [],
    _null: null,
    _undefined: undefined,
    fn: () => {},
    syb: Symbol(0),
  }),
  storage: {
    enabled: true,
    strategies: [
      { key: 'num', paths: 'num' },
      { key: 'str', paths: 'str' },
      { key: 'obj', paths: 'obj' },
      { key: 'null', paths: '_null' },
      { key: 'undefined', paths: '_undefined' },
      { key: 'fn', paths: 'fn' },
      { key: 'syb', paths: 'syb' },
      {
        key: 'all',
        paths: ['num', 'str', 'obj', '_null', '_undefined', 'fn', 'syb'],
      },
    ],
  },
})
const userStore = useUserStore()
const handleClick = () => {
  let num = getItem<number>('num') || 0
  setItem('num', ++num)
}

const handleReload = () => {
  location.reload()
}

const handleRemove = () => {
  removeItem('num')
  handleReload()
}

const handleClear = () => {
  clear()
  handleReload()
}
</script>

<template>
  <div>
    <button @click="handleClick">
      更新状态
    </button>
    <button @click="handleRemove">
      清除存储与状态
    </button>
    <button @click="handleClear">
      清除全部
    </button>
    <button @click="handleReload">
      刷新页面
    </button>
    <pre>num: {{ getItem("num") }}</pre>
    <pre>str: {{ getItem("str") }}</pre>
    <pre>obj: {{ getItem("obj") }}</pre>
    <pre>_null: {{ getItem("null") }}</pre>
    <pre>_undefined: {{ getItem("_undefined") }}</pre>
    <pre>fn: {{ getItem("fn") }}</pre>
    <pre>syb: {{ getItem("syb") }}</pre>
    <pre>{{ userStore.$state }}</pre>
  </div>
</template>

<style>
button + button {
  margin-left: 8px;
}
</style>
