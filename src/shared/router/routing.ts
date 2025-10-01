import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes = {
  users: {
    path: '/users',
    name: 'listUsers',
  },
  createUser: {
    path: '/users/new',
    name: 'createUser',
  },
  viewUser: {
    path: '/users/:id',
    name: 'viewUser',
  },
  editUser: {
    path: '/users/:id/edit',
    name: 'editUser',
  },
} as const

export type RouteName = typeof routes[keyof typeof routes]['name']

export function createAppRouter(routesMap: RouteRecordRaw[], baseUrl: string) {
  const router = createRouter({
    history: createWebHistory(baseUrl),
    scrollBehavior(_, __, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      else {
        return { top: 0 }
      }
    },
    routes: routesMap,
  })

  return router
}
