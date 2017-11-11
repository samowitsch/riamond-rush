
GameFunctions.prototype.removeDiamondByPosition = function (x, y) {
    for (var i = 0, l = Game.entities.length; i < l; i++) {
        var entity = Game.entities[i]
        if (
            entity instanceof Diamond &&
            entity.x === x &&
            entity.y === y &&
            entity.visible === true
        ) {
            diamond.play()
            entity.visible = false
            points += entity.points
            sumpoints += entity.points
        }
    }
}
