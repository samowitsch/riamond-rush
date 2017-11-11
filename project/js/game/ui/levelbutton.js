
LevelButton.prototype = new Button({})
LevelButton.prototype.constructor = LevelButton
function LevelButton(opt) {
    Button.call(this, opt)
    this.clicked = false
    this.audio = opt.audio || false
    this.denied = opt.denied || false
    this.data = opt.data || false
}

LevelButton.prototype.update = function () {
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
                if (this.audio && !this.data.locked) {
                    this.audio.play()
                } else {
                    this.denied.play()
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
                if (this.audio && !this.data.locked) {
                    this.audio.play()
                } else {
                    this.denied.play()
                }
            }
        }
    }
}

LevelButton.prototype.draw = function () {
    Button.prototype.draw.call(this)

    Game.font.drawText({
        text: '' + (this.data.level + 1),
        xpos: this.x - 19,
        ypos: this.y + 2,
        drawCtx: bctx
    })
}

