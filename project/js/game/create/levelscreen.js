
GameCreate.prototype.levelscreenObjects = function () {
    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: can.height / 2 + 100,
        rotation: -0.02
    })
    Game.entities.push(riamond)

    // TODO create Buttons depending on emh select
    var colCounter = 0,
        rowCounter = 0,
        levelsPerScreen = 20,
        colX = 145,
        rowY = 50,
        colOffset = 130,
        rowOffset = 100,
        currLevel = parseInt(localStorage.getItem('playedLevels'))

    for (var i = 0 + ( emhSelectOffset * levelsPerScreen ), l = levelsPerScreen + ( emhSelectOffset * levelsPerScreen ); i < l; i++) {

        if (i > currLevel) {
            var btnType = 'btn-level-select-locked',
                level = i,
                locked = true
        } else {
            var btnType = 'btn-level-select',
                level = i,
                locked = false
        }

        level = new LevelButton({
            atlasimage: atlasUI.image,
            atlasdata: atlasUI.getPicByName(btnType),
            x: colX + (colOffset * colCounter),
            y: rowY + (rowOffset * rowCounter),
            audio: btnSound,
            denied: btnTick,
            data: {
                locked: locked,
                level: level
            }
        })

        Game.entities.push(level)
        colCounter += 1
        if (colCounter > 4) {
            colCounter = 0
            rowCounter += 1
        }

    }

    btnBackToStartScreen = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-back'),
        x: -200,
        y: can.height - 125,
        audio: btnSound
    })
    Game.entities.push(btnBackToStartScreen)

    Game.tweens.levelScreenIn()

}

