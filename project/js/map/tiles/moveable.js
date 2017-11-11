Moveable.prototype = new Sprite({})
Moveable.prototype.constructor = Moveable
function Moveable(opt) {
    Sprite.call(this, opt)

}
