Floor.prototype = new Sprite({})
Floor.prototype.constructor = Floor
function Floor(opt) {
    Sprite.call(this, opt)
}
