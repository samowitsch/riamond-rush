function GameInit() {

}

GameInit.prototype.main = function () {
    this.canvas()
    this.resources()
    this.sound()
    this.banner()
    this.startscreen()
    requestAnimationFrame(Game.fn.loop)
}

GameInit.prototype.banner = function () {
    if (navigator.isCocoonJS) {
        banner = CocoonJS.Ad.createBanner(Game.bannerParams);
        banner.onBannerShown.addEventListener(Game.callbacks.onBannerShow);
        banner.onBannerHidden.addEventListener(Game.callbacks.onBannerHidden);
        banner.onBannerReady.addEventListener(Game.callbacks.onBannerReady);
        banner.refreshBanner()
    }
}

GameInit.prototype.layoutBanner = function () {
    var rect = banner.getRectangle();
    console.log("rect.x: " + rect.x + ", rect.y: " + rect.y + ", rect.width: " + rect.width + ", rect.height: " + rect.height);
    var dpr = window.devicePixelRatio;
    console.log('window.devicePixelRatio: ' + dpr)
    //if (demo.position == CocoonJS.Ad.BannerLayout.TOP_CENTER) {
    //    rect.x = window.innerWidth * dpr / 2 - rect.width / 2;
    //    rect.y = 0;
    //
    //} else {
    rect.x = window.innerWidth * dpr / 2 - rect.width / 2;
    rect.y = window.innerHeight * dpr - rect.height;

    console.log("rect.x: " + rect.x + ", rect.y: " + rect.y + ", rect.width: " + rect.width + ", rect.height: " + rect.height);

    //}

    banner.setRectangle(rect);
    if (!Game.bannerHidden) {
        banner.showBanner();
    }
}

GameInit.prototype.canvas = function () {
    can = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas');
    can.width = 800
    can.height = 600
    document.body.appendChild(can)

    if (navigator.isCocoonJS) {
        // touchmove, touchstart, touchend
        can.addEventListener('touchmove', function (evt) {

            Game.click = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            }

        })

        can.addEventListener('touchend', function (evt) {

            Game.click = {
                x: evt.changedTouches[0].pageX,
                y: evt.changedTouches[0].pageY
            }

        })

    } else {

    }

    ctx = can.getContext('2d', {antialias: true})

    // backbuffer canvas
    bcan = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas')
    bcan.width = 800
    bcan.height = 600

    // offscreen canvas buffer
    bctx = bcan.getContext('2d', {antialias: true})

    // fix font size for cocoonjs runtime
    if (Game.isCocoonJS) {
        bctx.font = '13pt Calibri';
    }
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
    sfxback = new Audio()
    sfxback.volume = 0.4
    sfxback.loop = true
    sfxback.src = 'sfx/sound-title.ogg'
    sfxback.play()
    sfxback.addEventListener('canplaythrough', function(e) {
//        console.log("audio disposed");
//        if (navigator.isCocoonJS) {
//            sfxback.dispose();
//        }
    });

    btnSound = new Audio()
    btnSound.src = 'sfx/btn-sound.ogg'

    btnTick = new Audio()
    btnTick.src = 'sfx/btn-tick.ogg'

    diamond = new Audio()
    diamond.volume = 0.4
    diamond.src = 'sfx/diamond.ogg'

    success = new Audio()
    diamond.volume = 0.4
    success.src = 'sfx/success.ogg'

    walk = new Audio()
    walk.volume = 0.4
    walk.src = 'sfx/walk.ogg'

    digg = new Audio()
    digg.src = 'sfx/digg.ogg'

    opendoor = new Audio()
    opendoor.src = 'sfx/door.ogg'

    playerVoice = new Audio()
    playerVoice.src = 'sfx/hey-dude.ogg'
    playerVoice.volume = 0.7
}

GameInit.prototype.startscreen = function () {
    if (banner) {
        Game.bannerHidden = false
        banner.showBanner()
    }

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
    if (banner) {
        Game.bannerHidden = true
        banner.hideBanner()
    }

    player = null
    Game.entities = []

    // url level data from editor
    //editorLevel = window.location.search.replace('?level=', '');
    //
    //if (editorLevel.length > 0) {
    //    currentlevel = JSON.parse(decodeURI(editorLevel))
    //} else {
        currentlevel = JSON.parse(JSON.stringify(Levels[levelCounter])) // 'copy' instead of call by reference
    //}

    counter = currentlevel.timelimit

    Game.create.gamescreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_GAMESCREEN
}

GameInit.prototype.finalscreen = function () {
    if (banner) {
        Game.bannerHidden = false
        banner.showBanner()
    }

    player = null
    Game.entities = []
    Game.create.finalscreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_FINALSCREEN
}

