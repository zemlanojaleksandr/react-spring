import Animated from './Animated'
import AnimatedValue from './AnimatedValue'

class AnimatedTracking extends Animated {
    constructor(value, parent, animationClass, animationConfig, callback) {
        super()
        this._value = value
        this._parent = parent
        this._animationClass = animationClass
        this._animationConfig = animationConfig
        this._callback = callback
        this.__attach()
    }

    __getValue() {
        return this._parent.__getValue()
    }

    __attach() {
        this._parent.__addChild(this)
    }

    __detach() {
        this._parent.__removeChild(this)
    }

    update() {
        this._value.animate(
            new this._animationClass({
                ...this._animationConfig,
                toValue: this._animationConfig.toValue.__getValue(),
            }),
            this._callback,
        )
    }
}

export default AnimatedTracking
