import type { Paginated, User } from '@/shared/api'
import { defineStore } from 'pinia'
import { reactive, shallowRef } from 'vue'
import { getUsers } from '@/shared/api'

interface ListState {
  items: User[]
  limit: number
  total: number
  loading: boolean
  error: string | null
}

export const useUsersListStore = defineStore('users/list', () => {
  const state = reactive<ListState>({
    items: [],
    limit: 10,
    total: 0,
    loading: false,
    error: null,
  })
  const controller = shallowRef<AbortController | null>(null)

  async function fetch({ page, search }: { page: number, search: string }) {
    const q = search.trim()

    controller.value?.abort()
    const _controller = new AbortController()
    controller.value = _controller

    state.loading = true
    state.error = null
    try {
      const res: Paginated<User> = await getUsers(
        { page, limit: state.limit, search: q },
        { signal: _controller.signal },
      )
      state.items = res.items
      state.total = res.totalItems
    }
    catch (e: any) {
      if (e?.name !== 'CanceledError') {
        state.error = e?.message ?? 'Не удалось загрузить пользователей'
      }
    }
    finally {
      if (controller.value === _controller) {
        state.loading = false
      }
    }
  }

  return { state, fetch }
})
