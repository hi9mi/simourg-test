<script setup lang="ts">
import type { User } from '@/shared/api'
import { AxiosError } from 'axios'
import { computed, reactive, watch } from 'vue'
import { email as emailRule, required, useCompositeFields, useField } from '@/shared/libs/vue/form'
import SgButton from '@/shared/ui/buttons/sg-button/sg-button.vue'
import SgTextField from '@/shared/ui/inputs/sg-text-field/sg-text-field.vue'

type Mode = 'create' | 'edit'
interface Values {
  fullName: string
  email: string
  status: 'active' | 'blocked'
}

const props = withDefaults(defineProps<{
  mode: Mode
  initialValues?: Partial<Values>
  submit: (values: Values) => Promise<User>
  pending?: boolean
  submitLabel: string
}>(), {
  initialValues: () => ({}),
  pending: false,

})

const emit = defineEmits<{
  submitted: [user: User]
}>()
const formState = reactive<{ loading: boolean, error: string | null }>({ loading: false, error: null })

const fullNameField = useField({ initialValue: '', rules: [required('Укажите ФИО')] })
const emailField = useField({ initialValue: '', rules: [required('Укажите email'), emailRule('Введите корректный email')] })
const statusField = useField<'active' | 'blocked'>({ initialValue: 'active' })

const userForm = useCompositeFields({
  fullName: fullNameField,
  email: emailField,
  status: statusField,
})

const fullName = fullNameField.value
const email = emailField.value
const status = statusField.value

const fullNameError = computed(() => fullNameField.dirtyErrors.value[0] ?? null)
const emailError = computed(() => emailField.dirtyErrors.value[0] ?? null)

watch(
  () => props.initialValues,
  (v) => {
    userForm.restore({
      email: v.email,
      fullName: v.fullName,
      status: v.status,
    })
  },
)

const disabled = computed(() =>
  !userForm.isValid || formState.loading || props.pending,
)

async function onSubmit() {
  if (formState.loading || props.pending)
    return
  formState.error = null
  if (!userForm.validateAll())
    return

  formState.loading = true
  try {
    const user = await props.submit(userForm.values())
    emit('submitted', user)
  }
  catch (e) {
    if (e instanceof AxiosError) {
      formState.error = e?.message ?? 'Операция не выполнена'
    }
  }
  finally {
    formState.loading = false
  }
}
</script>

<template>
  <form class="card form" @submit.prevent="onSubmit">
    <div v-if="pending" class="form__hint">
      Загрузка данных…
    </div>

    <div class="form__body" :class="{ 'is-busy': formState.loading }">
      <div class="form__row">
        <SgTextField
          v-model="fullName"
          label="ФИО"
          placeholder="Иван Иванов"
          :disabled="pending"
          :error="fullNameError"
          @blur="fullNameField.touch"
        />
      </div>

      <div class="form__row">
        <SgTextField
          v-model="email"
          label="Email"
          placeholder="user@example.com"
          :disabled="pending"
          :error="emailError"
          @blur="emailField.touch"
        />
      </div>

      <div class="form__row">
        <label class="form__label">Статус</label>
        <div class="form__controls">
          <label class="radio">
            <input v-model="status" type="radio" value="active" :disabled="pending" @blur="statusField.touch">
            <span>Active</span>
          </label>
          <label class="radio">
            <input v-model="status" type="radio" value="blocked" :disabled="pending" @blur="statusField.touch">
            <span>Blocked</span>
          </label>
        </div>
      </div>

      <div v-if="formState.error" class="form__error">
        {{ formState.error }}
      </div>
    </div>

    <div class="form__actions">
      <SgButton color="blue" :disabled="disabled" :loading="formState.loading" type="submit">
        {{ submitLabel }}
      </SgButton>
      <slot name="secondary-actions" />
    </div>
  </form>
</template>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
}
.form {
  max-width: 560px;
}
.form__body {
  display: grid;
  gap: 14px;
  margin-bottom: 14px;
  position: relative;
  transition:
    filter 160ms ease,
    opacity 160ms ease;
}
.form__body.is-busy {
  filter: blur(2px);
  opacity: 0.85;
  pointer-events: none;
}
.form__row {
  display: grid;
  gap: 6px;
}
.form__label {
  font-size: 13px;
  font-weight: 600;
  color: #24292f;
}
.form__controls {
  display: flex;
  gap: 12px;
}
.radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #1f2328;
}
.form__actions {
  display: flex;
}
.form__error {
  color: #e5484d;
}
.form__hint {
  color: #6b7280;
  margin-bottom: 14px;
}
</style>
