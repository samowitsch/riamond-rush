GameCreate.prototype.gamescreenObjects = function () {
    triesCounter++; // raise tries counter
    sfxback.pause()
    if (levelCounter % 2) {
        sfxback.src = "sfx/sound-ingame-2.ogg"
    } else {
        sfxback.src = "sfx/sound-ingame-1.ogg"
    }
    sfxback.play()

    Game.entities = []

    atlasGame = new Atlas('gfx/theme-' + currentlevel.theme + '/', 'theme.json')

    Game.levelname = {
        name: currentlevel.name,
        width: Game.font.getTextWidth(currentlevel.name)
    }

    if (Game.mobile) {
        player = new PlayerMobile({
            atlasimage: atlasGame.image,
            atlasdata: atlasGame.getPicByName('player-down'),
            frames: {
                up: atlasGame.getPicByName('player-up'),
                left: atlasGame.getPicByName('player-left'),
                down: atlasGame.getPicByName('player-down'),
                right: atlasGame.getPicByName('player-right')
            },
            x: currentlevel.startpoint.x,
            y: currentlevel.startpoint.y,
            nightmode: currentlevel.nightmode,
            digging: currentlevel.digging
        })
    } else {
        player = new PlayerDesktop({
            atlasimage: atlasGame.image,
            atlasdata: atlasGame.getPicByName('player-down'),
            frames: {
                up: atlasGame.getPicByName('player-up'),
                left: atlasGame.getPicByName('player-left'),
                down: atlasGame.getPicByName('player-down'),
                right: atlasGame.getPicByName('player-right')
            },
            x: currentlevel.startpoint.x,
            y: currentlevel.startpoint.y,
            nightmode: currentlevel.nightmode,
            digging: currentlevel.digging
        })
    }

    map = new LevelMap(currentlevel)

    Game.entities.push(player)

    if (currentlevel.nightmode) {
        Game.entities.push(emitterPlayer)
    }


    btnIngameMenu = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-ingame-menu'),
        x: -25,
        y: -25,
        audio: btnSound
    })

    Game.entities.push(btnIngameMenu)

    new TWEEN.Tween({x: btnIngameMenu.x, y: btnIngameMenu.y})
        .to({x: 25, y: 25}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnIngameMenu.x = this.x
            btnIngameMenu.y = this.y
        })
        .start();

    btnIngameRestart = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-ingame-restart'),
        x: can.width + 25,
        y: -25,
        audio: btnSound
    })
    Game.entities.push(btnIngameRestart)

    new TWEEN.Tween({x: btnIngameRestart.x, y: btnIngameRestart.y})
        .to({x: can.width - 25, y: 25}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnIngameRestart.x = this.x
            btnIngameRestart.y = this.y
        })
        .start();

    tries = new Bitmap({
        x: 775 + 50,
        y: 35 + 50,
        width: 50,
        height: 50
    })

    // draw text to bitmap context
    Game.font.drawText({
        text: '' + triesCounter,
        xpos: 0,
        ypos: Game.font.getLineHeight(),
        drawCtx: tries.ctx
    })

    Game.entities.push(tries);

    new TWEEN.Tween({x: tries.x, y: tries.y})
    .to({x: 775, y: 35}, 1500)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function () {
        tries.x = this.x
        tries.y = this.y
    })
    .start();



    if (currentlevel.digging > 0) {
        btnIngameDigg = new Button({
            atlasimage: atlasUI.image,
            atlasdata: atlasUI.getPicByName('btn-ingame-digg'),
            x: can.width + 25,
            y: can.height + 25,
            audio: btnSound
        })
        Game.entities.push(btnIngameDigg)

        new TWEEN.Tween({x: btnIngameDigg.x, y: btnIngameDigg.y})
            .to({x: can.width - 25, y: can.height - 25}, 1000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function () {
                btnIngameDigg.x = this.x
                btnIngameDigg.y = this.y
            })
            .start();

    }

    welldone = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('well-done'),
        x: -100,
        y: 300,
        audio: btnSound
    })
    welldone.visible = false
    Game.entities.push(welldone)


    // render level title once to Bitmap
    var lTitle = '' + (levelCounter + 1) + '. ' + currentlevel.name,
        tWidth = Game.font.getTextWidth(lTitle) + 2,
        tHeight = Game.font.getLineHeight() + 24

    // new bitmap
    title = new Bitmap({
        x: can.width / 2,
        y: -200,
        width: tWidth,
        height: tHeight
    })

    // draw text to bitmap context
    Game.font.drawText({
        text: lTitle,
        xpos: 0,
        ypos: Game.font.getLineHeight(),
        drawCtx: title.ctx
    })

    Game.entities.push(title)

    var tween = new TWEEN.Tween({x: title.x, y: title.y})
        .to({y: 250}, 1000)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(function () {
            title.y = this.y
        })
        .onComplete(function () {

            setTimeout(function () {
                var tween = new TWEEN.Tween({x: title.x, y: title.y})
                    .to({y: 0}, 2000)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onUpdate(function () {
                        title.y = this.y
                    })
                    .start();
            }, 1000)

        })
        .start();

    diamondCounter = new DiamondCounter({
        diamondsNeeded: currentlevel.pointsToFinish / 20,
        position: {
            x: 20,
            y: 580
        }
    })

    Game.entities.push(diamondCounter)

}

