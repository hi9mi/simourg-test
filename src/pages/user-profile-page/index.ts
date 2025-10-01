import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/shared/router'
import AppHeader from '@/widgets/app-header/app-header.vue'

const UsersPage = {
  path: routes.viewUser.path,
  name: routes.viewUser.name,
  components: {
    default: () => import('./user-profile-page.vue'),
    header: AppHeader,
  },
} satisfies RouteRecordRaw

export default UsersPage
