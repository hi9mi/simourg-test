export function debounce<F extends (...args: any[]) => void>(fn: F, ms = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, ms)
  }
}
