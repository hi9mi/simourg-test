import type { Ref } from 'vue'
import type { Rule } from './rules'
import { computed, ref, watch } from 'vue'

export const NO_ERRORS: readonly string[] = Object.freeze([])

export function validate<T>(value: T, rules: Rule[]) {
  const errors = []
  for (const rule of rules) {
    const msg = rule(value)
    if (msg) {
      errors.push(msg)
    }
  }

  return errors.length > 0 ? errors : (NO_ERRORS as string[])
}

export function useField<T>(params: {
  initialValue: T
  rules?: Rule[]
}) {
  const { initialValue, rules } = params
  const value = ref(initialValue)
  const errors = ref<string[]>(rules ? validate(initialValue, rules) : (NO_ERRORS as string[]))

  const meta = createErrorsMeta({
    value,
    errors,
  })

  const restore = (next?: T) => {
    errors.value = NO_ERRORS as string[]
    value.value = next ?? initialValue
    meta.isDirty.value = false
  }

  const touch = () => {
    meta.isDirty.value = true
    if (rules)
      errors.value = validate(value.value, rules)
  }

  if (rules) {
    watch(value, (v) => {
      meta.isDirty.value = true
      errors.value = validate(v, rules)
    })
  }

  return {
    value,
    errors,
    touch,
    restore,
    rules,
    ...meta,
  }
}

function createErrorsMeta<T>(params: {
  value: Ref<T>
  errors: Ref<string[]>
}) {
  const { errors } = params
  const isDirty = ref(false)
  const isValid = computed(() => errors.value.length === 0)
  const hasErrors = computed(() => errors.value.length > 0)
  const dirtyErrors = computed(() => isDirty.value ? errors.value : (NO_ERRORS as string[]))
  const isDirtyAndValid = computed(() => isDirty.value && isValid.value)
  const hasDirtyErrors = computed(() => dirtyErrors.value.length > 0)

  return {
    isDirty,
    isValid,
    hasErrors,
    dirtyErrors,
    isDirtyAndValid,
    hasDirtyErrors,
  }
}
