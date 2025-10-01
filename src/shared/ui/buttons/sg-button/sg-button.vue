<script setup lang="ts">
type Variant = 'filled' | 'light' | 'outline' | 'transparent'
type Color = 'blue' | 'red' | 'orange' | 'green'
type Size = 'sm' | 'md'

const props = withDefaults(defineProps<{
  variant?: Variant
  color?: Color
  size?: Size
  block?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'filled',
  color: 'blue',
  size: 'sm',
  block: false,
  loading: false,
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

function onClick(event: MouseEvent) {
  if (props.loading || props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    class="btn"
    :class="[
      `btn--${variant}`,
      `btn--${color}`,
      `btn--${size}`,
      { 'btn--block': block, 'btn--loading': loading },
    ]"
    :type="type"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span class="btn__content"><slot /></span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: #1f2328;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s,
    opacity 0.2s;
}
.btn--sm {
  padding: 4px 10px;
  font-size: 13px;
}
.btn--md {
  padding: 6px 12px;
  font-size: 14px;
}
.btn--block {
  width: 100%;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--filled.btn--blue {
  background: #228be6;
  color: #fff;
  border-color: #228be6;
}
.btn--filled.btn--blue:hover {
  background: #1e7ac9;
}

.btn--filled.btn--red {
  background: #fa5252;
  color: #fff;
  border-color: #fa5252;
}
.btn--filled.btn--red:hover {
  background: #dc4747;
}

.btn--filled.btn--orange {
  background: #fd7e14;
  color: #fff;
  border-color: #fd7e14;
}
.btn--filled.btn--orange:hover {
  background: #df6f12;
}

.btn--filled.btn--green {
  background: #40c057;
  color: #fff;
  border-color: #40c057;
}
.btn--filled.btn--green:hover {
  background: #36a84a;
}

.btn--light.btn--blue {
  background: #e9f3fe;
  color: #228be6;
  border-color: #cfe6fd;
}
.btn--light.btn--blue:hover {
  background: #dfeefe;
}

.btn--light.btn--red {
  background: #feeded;
  color: #fa5252;
  border-color: #fbd3d3;
}
.btn--light.btn--red:hover {
  background: #fbe3e3;
}

.btn--light.btn--orange {
  background: #fff1e6;
  color: #fd7e14;
  border-color: #ffd9bf;
}
.btn--light.btn--orange:hover {
  background: #ffe7d1;
}

.btn--light.btn--green {
  background: #eaf8ee;
  color: #40c057;
  border-color: #cfeeda;
}
.btn--light.btn--green:hover {
  background: #def3e6;
}

.btn--outline {
  background: transparent;
}
.btn--outline.btn--blue {
  color: #228be6;
  border-color: #228be6;
}
.btn--outline.btn--blue:hover {
  background: #f4f9ff;
}

.btn--outline.btn--red {
  color: #fa5252;
  border-color: #fa5252;
}
.btn--outline.btn--red:hover {
  background: #fff6f6;
}

.btn--outline.btn--orange {
  color: #fd7e14;
  border-color: #fd7e14;
}
.btn--outline.btn--orange:hover {
  background: #fff8f1;
}

.btn--outline.btn--green {
  color: #40c057;
  border-color: #40c057;
}
.btn--outline.btn--green:hover {
  background: #f4fbf7;
}

.btn--transparent {
  background: transparent;
  border-color: transparent;
}
.btn--transparent.btn--blue {
  color: #228be6;
}
.btn--transparent.btn--blue:hover {
  background: #f6faff;
}

.btn--transparent.btn--red {
  color: #fa5252;
}
.btn--transparent.btn--red:hover {
  background: #fff8f8;
}

.btn--transparent.btn--orange {
  color: #fd7e14;
}
.btn--transparent.btn--orange:hover {
  background: #fffbf6;
}

.btn--transparent.btn--green {
  color: #40c057;
}
.btn--transparent.btn--green:hover {
  background: #f7fcf9;
}

.btn--loading .btn__content {
  opacity: 0.8;
}
</style>
