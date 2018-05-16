import React from 'react'
import ReactDOM from 'react-dom'
import AnimatedValue from '../../AnimatedValue'

const getValues = object => Object.keys(object).map(k => object[k])
const check = value => value === 'auto'
const convert = (acc, [name, value]) => ({
  ...acc,
  [name]: new AnimatedValue(value),
})
const overwrite = (width, height) => (acc, [name, value]) => ({
  ...acc,
  [name]: value === 'auto' ? (~name.indexOf('height') ? height : width) : value,
})

export default function fixAuto(spring, props) {
  const { native, children, render, from, to } = props

  // Dry-route props back if nothing's using 'auto' in there
  if (![...getValues(from), ...getValues(to)].some(check)) return
  // Fetch render v-dom
  const element = spring.renderChildren(props, spring.convertValues(props))
  const elementStyles = element.props.style

  // Return v.dom with injected ref
  return (
    <element.type
      {...element.props}
      style={{ ...elementStyles, position: 'absolute', visibility: 'hidden' }}
      ref={ref => {
        if (ref) {
          // Once it's rendered out, fetch bounds (minus padding/margin/borders)
          let node = ReactDOM.findDOMNode(ref)
          let width, height
          let cs = getComputedStyle(node)
          if (cs.boxSizing === 'border-box') {
            width = node.clientWidth
            height = node.clientHeight
          } else {
            const paddingX =
              parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
            const paddingY =
              parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
            const borderX =
              parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)
            const borderY =
              parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth)
            width = node.offsetWidth - paddingX - borderX
            height = node.offsetHeight - paddingY - borderY
          }
          // Defer to next frame, or else the springs updateToken is canceled
          const convert = overwrite(width, height)
          requestAnimationFrame(() =>
            spring.updateProps(
              {
                ...props,
                from: Object.entries(from).reduce(convert, from),
                to: Object.entries(to).reduce(convert, to),
              },
              true,
              true
            )
          )
        }
      }}
    />
  )
}
