Points.prototype = new Sprite({})
Points.prototype.constructor = Points
function Points(opt) {
	Sprite.call(this, opt)

	this.points = opt.points || 0
}
