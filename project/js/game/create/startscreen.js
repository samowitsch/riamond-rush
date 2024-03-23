GameCreate.prototype.startscreenObjects = function () {

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

    textriamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-text-riamond'),
        x: -1000,
        y: 100
    })
    Game.entities.push(textriamond)

    textrush = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-text-rush'),
        _rotation: -9,
        x: -1500,
        y: 200
    })
    Game.entities.push(textrush)


    claim = new Sprite({
        imagename: 'gfx/claim.png',
        x: 1100,
        y: 280
    })
    Game.entities.push(claim)


    btnPlay = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-play'),
        x: -200,
        y: can.height - 200,
        audio: btnSound
    })
    btnAbout = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-about'),
        x: -400,
        y: can.height - 125,
        audio: btnSound
    })


    btnGroupStart = new ButtonGroup({
        x: -600,
        y: can.height - 200,
        width: 500,
        type: 'hor',
        buttons: [btnPlay, btnAbout]
    })

    Game.entities.push(btnGroupStart)
    Game.entities.push(btnPlay)
    Game.entities.push(btnAbout)

    Game.tweens.startScreenIn()
}