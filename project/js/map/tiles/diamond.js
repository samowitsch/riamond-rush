Diamond.prototype = new Points({})
Diamond.prototype.constructor = Diamond
function Diamond(opt) {
    Points.call(this, opt)

    this.points = opt.points || 0
}
