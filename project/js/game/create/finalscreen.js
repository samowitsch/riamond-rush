
GameCreate.prototype.finalscreenObjects = function () {
    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: 70,
        rotation: -0.02,
        scale: 0.2
    })
    Game.entities.push(riamond)


    var finalText = new Bitmap({
        x: can.width / 2,
        y: can.height / 2,
        width: 700,
        height: 350
    })

    // draw text to bitmap context
    Game.font.drawMultiLineText({
        text: 'CONGRATULATIONS! YOU DID A GREAT JOB!\n\n' +
        'WE HOPE YOU HAVE A LOT OF FUN WITH THIS GAME!\n\n' +
        '',
        xpos: 0,
        ypos: Game.font.getLineHeight(),
        lineOffset: 3,
        drawCtx: finalText.ctx
    })

    Game.entities.push(finalText)

    btnBackToStartScreen = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-back'),
        x: -200,
        y: can.height - 125,
        audio: btnSound
    })
    Game.entities.push(btnBackToStartScreen)

    Game.tweens.finalScreenIn()

}


