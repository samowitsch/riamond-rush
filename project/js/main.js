//'use strict'



window.onload = function () {
    Game.init.main()

    joypad.on('connect', e => {
        gamepad = e
        console.log('Gamepad connected', gamepad)
    });

}


