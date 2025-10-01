import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/shared/router'
import AppHeader from '@/widgets/app-header/app-header.vue'

const UsersPage = {
  path: routes.createUser.path,
  name: routes.createUser.name,
  components: {
    default: () => import('./create-user-page.vue'),
    header: AppHeader,
  },
} satisfies RouteRecordRaw

export default UsersPage
