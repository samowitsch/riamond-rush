GameFunctions.prototype.getEntityById = function (uid) {
    for (var i = 0, l = Game.entities.length; i < l; i++) {
        var entity = Game.entities[i]
        if (entity.uid === uid) {
            return entity
        }
    }
    return false
}
