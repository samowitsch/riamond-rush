PlayerMobile.prototype = new PlayerDesktop({})
PlayerMobile.prototype.constructor = PlayerMobile
function PlayerMobile(opt) {
    PlayerDesktop.call(this, opt)

    this.buttonUp = new Button({
        imagename: 'gfx/arrow-touch.png',
        x: this.x,
        y: this.y - 50
    })
    this.buttonRight = new Button({
        imagename: 'gfx/arrow-touch.png',
        x: this.x + 50,
        y: this.y,
        _rotation: 90
    })
    this.buttonDown = new Button({
        imagename: 'gfx/arrow-touch.png',
        x: this.x,
        y: this.y + 50,
        _rotation: 180
    })
    this.buttonLeft = new Button({
        imagename: 'gfx/arrow-touch.png',
        x: this.x - 50,
        y: this.y,
        _rotation: 270
    })
}
PlayerMobile.prototype.update = function () {
    // call super method
    PlayerDesktop.prototype.update.call(this)

    this.buttonUp.update()
    this.buttonRight.update()
    this.buttonDown.update()
    this.buttonLeft.update()

    if (this.canWalk) {
        this.buttonUp.isClicked(function () { // up
            this.currentDirection = WALK_UP
            this.atlasdata = this.frames.up

            this.idle = 0

            if (map.canIGoto(this.x, this.y, WALK_UP)) {
                map.triggerCurrent(this.x, this.y)
                this.y -= 50
                walk.play()
            }

        }.bind(this))

        this.buttonRight.isClicked(function () { //right
            this.currentDirection = WALK_RIGHT
            this.atlasdata = this.frames.right

            this.idle = 0

            if (map.canIGoto(this.x, this.y, WALK_RIGHT)) {
                map.triggerCurrent(this.x, this.y)
                this.x += 50
                walk.play()
            }

        }.bind(this))

        this.buttonDown.isClicked(function () { //down
            this.currentDirection = WALK_DOWN
            this.atlasdata = this.frames.down

            this.idle = 0

            if (map.canIGoto(this.x, this.y, WALK_DOWN)) {
                map.triggerCurrent(this.x, this.y)
                this.y += 50
                walk.play()
            }

        }.bind(this))

        this.buttonLeft.isClicked(function () { //left
            this.currentDirection = WALK_LEFT
            this.atlasdata = this.frames.left

            this.idle = 0

            if (map.canIGoto(this.x, this.y, WALK_LEFT)) {
                map.triggerCurrent(this.x, this.y)
                this.x -= 50
                walk.play()
            }

        }.bind(this))
    }


    if (map.checkForDiamond(this.x, this.y)) {
        Game.fn.removeDiamondByPosition(this.x, this.y)
    }

    this.buttonUp.x = this.x
    this.buttonUp.y = this.y - 50

    this.buttonRight.x = this.x + 50
    this.buttonRight.y = this.y

    this.buttonDown.x = this.x
    this.buttonDown.y = this.y + 50

    this.buttonLeft.x = this.x - 50
    this.buttonLeft.y = this.y


}

PlayerMobile.prototype.draw = function () {
    //call super method
    PlayerDesktop.prototype.draw.call(this)

    this.buttonUp.draw()
    this.buttonRight.draw()
    this.buttonDown.draw()
    this.buttonLeft.draw()

}
