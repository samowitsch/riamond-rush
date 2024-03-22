function DiamondCounter(opt) {
    this.diamondsNeeded = opt.diamondsNeeded || 0
    this.diamondsFound = opt.diamondsFound || 0
    this.rememberDiamonds = [];
    this.position = opt.position || { x: 0, y: 550 }
    this.diamonds = []


    for (let i = 0; i < this.diamondsNeeded; i++) {
        let diamond = new Diamond({
            uid: i,
            atlasimage: atlasGame.image,
            atlasdata: atlasGame.getPicByName('diamond'),
            x: this.position.x + (i * 20),
            y: this.position.y,
            points: 20,
            scale: 0.5,
            alpha: 0.5
        })
        this.diamonds.push(diamond)
    }
}


DiamondCounter.prototype.incrementDiamondFound = function (x, y) {
    let hash = x + '_' + y
    if (this.rememberDiamonds.indexOf(hash) != -1) {
        return
    }

    this.rememberDiamonds.push(hash)
    this.diamonds[this.diamondsFound].alpha = 1
    this.diamondsFound++
}

DiamondCounter.prototype.update = function () {

}

DiamondCounter.prototype.draw = function () {
    this.diamonds.forEach((diamond) => {
        diamond.draw();
    });
}
