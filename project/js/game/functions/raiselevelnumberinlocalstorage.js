
GameFunctions.prototype.raiseLevelNumberInLocalStorage = function () {
    var lvlNumber = parseInt(localStorage.getItem('playedLevels'))
    if (lvlNumber < levelCounter) {
        localStorage.setItem('playedLevels', levelCounter)
    }
}

