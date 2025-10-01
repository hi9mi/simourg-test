export type Rule = (value: unknown) => string | null

export function required(msg = 'Обязательное поле'): Rule {
  return v => String(v ?? '').trim() ? null : msg
}

export function email(msg = 'Некорректный email'): Rule {
  return (v) => {
    const s = String(v ?? '').trim()
    return s && /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(s) ? null : msg
  }
}
