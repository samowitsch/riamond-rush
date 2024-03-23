
GameTweens.prototype.startScreenIn = function () {
    var tween = new TWEEN.Tween({ x: riamond.x, y: riamond.y })
        .to({ x: can.width - 200 }, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({ x: textriamond.x, y: textriamond.y })
        .to({ x: can.width / 2 }, 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            textriamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({ x: textrush.x, y: textrush.y })
        .to({ x: can.width / 2 + 100 }, 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            textrush.x = this.x
        })
        .onComplete(function () {
        })
        .start();


    var tween = new TWEEN.Tween({ x: btnGroupStart.x, y: btnGroupStart.y })
        .to({ x: can.width / 2 }, 2500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnGroupStart.x = this.x
        })
        .onComplete(function () {
        })
        .start();


    var tween = new TWEEN.Tween({ x: claim.x, y: claim.y })
        .to({ x: 300 }, 2500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            claim.x = this.x
        })
        .onComplete(function () {
        })
        .start();


}

GameTweens.prototype.startScreenOutGame = function () {

    var tween = new TWEEN.Tween({ x: riamond.x, y: riamond.y })
        .to({ x: -600 }, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({ x: textriamond.x, y: textriamond.y })
        .to({ x: 1600 }, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            textriamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({ x: textrush.x, y: textrush.y })
        .to({ x: -700 }, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            textrush.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({ x: btnGroupStart.x, y: btnGroupStart.y })
        .to({ x: 1600 }, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            btnGroupStart.x = this.x
        })
        .onComplete(function () {
            Game.init.emhscreen()
        })
        .start();


    var tween = new TWEEN.Tween({ x: claim.x, y: claim.y })
        .to({ x: 1100 }, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            claim.x = this.x
        })
        .onComplete(function () {
        })
        .start();

}



GameTweens.prototype.startScreenOutAbout = function () {

    var tween = new TWEEN.Tween({ x: riamond.x, y: riamond.y })
        .to({ x: -600 }, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({ x: textriamond.x, y: textriamond.y })
        .to({ x: 1600 }, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            textriamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({ x: textrush.x, y: textrush.y })
        .to({ x: -700 }, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            textrush.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({ x: btnGroupStart.x, y: btnGroupStart.y })
        .to({ x: 1600 }, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            btnGroupStart.x = this.x
        })
        .onComplete(function () {
            Game.init.aboutscreen()
        })
        .start();


    var tween = new TWEEN.Tween({ x: claim.x, y: claim.y })
        .to({ x: 1100 }, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            claim.x = this.x
        })
        .onComplete(function () {
        })
        .start();
}

