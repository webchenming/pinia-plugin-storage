import { beforeAll, describe, expect, test } from 'vitest'
import { computed, ref } from 'vue'
import { createPinia, defineStore, setActivePinia } from 'pinia'

import PiniaStorePlugin from '../index'

const useStore = defineStore(
  'store',
  () => {
    const count = ref(1)
    const doubleCount = computed(() => count.value * 2)
    const increment = () => count.value++
    return { count, doubleCount, increment }
  },
  {
    storage: [],
  },
)

describe('demo', () => {
  let store: any

  beforeAll(() => {
    setActivePinia(createPinia().use(PiniaStorePlugin))
    store = useStore()
  })

  test('count', () => {
    const { count } = store
    expect(count).toBe(1)
  })
})
