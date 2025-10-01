import type { MaybeRefOrGetter } from 'vue'
import type { LocationQueryValue } from 'vue-router'
import { nextTick, ref, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface UseQueryParamOptions<T> {
  default: MaybeRefOrGetter<T>
  mode?: 'replace' | 'push'
  transformer?: (raw: LocationQueryValue) => T
}

export function useQueryParam<T>(
  key: string,
  options: UseQueryParamOptions<T>,
) {
  const route = useRoute()
  const router = useRouter()

  const mode = options.mode ?? 'replace'
  const transformer = options.transformer

  const def = toValue(options.default)
  const param = ref(def)

  const coerce = (raw: LocationQueryValue): T => {
    if (raw == null)
      return def
    if (transformer)
      return transformer(raw)

    switch (typeof def) {
      case 'number': {
        const n = Number(raw)
        return Number.isFinite(n) ? (n as any as T) : def
      }
      case 'boolean':
        return ((raw === 'true') as any as T)
      case 'string':
        return (raw as any as T)
      default:
        return def
    }
  }

  if (key in route.query) {
    param.value = coerce(route.query[key] as LocationQueryValue)
  }

  let updating = false

  const applyQuery = async (v: LocationQueryValue) => {
    updating = true
    try {
      const next = { ...route.query }
      const out
        = typeof v === 'string' ? (v === '' ? null : v) : v

      next[key] = out

      if (mode === 'push')
        await router.push({ query: next })
      else await router.replace({ query: next })

      await nextTick()
    }
    finally {
      updating = false
    }
  }

  watch(param, (v) => {
    applyQuery(v)
  }, { flush: 'post' })

  watch(
    () => route.query[key],
    (raw) => {
      if (updating)
        return
      param.value = coerce(raw as LocationQueryValue)
    },
  )

  return param
}
