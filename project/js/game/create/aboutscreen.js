GameCreate.prototype.aboutscreenObjects = function () {
    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: 70,
        rotation: -0.02,
        scale: 0.4
    })
    Game.entities.push(riamond)


    // new bitmap

    var aboutText = new Bitmap({
        x: can.width / 2,
        y: can.height / 2 - 100,
        width: 700,
        height: 400
    })

    // draw text to bitmap context
    Game.font.drawMultiLineText({
        text: 'RIAMOND RUSH (c) 2014, 2024\n\n' +
            'PROGRAMMING: CHRISTIAN SONNTAG\n' +
            'LEVELS: CHRISTIAN+MONA SONNTAG, NICO GREIN\n' +
            'TESTING: CHRISTIAN+MONA SONNTAG, ALEX GREIN\n' +
            'SOUND: www.nosoapradio.us\n' +
            'CONTACT: www.motions-media.de\n\n' +
            'PROUDLY WRITTEN IN VANILLA JAVASCRIPT\n',
        xpos: 0,
        ypos: Game.font.getLineHeight(),
        lineOffset: 2,
        drawCtx: aboutText.ctx
    })

    Game.entities.push(aboutText)

    controls = new Sprite({
        imagename: 'gfx/control.png',
        x: can.width / 2,
        y: can.height - 200
    })
    Game.entities.push(controls)


    btnBackToStartScreen = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-back'),
        x: -200,
        y: can.height - 50,
        audio: btnSound
    })
    Game.entities.push(btnBackToStartScreen)

    Game.tweens.aboutScreenIn()

}


