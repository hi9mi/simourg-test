<script setup lang="ts">
import type { UpdateUserDto, User } from '@/shared/api'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersViewStore } from '@/entities/user'
import UserForm from '@/features/user-form/user-form.vue'
import { updateUser } from '@/shared/api'
import { routes } from '@/shared/router'

const router = useRouter()
const route = useRoute()

const usersViewStore = useUsersViewStore()

async function submit(values: UpdateUserDto): Promise<User> {
  const id = Number(route.params.id)
  return updateUser(id, values)
}

function onSubmitted(u: User) {
  router.push({ name: routes.viewUser.name, params: { id: u.id } })
}

watch(
  () => route.params.id,
  (value) => {
    const n = Number(value)
    if (Number.isFinite(n))
      usersViewStore.fetch(n)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">
        Обновить пользователя
      </h1>
    </div>

    <UserForm mode="create" :submit="submit" submit-label="Обновить" :initial-values="usersViewStore.state.user ?? {}" :pending="usersViewStore.state.loading" @submitted="onSubmitted" />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 12px;
}
.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.page__title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}
</style>
