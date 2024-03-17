Cycle.prototype = new Sprite({})
Cycle.prototype.constructor = Cycle
function Cycle(opt) {
    Sprite.call(this, opt)

}

Cycle.prototype.trigger = function () {
    this._rotation += 90;
    rotate.play();
    if (this._rotation >= 360) {
        this._rotation = 0
    }
}
