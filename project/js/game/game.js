//'use strict'

var Game = {
    animationFrame: 0,
    click: false,
    mobile: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),
    countdownID: false,
    links: {
        RiamondRush: 'http://goo.gl/AUfYxm',
        Facebook: 'http://www.facebook.com/share.php?title=Play+Riamond+Rush+%3A+&u=' + encodeURIComponent('http://goo.gl/AUfYxm'),
        Twitter: 'https://twitter.com/share?lang=en&text=Play+Riamond+Rush+%3A+&url=' + encodeURIComponent('http://goo.gl/AUfYxm')
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
