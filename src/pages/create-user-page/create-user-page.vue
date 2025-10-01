<script setup lang="ts">
import type { CreateUserDto, User } from '@/shared/api'
import { useRouter } from 'vue-router'
import UserForm from '@/features/user-form/user-form.vue'
import { createUser } from '@/shared/api'
import { routes } from '@/shared/router'

const router = useRouter()

async function submit(values: Omit<CreateUserDto, 'registeredAt'>): Promise<User> {
  return await createUser({
    ...values,
    registeredAt: new Date().toISOString(),
  })
}

function onSubmitted(u: User) {
  router.push({ name: routes.viewUser.name, params: { id: u.id } })
}
</script>

<template>
  <div class="page">
    <h1 class="page__title">
      Создать пользователя
    </h1>
    <UserForm mode="create" :submit="submit" submit-label="Создать" @submitted="onSubmitted" />
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
