
GameFunctions.prototype.getEntityByIdAndInstance = function (uid, instances) {
    for (var i = 0, l = Game.entities.length; i < l; i++) {
        var entity = Game.entities[i]
        for (var ii = 0, li = instances.length; ii < li; ii++) {
            if (entity.uid === uid && entity instanceof instances[ii]) {
                if (entity.visible) {
                    return entity
                }
            }
        }
    }
    return false
}

