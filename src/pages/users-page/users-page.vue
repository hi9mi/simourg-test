<script setup lang="ts">
import type { User } from '@/shared/api'
import type { SgTableColumn } from '@/shared/ui/data-display/sg-table/types'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersListStore } from '@/entities/user'
import { formatDate } from '@/shared/libs/format'
import { debounce } from '@/shared/libs/rate-limiters'
import { useQueryParam } from '@/shared/libs/vue/use-query-param'
import { routes } from '@/shared/router'
import SgButton from '@/shared/ui/buttons/sg-button/sg-button.vue'
import SgBadge from '@/shared/ui/data-display/sg-badge/sg-badge.vue'
import SgTable from '@/shared/ui/data-display/sg-table/sg-table.vue'
import SgTextField from '@/shared/ui/inputs/sg-text-field/sg-text-field.vue'

const router = useRouter()
const usersListStore = useUsersListStore()

const page = useQueryParam('page', {
  default: 1,
  mode: 'push',
})
const nameQuery = useQueryParam('search', {
  default: '',
  mode: 'replace',
})

const columns: SgTableColumn<User>[] = [
  { name: 'id', label: 'ID', field: r => r.id },
  { name: 'fullName', label: 'ФИО', field: r => r.fullName },
  { name: 'email', label: 'Email', field: r => r.email },
  { name: 'registeredAt', label: 'Дата регистрации', field: r => r.registeredAt, format: v => formatDate(v) },
  { name: 'status', label: 'Статус', align: 'center' },
  { name: 'actions', label: 'Действия', align: 'center' },
]

const debouncedFetchUsers = debounce((p: number, q: string) => {
  usersListStore.fetch({ page: p, search: q })
}, 700)

usersListStore.fetch({ page: page.value, search: nameQuery.value.trim() })

watch(page, (p) => {
  usersListStore.fetch({ page: p, search: nameQuery.value.trim() })
})

watch(nameQuery, (q) => {
  page.value = 1
  debouncedFetchUsers(1, q.trim())
})
</script>

<template>
  <div class="page">
    <SgTable
      :rows="usersListStore.state.items"
      :columns="columns"
      :loading="usersListStore.state.loading"
      :error="usersListStore.state.error"
      :pagination="{ page, limit: 10, total: usersListStore.state.total }"
      row-key="id"
      @update:pagination="(p) => (page = p.page)"
    >
      <template #title>
        <div class="page__header">
          <h1 class="page__title">
            Пользователи
          </h1>
          <SgTextField
            v-model="nameQuery"
            placeholder="Искать по имени или email"
            label="Поиск"
          />
        </div>
      </template>

      <template #cell:status="{ row }">
        <SgBadge :color="row.status === 'active' ? 'green' : 'red'">
          {{ row.status }}
        </SgBadge>
      </template>

      <template #cell:actions="{ row }">
        <div class="table__actions">
          <SgButton color="blue" @click="router.push({ name: routes.viewUser.name, params: { id: row.id } })">
            Профиль
          </SgButton>
          <SgButton color="orange" @click="router.push({ name: routes.editUser.name, params: { id: row.id } })">
            Редактировать
          </SgButton>
        </div>
      </template>
    </SgTable>
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
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
}
.page__title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.table__actions {
  display: flex;
  gap: 6px;
  justify-content: center;
}
</style>
