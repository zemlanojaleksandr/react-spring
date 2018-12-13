import React from 'react'
import { Transition, animated } from 'react-spring'
import lorem from 'lorem-ipsum'
import emoji from 'random-unicode-emoji'
import classnames from 'classnames'
import './styles.css'

function addItem(state) {
  const items = [...state.items]
  const previous = state.items[state.items.length - 1]
  const left = Math.round(Math.random()) === 1
  const first = previous === undefined || previous.left !== left
  const text =
    lorem() +
    (Math.round(Math.random()) ? '' : ` ${emoji.random({ count: 1 })}`)
  if (previous !== undefined) previous.last = first
  items.push({ key: state.items.length, text, left, first, last: true })
  return { items }
}

let count = 0
export default class App extends React.PureComponent {
  state = { items: [] }

  list = React.createRef()
  el = React.createRef()

  addItems = () =>
    setTimeout(
      () => void (this.setState(addItem), count++ < 10 && this.addItems()),
      this.state.items.length ? Math.random() * 1000 : 0
    )

  componentDidMount() {
    this.addItems()
  }

  render() {
    return (
      <div className="chat-container">
        <ul className="ul-c" ref={this.list}>
          <Transition
            native
            items={this.state.items}
            keys={item => item.key}
            from={{ opacity: 0, transform: 'translate3d(0,60px,0)' }}
            enter={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            config={{ tension: 50, friction: 25 }}>
            {({ text, left, first, last }, i, state) => styles => (
              <animated.li
                ref={state === 'enter' && this.el}
                className={classnames({ left, right: !left, first, last })}
                style={styles}>
                {text}
              </animated.li>
            )}
          </Transition>
        </ul>
      </div>
    )
  }

  componentDidUpdate() {
    if (this.el.current)
      this.el.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      })
  }
}
