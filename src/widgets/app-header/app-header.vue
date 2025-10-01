<script setup lang="ts">
import { routes } from '@/shared/router'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <nav class="app-header__nav">
        <router-link
          v-slot="{ isActive }"
          class="app-header__link"
          :to="{ name: routes.users.name }"
        >
          <span class="app-header__link-inner" :class="[{ 'is-active': isActive }]">
            Все Пользователи
          </span>
        </router-link>

        <router-link
          v-slot="{ isActive }"
          class="app-header__link"
          :to="{ name: routes.createUser.name }"
        >
          <span class="app-header__link-inner" :class="[{ 'is-active': isActive }]">
            Создать пользователя
          </span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.app-header__inner {
  padding: 10px 12px;
  display: flex;
  align-items: center;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-header__link {
  text-decoration: none;
}
.app-header__link-inner {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  color: #1f2328;
  background: transparent;
  transition:
    color 0.2s,
    border-color 0.2s;
}
.app-header__link-inner:hover {
  color: #228be6;
  border-bottom: 2px solid #228be6;
}
.app-header__link-inner.is-active {
  border-bottom: 2px solid #228be6;
}
</style>
