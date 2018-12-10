import React, { useState, useEffect } from 'react'
import { useTransition, animated } from 'react-spring/hooks'
import './styles.css'

export default function MultiStageTransition() {
  const [items, set] = useState([])
  const transitions = useTransition({
    items,
    from: { opacity: 0, height: 0, transform: 'scale(1)', background: 'black' },
    enter: [
      { opacity: 1, height: 100 },
      { transform: 'scale(1.2)', background: '#28d79f' },
      { transform: 'scale(1)' },
    ],
    leave: [{ background: '#c23369' }, { opacity: 0 }, { height: 0 }],
    update: { background: '#28b4d7' },
  })

  useEffect(() => {
    set(['🍎 Apples', '🍊 Oranges', '🥝 Kiwis'])
    setTimeout(() => set(['🍎 Apples', '🥝 Kiwis']), 3000)
    setTimeout(() => set(['🍎 Apples', '🍌 Bananas', '🥝 Kiwis']), 6000)
  }, [])

  return transitions.map(({ item, props, key }) => (
    <animated.div
      className="transitions-item"
      key={key}
      style={props}
      onClick={() => {
        set([])
        setTimeout(() => set(['🍎 Apples', '🍊 Oranges', '🥝 Kiwis']), 1000)
        setTimeout(() => set(['🍎 Apples', '🥝 Kiwis']), 3000)
        setTimeout(() => set(['🍎 Apples', '🍌 Bananas', '🥝 Kiwis']), 6000)
      }}>
      {item}
    </animated.div>
  ))
}
