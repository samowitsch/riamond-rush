Door.prototype = new Sprite({})
Door.prototype.constructor = Door
function Door(opt) {
    Sprite.call(this, opt)

    // TODO rewrite to use atlas?
    this.lockname = opt.lockname || ''
    this.lockimage = new Image()
    this.lockimage.src = this.lockname

    this.unlocked = false
}

Door.prototype.draw = function () {
    Sprite.prototype.draw.call(this)

    bctx.save()
    bctx.globalAlpha = this.alpha
    bctx.translate(this.x, this.y)
//	bctx.drawImage(this.image, (this.image.width / 2) *-1, (this.image.height / 2) *-1)
    if (!this.unlocked) {
        bctx.drawImage(this.lockimage, (this.lockimage.width / 2) * -1, (this.lockimage.height / 2) * -1)
    }
    bctx.restore()
}
