<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersViewStore } from '@/entities/user'
import { formatDate } from '@/shared/libs/format'
import SgBadge from '@/shared/ui/data-display/sg-badge/sg-badge.vue'

const route = useRoute()

const usersViewStore = useUsersViewStore()

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
        Профиль
      </h1>
    </div>

    <div v-if="usersViewStore.state.loading" class="card card--state">
      Загрузка…
    </div>
    <div v-else-if="usersViewStore.state.error" class="card card--state card--error">
      {{ usersViewStore.state.error }}
    </div>

    <div v-else-if="usersViewStore.state.user" class="card">
      <div class="profile">
        <div class="profile__row">
          <div class="profile__label">
            ID
          </div>
          <div class="profile__value">
            {{ usersViewStore.state.user.id }}
          </div>
        </div>

        <div class="profile__row">
          <div class="profile__label">
            ФИО
          </div>
          <div class="profile__value">
            {{ usersViewStore.state.user.fullName }}
          </div>
        </div>

        <div class="profile__row">
          <div class="profile__label">
            Email
          </div>
          <div class="profile__value">
            <a class="profile__link" :href="`mailto:${usersViewStore.state.user.email}`">{{ usersViewStore.state.user.email }}</a>
          </div>
        </div>

        <div class="profile__row">
          <div class="profile__label">
            Зарегистрирован
          </div>
          <div class="profile__value">
            {{ formatDate(usersViewStore.state.user.registeredAt) }}
          </div>
        </div>

        <div class="profile__row">
          <div class="profile__label">
            Статус
          </div>
          <div class="profile__value">
            <SgBadge :color="usersViewStore.state.user.status === 'active' ? 'green' : 'red'">
              {{ usersViewStore.state.user.status }}
            </SgBadge>
          </div>
        </div>
      </div>
    </div>
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
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.page__title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
}
.card--state {
  text-align: center;
  color: #6b7280;
}
.card--error {
  color: #e5484d;
}

.profile {
  display: grid;
  grid-template-columns: 180px 1fr;
  column-gap: 16px;
  row-gap: 10px;
}
.profile__row {
  display: contents;
}
.profile__label {
  color: #6e7781;
  font-weight: 600;
}
.profile__value {
  color: #1f2328;
}
.profile__link {
  color: #228be6;
  text-decoration: none;
}
.profile__link:hover {
  text-decoration: underline;
}
@media (max-width: 640px) {
  .profile {
    grid-template-columns: 1fr;
  }
  .profile__label {
    margin-top: 8px;
  }
}
</style>
