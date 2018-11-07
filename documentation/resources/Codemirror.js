import React from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'

export default ({ value }) => (
  <CodeMirror
    value={value}
    options={{
      mode: 'jsx',
      theme: 'dracula',
      lineNumbers: true,
      readOnly: true,
      showCursorWhenSelecting: false,
      cursorHeight: 0,
    }}
  />
)
