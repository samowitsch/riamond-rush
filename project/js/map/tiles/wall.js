Wall.prototype = new Sprite({})
Wall.prototype.constructor = Wall
function Wall(opt) {
    Sprite.call(this, opt)

}
