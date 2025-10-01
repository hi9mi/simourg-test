<script setup lang="ts">
interface TextFieldProps {
  label?: string
  placeholder?: string
  error?: string | null
  disabled?: boolean
}

defineProps<TextFieldProps>()

const modelValue = defineModel<string>()
</script>

<template>
  <div class="text-field" :class="{ 'text-field--invalid': !!error, 'text-field--disabled': disabled }">
    <label v-if="label" class="text-field__label">{{ label }}</label>
    <input
      v-model="modelValue"
      class="text-field__input"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      v-bind="$attrs"
    >
    <span v-if="error" class="text-field__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.text-field__label {
  font-size: 13px;
  font-weight: 600;
  color: #24292f;
}

.text-field__input {
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #fff;
  color: #1f2328;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-color 0.2s,
    color 0.2s;
}

.text-field__input:focus {
  outline: none;
  border-color: #228be6;
  box-shadow: 0 0 0 2px rgba(34, 139, 230, 0.3);
}

.text-field__input::placeholder {
  color: #8c959f;
}

.text-field--disabled .text-field__input {
  background: #f6f8fa;
  color: #6e7781;
  cursor: not-allowed;
}
.text-field--disabled .text-field__label {
  color: #6e7781;
}

.text-field--invalid .text-field__input {
  border-color: #fa5252;
  box-shadow: 0 0 0 2px rgba(250, 82, 82, 0.2);
}
.text-field__error {
  font-size: 12px;
  color: #fa5252;
}
</style>
