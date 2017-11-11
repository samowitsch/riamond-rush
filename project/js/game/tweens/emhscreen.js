GameTweens.prototype.emhScreenIn = function () {

    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: can.width / 2}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnEasy.x, y: btnEasy.y})
        .to({x: can.width / 4}, 1500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnEasy.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnMedium.x, y: btnMedium.y})
        .to({x: can.width / 2}, 1750)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnMedium.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnHard.x, y: btnHard.y})
        .to({x: can.width / 4 * 3}, 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnHard.x = this.x
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

GameTweens.prototype.emhScreenOut = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
            btnEasy.x = this.x - (can.width / 4)
            btnMedium.x = this.x
            btnHard.x = this.x + (can.width / 4)
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
            Game.init.levelscreen()
        })
        .start();
}

GameTweens.prototype.emhScreenBack = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
            btnEasy.x = this.x - (can.width / 4)
            btnMedium.x = this.x
            btnHard.x = this.x + (can.width / 4)
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
            Game.init.startscreen()
        })
        .start();

}

