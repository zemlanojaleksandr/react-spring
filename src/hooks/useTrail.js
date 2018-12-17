import React from 'react'
import Controller from '../animated/Controller'
import * as Globals from '../animated/Globals'

const map = new Map([])
export function useTrail (count, params) {
  const isFunctionProps = typeof params === 'function'
  const {
    delay,
    reverse,
    onKeyframesHalt = () => null,
    onRest,
    ...props
  } = isFunctionProps ? params() : params
  const instances = React.useRef(map)
  const mounted = React.useRef(false)
  const endResolver = React.useRef()
  const [, forceUpdate] = React.useState()

  const onHalt = onRest
    ? ctrl => ({ finished }) => {
      finished && endResolver.current && endResolver.current()
      finished && mounted.current && onRest(ctrl.merged)
    }
    : onKeyframesHalt

  if (count > instances.current.size) {
    for (let i = instances.current.size; i < count; i++) {
      instances.current.set(
        i,
        new Controller({
          ...props,
          attach: i === 0 ? undefined : () => instances.current.get(i - 1)
        })
      )
    }
  }

  const update = React.useCallback(
    /** resolve and last are passed to the update function from the keyframes controller */
    props => {
      for (let [idx, ctrl] of instances.current.entries()) {
        ctrl.update(props)
        if (!props.ref) {
          ctrl.start(instances.current.size - 1 === idx && onHalt(ctrl))
        }
      }
      Globals.requestFrame(() => props.reset && forceUpdate())
    },
    [onRest]
  )

  React.useImperativeMethods(props.ref, () => ({
    start: resolve => {
      endResolver.current = resolve
      for (let [idx, ctrl] of instances.current.entries()) {
        ctrl.start(instances.current.size - 1 === idx && onHalt(ctrl))
      }
    },
    tag: 'TrailHook'
  }))

  /** must hoooks always return something? */
  React.useEffect(() => {
    mounted.current = true
    return () => void (mounted.current = false)
  }, [])

  React.useLayoutEffect(() => void (!isFunctionProps && update(props)))

  const propValues = Array.from(instances.current.values()).reduce(
    (acc, ctrl) => {
      reverse ? acc.unshift(ctrl.getValues()) : acc.push(ctrl.getValues())
      return acc
    },
    []
  )

  return isFunctionProps
    ? [
      propValues,
      props => update(props),
      (finished = false) => {
        for (let [, ctrl] of instances.current.entries()) {
          ctrl.stop(finished)
        }
      }
    ]
    : propValues
}
