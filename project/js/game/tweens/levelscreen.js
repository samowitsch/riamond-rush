
GameTweens.prototype.levelScreenIn = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: can.width / 2}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnPlay.x, y: btnPlay.y})
        .to({x: can.width / 2}, 1250)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnPlay.x = this.x
        })
        .onComplete(function () {
        })
        .start();
    var tween = new TWEEN.Tween({x: btnBackToStartScreen.x, y: btnBackToStartScreen.y})
        .to({x: can.width / 2}, 1500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
        })
        .start();
}

GameTweens.prototype.levelScreenOut = function () {}

GameTweens.prototype.levelScreenBack = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
            Game.init.emhscreen()
        })
        .start();
}

