import React from 'react'
import PropTypes from 'prop-types'
import * as Globals from './animated/Globals'
import Spring from './Spring'
import Trail from './Trail'
import { interpolateTo, shallowEqual, handleRef } from './shared/helpers'
import { config as springConfig } from './shared/constants'

const DEFAULT = '__default'

class KeyframesImpl extends React.PureComponent {
  static propTypes = {
    /** Name of the active slot */
    state: PropTypes.string,
  }
  static defaultProps = { state: DEFAULT }

  guid = 0
  state = {
    props: {},
    oldProps: {},
    resolve: () => null,
    last: true,
    index: 0,
  }

  componentDidMount() {
    this.mounted = true
    this.componentDidUpdate({})
  }

  componentWillUnmount() {
    this.mounted = false
  }

  next = (props, last = true, index = 0) => {
    this.running = true
    return new Promise(resolve => {
      this.mounted &&
        this.setState(
          state => ({
            props,
            oldProps: { ...this.state.props },
            resolve,
            last,
            index,
          }),
          () => (this.running = false)
        )
    })
  }

  componentDidUpdate(previous) {
    const { states, filter: f, state } = this.props
    if (
      previous.state !== this.props.state ||
      (this.props.reset && !this.running) ||
      !shallowEqual(states[state], previous.states[previous.state])
    ) {
      if (states && state && states[state]) {
        const localId = ++this.guid
        const slots = states[state]
        if (slots) {
          if (Array.isArray(slots)) {
            let q = Promise.resolve()
            for (let i = 0; i < slots.length; i++) {
              let index = i
              let slot = slots[index]
              let last = index === slots.length - 1
              q = q.then(
                () => localId === this.guid && this.next(f(slot), last, index)
              )
            }
          } else if (typeof slots === 'function') {
            let index = 0
            slots(
              // next
              (props, last = false) =>
                localId === this.guid && this.next(f(props), last, index++),
              // cancel
              () =>
                Globals.requestFrame(
                  () => this.instance && this.instance.stop()
                ),
              // ownprops
              this.props
            )
          } else {
            this.next(f(states[state]))
          }
        }
      }
    }
  }

  render() {
    const { props, oldProps, resolve, last, index } = this.state

    if (!props || Object.keys(props).length === 0) return null

    let {
      state,
      filter,
      states,
      config,
      primitive: Component,
      onRest,
      forwardRef,
      ...rest
    } = this.props

    // Arrayed configs need an index to process
    if (Array.isArray(config)) config = config[index]

    return (
      <Component
        ref={ref => (this.instance = handleRef(ref, forwardRef))}
        config={config}
        {...rest}
        {...props}
        onRest={args => {
          resolve(args)
          if (onRest && last) onRest(args)
        }}
      />
    )
  }
}

const Keyframes = React.forwardRef((props, ref) => (
  <KeyframesImpl {...props} forwardRef={ref} />
))

Keyframes.create = primitive => (states, filter = states => states) => {
  if (typeof states === 'function' || Array.isArray(states))
    states = { [DEFAULT]: states }
  return props => (
    <KeyframesImpl
      primitive={primitive}
      states={states}
      filter={filter}
      {...props}
    />
  )
}

Keyframes.Spring = states => Keyframes.create(Spring)(states, interpolateTo)
Keyframes.Trail = states => Keyframes.create(Trail)(states, interpolateTo)

export default Keyframes
