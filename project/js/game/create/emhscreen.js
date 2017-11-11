// easy,medium,hard screen ;o)
GameCreate.prototype.emhscreenObjects = function () {
    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: can.height / 2 - 200,
        rotation: -0.02
    })
    Game.entities.push(riamond)

    btnEasy = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-level-easy'),
        x: -600,
        y: can.height / 2 - 50,
        audio: btnSound
    })
    Game.entities.push(btnEasy)

    btnMedium = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-level-medium'),
        x: -800,
        y: can.height / 2 - 50,
        audio: btnSound
    })
    Game.entities.push(btnMedium)

    btnHard = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-level-hard'),
        x: -1000,
        y: can.height / 2 - 50,
        audio: btnSound
    })
    Game.entities.push(btnHard)

    btnBackToStartScreen = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-back'),
        x: -200,
        y: can.height - 125,
        audio: btnSound
    })
    Game.entities.push(btnBackToStartScreen)

    Game.tweens.emhScreenIn()

}
