<script setup lang="ts">
type Color = 'green' | 'red'
type Size = 'sm' | 'md'

withDefaults(defineProps<{
  color?: Color
  size?: Size
}>(), {
  color: 'green',
  size: 'sm',
})
</script>

<template>
  <span class="badge" :class="[`badge--${color}`, `badge--${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  line-height: 1;
  border: 1px solid transparent;
  white-space: nowrap;
  border-radius: 999px;
}

.badge--sm {
  font-size: 12px;
  padding: 2px 8px;
}
.badge--md {
  font-size: 13px;
  padding: 4px 10px;
}

.badge--green {
  background: #eaf8ee;
  color: #2f9e44;
  border-color: #d4eedc;
}
.badge--red {
  background: #feeded;
  color: #c92a2a;
  border-color: #fbd3d3;
}
</style>
