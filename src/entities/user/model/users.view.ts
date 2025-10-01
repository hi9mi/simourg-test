import type { User } from '@/shared/api'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { getUser } from '@/shared/api'

interface ViewState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useUsersViewStore = defineStore('users/view', () => {
  const state = reactive<ViewState>({
    user: null,
    loading: false,
    error: null,
  })

  async function fetch(id: number) {
    state.loading = true
    state.error = null
    try {
      const user = await getUser(id)
      state.user = user
    }
    catch (e: any) {
      state.error = e?.message ?? 'Не удалось загрузить пользователя'
    }
    finally {
      state.loading = false
    }
  }

  return { state, fetch }
})
