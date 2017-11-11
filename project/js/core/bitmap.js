
function Bitmap (opt) {
    opt = opt || {}

    this.x = opt.x || can.width / 2
    this.y = opt.y || can.height / 2

    this.width = opt.width || can.width
    this.height = opt.height || can.height

    this.canvas = document.createElement('canvas')
    this.canvas.height = this.height
    this.canvas.width = this.width

    this.ctx = this.canvas.getContext('2d', {antialias: true})

}


Bitmap.prototype.update = function () {

}


Bitmap.prototype.draw = function () {
    bctx.save()
    bctx.translate(this.x, this.y)
    bctx.drawImage(this.canvas, (this.canvas.width / 2) * -1, (this.canvas.height / 2) * -1)
    bctx.restore()
}


