# Spring configs

```jsx
import { config } from 'react-spring'
```

```jsx
/*
    default: { tension: 170, friction: 26 },
    gentle: { tension: 120, friction: 14 },
    wobbly: { tension: 180, friction: 12 },
    stiff: { tension: 210, friction: 20 },
*/
```

# Spring

```jsx
import { Spring } from 'react-spring'
```

```jsx
class Spring extends React.PureComponent {
    static propTypes = {
        // Spring config ({ tension, friction })
        config: PropTypes.object,
        // Will skip rendering the component if true and write to the dom directly
        native: PropTypes.bool,
        // Base styles, optional
        from: PropTypes.object,
        // Animates to ...
        to: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        // Callback when the animation comes to a still-stand
        onRest: PropTypes.func,
        // Takes a function that receives interpolated styles
        children: PropTypes.func,
        // Same as children, but takes precedence if present
        render: PropTypes.func,
        // Prevents animation if true, you can also pass individual keys
        immediate: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
    }
    static defaultProps = { from: {}, to: {}, config: config.default, native: false, immediate: false }
}
```

# Transition

```jsx
import { Transition } from 'react-spring'
```

```jsx
class Transition extends React.PureComponent {
    static propTypes = {
        native: PropTypes.bool,
        config: PropTypes.object,
        // Base styles
        from: PropTypes.object,
        // Animated styles when the component is mounted
        enter: PropTypes.object,
        // Unmpount styles
        leave: PropTypes.object,
        // A collectiomn of unique keys that must match with the childrens order
        keys: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
            PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        ]),
        children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.func), PropTypes.func]),
        render: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.func), PropTypes.func]),
    }

    static defaultProps = { from: {}, enter: {}, leave: {}, native: false, config: config.default }
}
```

# Trail

```jsx
import { Trail } from 'react-spring'
```

```jsx
class Trail extends React.PureComponent {
    static propTypes = {
        native: PropTypes.bool,
        config: PropTypes.object,
        from: PropTypes.object,
        to: PropTypes.object,
        keys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
        children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.func), PropTypes.func]),
        render: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.func), PropTypes.func]),
    }
    static defaultProps = { from: {}, to: {}, native: false, config: config.default }
}
```

# Parallax

```jsx
import { Parallax } from 'react-spring'
```

```jsx
class Parallax extends React.PureComponent {
    static propTypes = {
        pages: PropTypes.number.isRequired,
        config: PropTypes.object,
        scrolling: PropTypes.bool,
        horizontal: PropTypes.bool,
    }
    static defaultProps = {
        config: config.slow,
        scrolling: true,
        horizontal: false,
    }

    static Layer = class extends React.PureComponent {
        static propTypes = {
            factor: PropTypes.number,
            offset: PropTypes.number,
            speed: PropTypes.number,
        }
        static defaultProps = {
            factor: 1,
            offset: 0,
            speed: 0,
        }
    }
}
```
