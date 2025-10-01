import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/shared/router'
import AppHeader from '@/widgets/app-header/app-header.vue'

const UsersPage = {
  path: routes.editUser.path,
  name: routes.editUser.name,
  components: {
    default: () => import('./edit-user-page.vue'),
    header: AppHeader,
  },
} satisfies RouteRecordRaw

export default UsersPage
