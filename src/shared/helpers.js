import { useRef, useLayoutEffect } from 'react'
import AnimatedValue from '../animated/AnimatedValue'
import AnimatedArray from '../animated/AnimatedArray'

export const is = {
  arr: Array.isArray,
  obj: a => Object.prototype.toString.call(a) === '[object Object]',
  fun: a => typeof a === 'function',
  str: a => typeof a === 'string',
  num: a => typeof a === 'number',
  und: a => a === void 0,
  nul: a => a === null,
  set: a => a instanceof Set,
  map: a => a instanceof Map,
  equ(a, b) {
    if (typeof a !== typeof b) return false
    if (is.str(a) || is.num(a)) return a === b
    if (
      is.obj(a) &&
      is.obj(b) &&
      Object.keys(a).length + Object.keys(b).length === 0
    )
      return true
    let i
    for (i in a) if (!(i in b)) return false
    for (i in b) if (a[i] !== b[i]) return false
    return is.und(i) ? a === b : true
  },
}

export function usePrevious(value, initialValue = null) {
  const ref = useRef(initialValue)
  useLayoutEffect(() => void (ref.current = value), [value])
  return ref
}

export function debounce(func, delay = 0) {
  let timeoutId
  return function() {
    const context = this
    const args = arguments
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(context, args), delay)
  }
}
export function withDefault(value, defaultValue) {
  return is.und(value) || is.nul(value) ? defaultValue : value
}

export function toArray(a) {
  return !is.und(a) ? (is.arr(a) ? a : [a]) : []
}

export function callProp(obj, ...args) {
  return is.fun(obj) ? obj(...args) : obj
}

export function getValues(object) {
  return Object.keys(object).map(k => object[k])
}

export function getForwardProps(props) {
  const {
    to,
    from,
    config,
    onStart,
    onRest,
    onFrame,
    children,
    reset,
    reverse,
    force,
    immediate,
    delay,
    attach,
    destroyed,
    interpolateTo,
    ref,
    lazy,
    ...forward
  } = props
  return forward
}

export function interpolateTo(props) {
  const forward = getForwardProps(props)
  const rest = Object.keys(props).reduce(
    (a, k) => (!is.und(forward[k]) ? a : { ...a, [k]: props[k] }),
    {}
  )
  return { to: forward, ...rest }
}

export function convertToAnimatedValue(acc, [name, value]) {
  return {
    ...acc,
    [name]: new (is.arr(value) ? AnimatedArray : AnimatedValue)(value),
  }
}

export function convertValues(props) {
  const { from, to, native } = props
  const allProps = Object.entries({ ...from, ...to })
  return native
    ? allProps.reduce(convertToAnimatedValue, {})
    : { ...from, ...to }
}

export function handleRef(ref, forward) {
  if (forward) {
    // If it's a function, assume it's a ref callback
    if (is.fun(forward)) forward(ref)
    else if (is.obj(forward)) {
      // If it's an object and has a 'current' property, assume it's a ref object
      forward.current = ref
    }
  }
  return ref
}
