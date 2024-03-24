function GameInit() {

}

GameInit.prototype.main = function () {
    this.resources()
    this.canvas()
    this.sound()
    this.startscreen()
    requestAnimationFrame(Game.fn.loop)
}

GameInit.prototype.canvas = function () {
    can = document.createElement('canvas');
    can.width = 800
    can.height = 600
    document.body.appendChild(can)


    ctx = can.getContext('2d', {antialias: true})

    // backbuffer canvas
    bcan = document.createElement('canvas')
    bcan.width = 800
    bcan.height = 600

    // offscreen canvas buffer
    bctx = bcan.getContext('2d', {antialias: true})


    can.addEventListener('click', function (evt) {
        var rect = can.getBoundingClientRect();

        var scalingRatioX = evt.target.width / evt.target.clientWidth,
            scalingRatioY = evt.target.height / evt.target.clientHeight

        Game.click = {
            x: (evt.layerX - rect.left) * scalingRatioX,
            y: (evt.layerY - rect.top)  * scalingRatioY
        }
    })

}

GameInit.prototype.resources = function () {

    emitterScreen = new ParticleEmitter({
        jsonFile: 'js/editors/particle/effects/riamond-rush-intro.json'
    })

    emitterPlayer = new ParticleEmitter({
        jsonFile: 'js/editors/particle/effects/riamond-rush-fire.json'
    })

    Game.font = new BitmapFont({ctx: ctx})
    Game.font.loadFont({font:'font/bit-trip.txt'})

    atlasUI = new Atlas('gfx/', 'gfx-ui.json')

    if (localStorage.getItem('playedLevels') === null) {
        localStorage.setItem('playedLevels', 0)
    }
}

GameInit.prototype.sound = function () {
    sfxback = new Audio('sfx/sound-title.ogg')
    sfxback.volume = 0.4
    sfxback.loop = true
    sfxback.autoplay = true
    sfxback.oncanplay = function(event){
        var playedPromise = sfxback.play();
        if (playedPromise) {
            playedPromise.catch((e) => {
                console.log(e)
                if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                    console.log(e.name);
                }
            }).then(() => {

            });
        }
    }


    btnSound = new AudioProxy({
        url: '/sfx/btn-sound.ogg'
    });

    btnTick = new AudioProxy({
        url: '/sfx/btn-tick.ogg'
    });

    diamond = new AudioProxy({
        url: '/sfx/diamond.ogg',
        volume: 0.1
    });

    lock = new AudioProxy({
        url: '/sfx/save-lock.ogg',
        volume: 0.4
    });

    rotate = new AudioProxy({
        url: '/sfx/rotate.ogg'
    });

    success = new AudioProxy({
        url: '/sfx/success.ogg',
        volume: 0.4
    });

    walk = new AudioProxy({
        url: '/sfx/walk.ogg',
        volume: 0.4
    });

    digg = new AudioProxy({
        url: '/sfx/digg.ogg'
    });

    opendoor = new AudioProxy({
        url: '/sfx/opendoor.ogg'
    });

    playerVoice = new AudioProxy({
        url: '/sfx/hey-dude.ogg',
        volume: 0.7
    });

}

GameInit.prototype.startscreen = function () {


    sumpoints -= points
    points = 0

    player = null
    Game.entities = []
    Game.create.startscreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_STARTSCREEN
}

GameInit.prototype.aboutscreen = function () {
    player = null
    Game.entities = []
    Game.create.aboutscreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_ABOUTSCREEN
}

GameInit.prototype.emhscreen = function () {
    player = null
    Game.entities = []
    Game.create.emhscreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_EMHSCREEN
}

GameInit.prototype.levelscreen = function () {
    player = null
    Game.entities = []
    Game.create.levelscreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_LEVELSCREEN
}

GameInit.prototype.gamescreen = function () {

    player = null
    Game.entities = []

    // url level data from editor
    editorLevel = window.location.search.replace('?leveleditor=', '');

    if (editorLevel.length > 0) {
       currentlevel = JSON.parse(decodeURI(editorLevel))
    } else {
        currentlevel = JSON.parse(JSON.stringify(Levels[levelCounter])) // 'copy' instead of call by reference
    }

    counter = currentlevel.timelimit

    Game.create.gamescreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_GAMESCREEN
}

GameInit.prototype.finalscreen = function () {

    player = null
    Game.entities = []
    Game.create.finalscreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_FINALSCREEN
}

