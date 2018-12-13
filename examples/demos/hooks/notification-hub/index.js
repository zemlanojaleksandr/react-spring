import React, { useRef, useState, useEffect } from 'react'
import lorem from 'lorem-ipsum'
import { X } from 'react-feather'
import { useTransition } from 'react-spring/hooks'
import { Main, Container, Message, Button, Content, Life } from './styles.js'

let id = 0

function MessageHub({
  config = { tension: 125, friction: 20, precision: 0.1 },
  timeout = 3000,
  children,
}) {
  const [refMap] = useState(() => new WeakMap())
  const [cancelMap] = useState(() => new WeakMap())
  const [items, setItems] = useState([])
  const transitions = useTransition({
    items,
    keys: item => item.key,
    from: { opacity: 0, height: 0, life: '100%' },
    enter: item => next =>
      requestAnimationFrame(async () =>
        next({ opacity: 1, height: refMap.get(item).offsetHeight }, true)
      ),
    leave: item => async (next, cancel) => {
      cancelMap.set(item, cancel)
      await next({ life: '0%' })
      await next({ opacity: 0 })
      await next({ height: 0 }, true)
    },
    onRest: item => setItems(state => state.filter(i => i.key !== item.key)),
    config: (item, state) =>
      state === 'leave' ? [{ duration: timeout }, config, config] : config,
  })

  useEffect(
    () =>
      void children(msg => setItems(state => [...state, { key: id++, msg }])),
    []
  )

  return (
    <Container>
      {transitions.map(({ key, item, props: { life, ...style } }) => (
        <Message key={key} style={style}>
          <Content ref={ref => ref && refMap.set(item, ref)}>
            <Life style={{ right: life }} />
            <p>{item.msg}</p>
            <Button
              onClick={e => {
                e.stopPropagation()
                cancelMap.has(item) && cancelMap.get(item)()
              }}>
              <X size={18} />
            </Button>
          </Content>
        </Message>
      ))}
    </Container>
  )
}

export default function App() {
  const ref = useRef(null)
  return (
    <Main onClick={() => ref.current(lorem())}>
      Click here<br/>to create notifications
      <MessageHub children={add => (ref.current = add)} />
    </Main>
  )
}
