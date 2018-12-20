import React, { useState } from 'react'
import { useTransition, animated } from 'react-spring/hooks'
import shuffle from 'lodash/shuffle'
import data from './data'
import './styles.css'

export default function App() {
  const [rows, set] = useState(data)

  let height = 0
  const transitions = useTransition({
    items: rows.map(data => ({
      ...data,
      y: (height += data.height) - data.height,
    })),
    keys: d => d.name,
    from: { height: 0, opacity: 0 },
    leave: { height: 0, opacity: 0 },
    enter: ({ y, height }) => ({ y, height, opacity: 1 }),
    update: ({ y, height }) => ({ y, height }),
    config: { mass: 5, tension: 500, friction: 150 },
  })

  return (
    <div className="list-reorder-scroll" onClick={() => set(shuffle)}>
      <div className="list-reorder" style={{ height: height + 15 }}>
        {transitions.map(({ item, props: { y, ...rest }, key }, index) => (
          <animated.div
            key={key}
            className="list-reorder-card"
            style={{
              transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
              ...rest,
            }}>
            <div className="list-reorder-cell">
              <div
                className="list-reorder-details"
                style={{ backgroundImage: item.css }}>
                <h1>{item.name}</h1>
              </div>
            </div>
          </animated.div>
        ))}
      </div>
    </div>
  )
}
