//'use strict'

var Game = {
    animationFrame: 0,
    click: false,
    mobile: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),
    bannerHidden: false,
    isCocoonJS: navigator.isCocoonJS ? true : false,
    countdownID: false,
    links: {
        RiamondRush: 'http://goo.gl/AUfYxm',
        Facebook: 'http://www.facebook.com/share.php?title=Play+Riamond+Rush+%3A+&u=' + encodeURIComponent('http://goo.gl/AUfYxm'),
        Twitter: 'https://twitter.com/share?lang=en&text=Play+Riamond+Rush+%3A+&url=' + encodeURIComponent('http://goo.gl/AUfYxm')
    },
    bannerParams: {
        "bannerAdUnit": "BANNER_CODE_HERE",
        "bannerAdUnit-iPad": "BANNER_CODE_HERE",
        "bannerAdUnit-iPhone": "BANNER_CODE_HERE",
        "refresh": 20
    },
    entities: [],
    font: {},
    levelname: {},
    init: new GameInit(),
    create: new GameCreate(),
    callbacks: new GameCallbacks(),
    tweens: new GameTweens(),
    fn: new GameFunctions()
}
