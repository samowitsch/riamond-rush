PlayerDesktop.prototype = new Sprite({})
PlayerDesktop.prototype.constructor = PlayerDesktop
function PlayerDesktop(opt) {
    Sprite.call(this, opt)

    this.canWalk = true

    this.digging = opt.digging || 0;

    this.currentDirection = WALK_DOWN

    this.frames = opt.frames || false

    this.idle = 0

    // TODO rewrite to use atlas?
    this.shovel = new Image()
    this.shovel.src = 'gfx/player-shovel.png'

    // TODO rewrite to use atlas?
    this.torch = new Image()
    this.torch.src = 'gfx/torch.png'

    document.onkeydown = function (evt) {
        this.idle = 0
        if (this.canWalk) {
            var keyCode = evt.keyCode
            if (keyCode == KEY_LEFT) { //left
                this.currentDirection = WALK_LEFT
                this.atlasdata = this.frames.left

                if (map.canIGoto(this.x, this.y, WALK_LEFT)) {
                    map.triggerCurrent(this.x, this.y)
                    this.x -= 50
                    walk.play()
                }

            }
            if (keyCode == KEY_UP) { //up
                this.currentDirection = WALK_UP
                this.atlasdata = this.frames.up

                if (map.canIGoto(this.x, this.y, WALK_UP)) {
                    map.triggerCurrent(this.x, this.y)
                    this.y -= 50
                    walk.play()
                }

            }
            if (keyCode == KEY_RIGHT) { //right
                this.currentDirection = WALK_RIGHT
                this.atlasdata = this.frames.right

                if (map.canIGoto(this.x, this.y, WALK_RIGHT)) {
                    map.triggerCurrent(this.x, this.y)
                    this.x += 50
                    walk.play()
                }

            }
            if (keyCode == KEY_DOWN) { //down
                this.currentDirection = WALK_DOWN
                this.atlasdata = this.frames.down

                if (map.canIGoto(this.x, this.y, WALK_DOWN)) {
                    map.triggerCurrent(this.x, this.y)
                    this.y += 50
                    walk.play()
                }

            }

            if (map.checkForDiamond(this.x, this.y)) {
                Game.fn.removeDiamondByPosition(this.x, this.y)
                diamondCounter.incrementDiamondFound(this.x, this.y)
            }
        }

        if (keyCode == KEY_R) {
            Game.callbacks.restart()
        }

        if (keyCode == KEY_ESC) {
            sfxback.pause()
            sfxback.src = 'sfx/sound-title.ogg'
            sfxback.play()
            Game.init.startscreen()
        }

        if ((keyCode == KEY_D || keyCode == KEY_SPACE) && this.digging != 0) {

            if (map.digTo(this.x, this.y, this.currentDirection)) {
                digg.play()
                if (this.digging > 0) {
                    this.digging -= 1
                    if (this.digging === 0) {
                        btnIngameDigg.visible = false
                    }
                }
            }

        }


    }.bind(this)
}


PlayerDesktop.prototype.update = function () {
    Sprite.prototype.update.call(this)
    this.idle += 1
    if (this.idle > 1400) {
        this.idle = 0
        playerVoice.play()
    }
}

PlayerDesktop.prototype.draw = function () {
    //call super method
    Sprite.prototype.draw.call(this)
    bctx.save()

    if (this.nightmode) {
        bctx.drawImage(this.torch, this.x - 25, this.y - 25)
        emitterPlayer.position.set({ x: this.x - 15, y: this.y - 15 })
    }

    if (this.digging > 0) {
        bctx.drawImage(this.shovel, this.x + 15, this.y - 25)
        bctx.fillStyle = '#ffff00'
        bctx.fillText(this.digging, this.x + 18, this.y - 6)
    }
    if (this.digging == -1) {
        bctx.drawImage(this.shovel, this.x + 15, this.y - 25)
        bctx.fillStyle = '#ffff00'
    }

    bctx.restore()
}


/*
 evtl. mit Tween gehen

 var tween = new TWEEN.Tween({ x: player.x, y: player.y })
 .to({ x: player.x - 50 }, 80)
 .easing(TWEEN.Easing.Cubic.InOut)
 .onUpdate(function () {

 player.x = this.x

 })
 .onComplete(function () {

 })
 .start();


 */
