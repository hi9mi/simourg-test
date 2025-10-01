<script setup lang="ts" generic="T extends Record<string, any>">
import type { SgTableColumn, SgTablePagination } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  rows?: T[]
  columns?: SgTableColumn<T>[]
  rowKey?: keyof T | ((row: T, index: number) => string | number)
  loading?: boolean
  error?: string | null
  pagination?: SgTablePagination | null
  loadingText?: string
  emptyText?: string
}>(), {
  title: '',
  rows: () => [],
  columns: () => [],
  loading: false,
  error: null,
  pagination: null,
  loadingText: 'Загрузка…',
  emptyText: 'Ничего не найдено',
})

const emit = defineEmits<{
  'update:pagination': [value: SgTablePagination]
  'rowClick': [row: T, index: number]
}>()

function valueFor(row: T, i: number, col: SgTableColumn<T>) {
  if (!col.field)
    return ''
  const raw = col.field(row, i)
  const val = col.format ? col.format(raw, row, i) : raw
  return val ?? ''
}

const pages = computed(() => {
  if (!props.pagination)
    return 1
  const { total, limit } = props.pagination
  return Math.max(1, Math.ceil((total || 0) / Math.max(1, limit || 1)))
})
const canPrev = computed(() => !!props.pagination && props.pagination.page > 1)
const canNext = computed(() => !!props.pagination && props.pagination.page < pages.value)

const rangeText = computed(() => {
  if (!props.pagination)
    return ''
  const { page, limit, total } = props.pagination
  const start = total ? (page - 1) * limit + 1 : 0
  const end = Math.min(page * limit, total)
  return `${start}-${end} из ${total}`
})

function setPage(p: number) {
  if (!props.pagination || props.loading)
    return
  const { limit, total } = props.pagination
  emit('update:pagination', {
    page: Math.min(Math.max(1, p), pages.value),
    limit,
    total,
  })
}
</script>

<template>
  <div class="sg-table">
    <h3 v-if="title || $slots.title" class="sg-table__title">
      <slot name="title">
        {{ title }}
      </slot>
    </h3>

    <div class="sg-table__wrap">
      <table class="sg-table__table">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.name"
              :class="[{ [`is-${col.align}`]: !!col.align, 'is-middle': col.align === 'middle' }]"
              :style="col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : null"
            >
              <slot :name="`head:${col.name}`">
                {{ col.label }}
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td :colspan="Math.max(1, columns.length)" class="sg-table__state">
              {{ loadingText }}
            </td>
          </tr>
          <tr v-else-if="error">
            <td :colspan="Math.max(1, columns.length)" class="sg-table__state sg-table__state--error">
              {{ error ?? 'Неизвестная ошибка' }}
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td :colspan="Math.max(1, columns.length)" class="sg-table__state">
              {{ emptyText }}
            </td>
          </tr>

          <template v-else>
            <tr
              v-for="(row, i) in rows"
              :key="typeof rowKey === 'function' ? rowKey(row, i) : (rowKey ? row[rowKey] : i)"
              @click="emit('rowClick', row, i)"
            >
              <td
                v-for="col in columns"
                :key="col.name"
                :class="[{ [`is-${col.align}`]: !!col.align, 'is-middle': col.align === 'middle' }]"
                :style="col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : null"
              >
                <slot
                  :name="`cell:${col.name}`"
                  :row="row"
                  :row-index="i"
                >
                  {{ valueFor(row, i, col) }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>

        <tfoot v-if="pagination">
          <tr>
            <td :colspan="Math.max(1, columns.length)">
              <div class="sg-table__footer">
                <div class="sg-table__range">
                  {{ rangeText }}
                </div>
                <div class="sg-table__pager">
                  <button
                    class="sg-pager__btn sg-pager__btn--prev"
                    :disabled="!canPrev || loading"
                    @click="setPage(pagination.page - 1)"
                  >
                    ‹ Предыдущая страница
                  </button>
                  <button
                    class="sg-pager__btn sg-pager__btn--next"
                    :disabled="!canNext || loading"
                    @click="setPage(pagination.page + 1)"
                  >
                    Следующая страница ›
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.sg-table {
  width: 100%;
}

.sg-table__title {
  margin: 0 0 10px;
  font-weight: 600;
}

.sg-table__wrap {
  width: 100%;
  overflow: auto;
}

.sg-table__table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
}
.sg-table__table thead th {
  background: #f8fafc;
}

thead th,
tbody td,
tfoot td {
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

tbody tr:nth-child(odd) td {
  background: #fcfcfd;
}
tbody tr:hover td {
  background: #f5f7fa;
}

.is-center {
  text-align: center;
}
.is-right {
  text-align: right;
}
.is-middle {
  vertical-align: middle;
}

.sg-table__state {
  padding: 16px;
  text-align: center;
  color: #666;
}
.sg-table__state--error {
  color: #e5484d;
}

.sg-table__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.sg-table__range {
  color: #666;
}

.sg-table__pager {
  display: flex;
  gap: 10px;
}

.sg-pager__btn {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #d0d7de;
  background: #ffffff;
  color: #1f2328;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}
.sg-pager__bt:hover {
  background: #f6f8fa;
}
.sg-page__bt:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
