import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/shared/router'
import AppHeader from '@/widgets/app-header/app-header.vue'

const UsersPage = {
  path: routes.users.path,
  name: routes.users.name,
  components: {
    default: () => import('./users-page.vue'),
    header: AppHeader,
  },
} satisfies RouteRecordRaw

export default UsersPage
