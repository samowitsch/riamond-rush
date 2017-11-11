
GameCallbacks.prototype.levelFinished = function () {
    player.canWalk = false
    success.play()
    levelCounter += 1

    Game.fn.raiseLevelNumberInLocalStorage()

    // check if all levels are played
    if (levelCounter >= Levels.length) {
        levelCounter = 0
        sfxback.pause()
        sfxback.src = 'sfx/sound-title.ogg'
        sfxback.play()
        Game.init.finalscreen()
        return
    }

    points = 0
    counter = currentlevel.timelimit
    currentlevel = JSON.parse(JSON.stringify(Levels[levelCounter]))            // 'copy' instead of call by reference


    welldone.visible = true

    var tween = new TWEEN.Tween({x: welldone.x, y: welldone.y})
        .to({x: 400}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            welldone.x = this.x
        })
        .onComplete(function () {

            setTimeout(function () {
                var tween = new TWEEN.Tween({x: welldone.x, y: welldone.y})
                    .to({x: 1000}, 1000)
                    .easing(TWEEN.Easing.Elastic.InOut)
                    .onUpdate(function () {

                        welldone.x = this.x
                        welldone.y = this.y

                    })
                    .onComplete(function () {
                        welldone.x = -100
                        welldone.visible = false
                        Game.create.gamescreenObjects()
                    })
                    .start();
            }, 500)
        })
        .start();
}
