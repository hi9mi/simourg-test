import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/shared/router'

export default {
  path: '/',
  redirect: { name: routes.users.name },
} satisfies RouteRecordRaw
