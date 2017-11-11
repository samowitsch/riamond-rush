GameFunctions.prototype.countDown = function () {
    if (Game.countdownID) {
        clearTimeout(Game.countdownID)
        Game.countdownID = false
    }

    counter--
    if (counter >= 0) {
        Game.countdownID = setTimeout("Game.countDown()", 1000)
    } else {
        console.log('Zeit abgelaufen! Was nun?')
    }
}
