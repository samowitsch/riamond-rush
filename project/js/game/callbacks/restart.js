GameCallbacks.prototype.restart = function () {
    currentlevel = JSON.parse(JSON.stringify(Levels[levelCounter]))            // 'copy' instead of call by reference

    sumpoints -= points
    points = 0

    counter = currentlevel.timelimit
    Game.create.gamescreenObjects()
}

