
GameFunctions.prototype.loop = function () {
    // clear canvases
    ctx.clearRect(0, 0, can.width, can.height)
    bctx.clearRect(0, 0, bcan.width, bcan.height)

    if (Game.entities.length) {


        // update / draw entities
        try {
            for (var i = 0, l = Game.entities.length; i < l; i++) {
                Game.entities[i].update()
                Game.entities[i].draw()
            }
        } catch (e) {
            console.log(e)
        }


        ctx.drawImage(bcan, 0, 0)
        if (GAMESTATE_CURRENT === GAMESTATE_STARTSCREEN) {

            btnPlay.isClicked(function () {

                Game.tweens.startScreenOutGame()

            })

            btnAbout.isClicked(function () {

                Game.tweens.startScreenOutAbout()

            })

            btnFB.isClicked(function () {

                if (Game.isCocoonJS) {
                    CocoonJS.App.openURL(Game.links.Facebook);
                } else {
                    window.open(Game.links.Facebook, '_blank');
                }

            })

            btnTW.isClicked(function () {

                if (Game.isCocoonJS) {
                    CocoonJS.App.openURL(Game.links.Twitter);
                } else {
                    window.open(Game.links.Twitter, '_blank');
                }

            })


        }
        else if (GAMESTATE_CURRENT === GAMESTATE_EMHSCREEN) {

            btnEasy.isClicked(function () {
                emhSelectOffset = 0
                Game.tweens.emhScreenOut()
            })

            btnMedium.isClicked(function () {
                emhSelectOffset = 1
                Game.tweens.emhScreenOut()
            })

            btnHard.isClicked(function () {
                emhSelectOffset = 2
                Game.tweens.emhScreenOut()
            })

            btnBackToStartScreen.isClicked(function () {
                Game.tweens.emhScreenBack()
            })
        }
        else if (GAMESTATE_CURRENT === GAMESTATE_LEVELSCREEN) {

            btnBackToStartScreen.isClicked(function () {
                Game.tweens.levelScreenBack()
            })

            // check all buttons, set depending currentlevel and then jump to gamescreen

            for (var i = 0, l = Game.entities.length; i < l; i++) {
                var btn = Game.entities[i]
                if (btn instanceof Button) {
                    if (btn.isClicked() && btn.data) {
                        if (btn.data.locked === false) {
                            levelCounter = btn.data.level
                            Game.init.gamescreen()
                        }
                    }
                }
            }

        }
        else if (GAMESTATE_CURRENT === GAMESTATE_ABOUTSCREEN) {

            btnBackToStartScreen.isClicked(function () {
                Game.tweens.aboutScreenBack()
            })
        }
        else if (GAMESTATE_CURRENT === GAMESTATE_FINALSCREEN) {

            btnBackToStartScreen.isClicked(function () {
                Game.tweens.finalScreenBack()
            })
        }
        else if (GAMESTATE_CURRENT === GAMESTATE_GAMESCREEN) {

            btnIngameRestart.isClicked(function () {
                Game.callbacks.restart()
            })

            btnIngameMenu.isClicked(function () {
                sfxback.pause()
                sfxback.src = 'sfx/sound-title.ogg'
                sfxback.play()
                Game.init.startscreen()
            })

            if (btnIngameDigg) {
                btnIngameDigg.isClicked(function () {

                    if (map.digTo(player.x, player.y, player.currentDirection)) {
                        digg.play()
                        if (player.digging > 0) {
                            player.digging -= 1
                            if (player.digging === 0) {
                                btnIngameDigg.visible = false
                            }
                        }
                    }
                })
            }

            if (points === currentlevel.pointsToFinish && door.unlocked === false) {
                door.unlocked = true
                opendoor.play()
            }
        }
        TWEEN.update();
    }
    requestAnimationFrame(Game.fn.loop)
}
