import type { ComputedRef, Ref } from 'vue'
import type { Rule } from './rules'
import { computed } from 'vue'
import { NO_ERRORS, validate } from './use-field'

interface Field<T> {
  value: Ref<T>
  errors: Ref<string[]>
  isDirty: Ref<boolean>
  isValid: ComputedRef<boolean>
  hasErrors: ComputedRef<boolean>
  dirtyErrors: ComputedRef<string[]>
  isDirtyAndValid: ComputedRef<boolean>
  hasDirtyErrors: ComputedRef<boolean>
  touch: () => void
  restore: (next?: T) => void
  rules?: Rule[]
}

export interface FieldsObject {
  [key: string]: Field<any>
}

type ExtractValues<T> = {
  [K in keyof T]: T[K] extends Field<infer V> ? V : never
}

export function useCompositeFields<T extends FieldsObject>(fields: T) {
  const fieldsArray = Object.values(fields)
  const isDirty = computed(() => fieldsArray.some(f => f.isDirty.value))
  const isValid = computed(() => fieldsArray.every(f => f.isValid.value))
  const hasErrors = computed(() => fieldsArray.some(f => f.hasErrors.value))
  const dirtyErrors = computed(() => fieldsArray.flatMap(f => f.dirtyErrors.value))
  const hasDirtyErrors = computed(() => fieldsArray.some(f => f.hasDirtyErrors.value))
  const isDirtyAndValid = computed(() => fieldsArray.every(f => f.isDirtyAndValid.value))

  const restore = (next?: Partial<ExtractValues<T>>) => {
    for (const name in fields) {
      const f = fields[name]
      f.errors.value = NO_ERRORS as string[]
      f.value.value = next?.[name] ?? f.value.value
      f.isDirty.value = false
    }
  }

  const validateAll = () => {
    let ok = true
    for (const name in fields) {
      const f = fields[name]
      if (!f.rules)
        continue
      f.isDirty.value = true
      const errs = validate(f.value.value, f.rules)
      f.errors.value = errs
      ok = ok && errs.length === 0
    }
    return ok
  }

  const values = () => {
    const out: Record<string, unknown> = {}
    for (const name in fields) out[name] = fields[name].value.value
    return out as ExtractValues<T>
  }

  return {
    isDirty,
    isValid,
    hasErrors,
    dirtyErrors,
    hasDirtyErrors,
    isDirtyAndValid,
    restore,
    values,
    validateAll,
  }
}
