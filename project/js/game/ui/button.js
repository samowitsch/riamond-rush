Button.prototype = new Sprite({})
Button.prototype.constructor = Button
function Button(opt) {
    Sprite.call(this, opt)
    this.clicked = false
    this.audio = opt.audio || false
    this.data = opt.data || false
}

Button.prototype.update = function () {
    Sprite.prototype.update.call(this)
    if (Game.click) {
        if (this.atlasdata.rotated) {
            if (Game.click.x > (this.x - this.height2) &&
                Game.click.x < (this.x + this.height2) &&
                Game.click.y > (this.y - this.width2) &&
                Game.click.y < (this.y + this.width2)) {
                // remove click position object from game
                Game.click = false
                this.clicked = true
                if (this.audio) {
                    this.audio.play()
                }
            }
        } else {
            if (Game.click.x > (this.x - this.width2) &&
                Game.click.x < (this.x + this.width2) &&
                Game.click.y > (this.y - this.height2) &&
                Game.click.y < (this.y + this.height2)) {
                // remove click position object from game
                Game.click = false
                this.clicked = true
                if (this.audio) {
                    this.audio.play()
                }
            }
        }
    }
}

Button.prototype.isClicked = function (callback) {
    if (this.clicked) {
        this.clicked = false
        if (callback) {
            callback()
        }
        return true
    }
    return false
}
