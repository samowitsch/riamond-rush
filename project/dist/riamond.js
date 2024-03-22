
function Rand(n1, n2) {
    return Math.floor(Math.random() * n2) + n1
}

function Rand1ToMinus1() {
    return Math.random() * (1 - -1) + -1
}

function Min(x, y) {
    if (x < y)
        return x
    return y
}

function Max(x, y) {
    if (x > y)
        return x
    return    y
}
function Vector2D(opt) {
    var opt = opt || {}
    this.x = opt.x || 0
    this.y = opt.y || 0
}

Vector2D.prototype.set = function (vec) {
    var vec = vec || {}
    this.x = vec.x || 0
    this.y = vec.y || 0
}

Vector2D.prototype.add = function (vec) {
    var vec = vec || {}
    this.x += vec.x || 0
    this.y += vec.y || 0
}

Vector2D.prototype.sub = function (vec) {
    var vec = vec || {}
    this.x -= vec.x || 0
    this.y -= vec.y || 0
}

Vector2D.prototype.mul = function (scalar) {
    var scalar = scalar || 0
    this.x *= scalar
    this.y *= scalar
}

Vector2D.prototype.dot = function (vec) {
    return (this.x * vec.x + this.y * vec.y)
}

Vector2D.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
}

Vector2D.prototype.normalize = function () {
    var length = this.length()
    if (length === 0) {
        return
    }
    this.set({x: this.x / length, y: this.y / length})
}

Vector2D.prototype.inverse = function () {
    this.x = -this.x
    this.y = -this.y
}

Vector2D.prototype.inverseX = function () {
    this.x = -this.x
}

Vector2D.prototype.inverseY = function () {
    this.y = -this.y
}

Vector2D.prototype.copy = function () {
    return new Vector2D({x: this.x, y: this.y})
}

Vector2D.prototype.equals = function (vec) {
    return (this.x === vec.x) && (this.y === vec.y)
}

function RGBColor(opt) {
    var opt = opt || {}
    this.r = (opt.r === undefined) ? 255 : opt.r
    this.g = (opt.g === undefined) ? 255 : opt.g
    this.b = (opt.b === undefined) ? 255 : opt.b
    this.a = (opt.a === undefined) ? 1 : opt.a
}
RGBColor.prototype.set = function (opt) {
    var opt = opt || {}
    RGBColor.call(this, opt)
}

var COLOR_WHITE = new RGBColor({r: 255, g: 255, b: 255, a: 1.0}),
    COLOR_BLACK = new RGBColor({r: 0, g: 0, b: 0, a: 1.0}),
    COLOR_RED = new RGBColor({r: 255, g: 0, b: 0, a: 1.0}),
    COLOR_GREEN = new RGBColor({r: 0, g: 255, b: 0, a: 1.0}),
    COLOR_BLUE = new RGBColor({r: 0, g: 0, b: 255, a: 1.0})

function Particle() {
    this.position = new Vector2D()
    this.startPosition = new Vector2D()
    this.direction = new Vector2D()
    this.size = new Vector2D()
    this.deltaSize = new Vector2D()
    this.color = new RGBColor()
    this.deltaColor = new RGBColor()

    this.angle = 0
    this.radialAcceleration = 0
    this.tangentialAcceleration = 0
    this.radius = 0
    this.radiusDelta = 0
    this.degreesPerSecond = 0
    this.rotation = 0
    this.deltaRotation = 0

    this.timeToLive = 0
}

var TYPE_GRAVITY = 1,
    TYPE_RADIAL = 2,
    MathPI_180 = Math.PI / 180

function ParticleEmitter(opt) {

    this.particles = []
    this.inUse = false
    this.mirrored = false

    this.id = ''
    this.texture = new Image()
    this.texturePath = ''

    this.position = new Vector2D()
    this.positionVariance = new Vector2D()

    this.speed = 0
    this.speedVariance = 0
    this.radialAcceleration = 0
    this.radialAccelVariance = 0
    this.tangentialAcceleration = 0
    this.tangentialAccelVariance = 0

    this.size = new Vector2D({x: 1, y: 1})
    this.sizeVariance = new Vector2D()
    this.endSize = new Vector2D({x: 1, y: 1})
    this.endSizeVariance = new Vector2D()
    this.scaleUniform = true

    this.angle = 0
    this.angleVariance = 0
    this.rotationStart = 0
    this.rotationStartVariance = 0
    this.rotationEnd = 0
    this.rotationEndVariance = 0

    this.startColor = new RGBColor()
    this.startColorVariance = new RGBColor({r: 0, g: 0, b: 0, a: 0})

    this.endColor = new RGBColor()
    this.endColorVariance = new RGBColor({r: 0, g: 0, b: 0, a: 0})

    this.gravity = new Vector2D()

    this.particleLifeSpan = 0
    this.particleLifeSpanVariance = 0

    this.maxRadius = 0
    this.maxRadiusVariance = 0
    this.minRadius = 0
    this.rotatePerSecond = 0
    this.rotatePerSecondVariance = 0

    this.additiveBlend = false
    this.oneShot = false
    this.active = true

    this.duration = -1
    this.emitDelay = 0
    this.emissionRate = 0

    this.emitterType = TYPE_GRAVITY
    this.emitCounter = 0
    this.delta = 0.01666666
    this.lastTime = 0
    this.elapsedTime = 0
    this.maxParticles = 0
    this.particleCount = 0
    this.settings = {}

    this._radial = new Vector2D()
    this._tangential = new Vector2D()
//    this._tmp = new Vector2D()

    if (opt.jsonFile) {
        this.loadParticleFile(opt.jsonFile)
    }
    if (opt.jsonData) {
        this.loadParticleData(opt.jsonData)
    }
}

ParticleEmitter.prototype.update = function () {
//    var now = Date.now()
//    this.delta = (now - this.lastTime) / 1000
//    this.lastTime = now

    // create particles
    if (this.active && (this.emissionRate > 0)) {
        this.elapsedTime += this.delta
        if (this.oneShot) {
            var shootNr = Min(this.maxParticles, this.emissionRate)
            while (this.particleCount < shootNr) {
                this.addParticle()
            }
            if (this.duration !== -1) {
                this.stop()
            }
        } else {
            var rate = 1 / this.emissionRate
            this.emitCounter += this.delta
            while (this.particleCount < this.maxParticles && this.emitCounter > rate) {
                this.addParticle()
                this.emitCounter -= rate
            }
            if ((this.duration !== -1) && (this.elapsedTime > (this.duration + this.emitDelay))) {
                this.stop()
            }
        }
    } else if ((this.active === false) && (this.elapsedTime === 0)) {
        if (this.particleCount === 0) {
            this.inUse = false
        }
    }

    var i = 0,
        currentParticle

    while (i < this.particleCount) {

        currentParticle = this.particles[i]
        currentParticle.timeToLive -= this.delta

        if (currentParticle.timeToLive > 0) {

            var _tmp = new Vector2D()

            if (this.emitterType === TYPE_RADIAL) {
                currentParticle.angle += currentParticle.degreesPerSecond * this.delta
                currentParticle.radius -= currentParticle.radiusDelta   // TODO diff to ObjC Code?

                currentParticle.position.set({
                    x: this.position.x - Math.cos(currentParticle.angle) * currentParticle.radius,
                    y: this.position.y - Math.sin(currentParticle.angle) * currentParticle.radius
                })

                if (currentParticle.radius < this.minRadius) {
                    currentParticle.timeToLive = 0
                }
            } else if (this.emitterType === TYPE_GRAVITY) {

                if (currentParticle.position.x || currentParticle.position.y) {
                    this._radial.set(currentParticle.position)
                    this._radial.normalize()
                }

                this._tangential.set(this._radial)
                this._radial.mul(currentParticle.radialAcceleration)

//                var newY = this._tangential.x
//                this._tangential.x = -this._tangential.y
//                this._tangential.y = newY
//                this._tangential.mul(currentParticle.tangentialAcceleration)
//
//                _tmp.add(this.gravity)
//                _tmp.add(this._radial)
//                _tmp.add(this._tangential)
//                _tmp.mul(this.delta)
//                currentParticle.direction.add(_tmp)
//                _tmp.set(currentParticle.direction)
//                _tmp.mul(this.delta)
//                currentParticle.position.add(_tmp)

                var newY = this._tangential.x
                this._tangential.x = -this._tangential.y
                this._tangential.y = newY
                this._tangential.mul(currentParticle.tangentialAcceleration)

                _tmp.set(this._radial)
                _tmp.add(this._tangential)
                _tmp.add(this.gravity)
                _tmp.mul(this.delta)
                currentParticle.direction.add(_tmp)

                _tmp.set(currentParticle.direction)
                _tmp.mul(this.delta)
                currentParticle.position.add(_tmp)

            }

            currentParticle.size.x += currentParticle.deltaSize.x * this.delta
            currentParticle.size.y += currentParticle.deltaSize.y * this.delta

            currentParticle.rotation += currentParticle.deltaRotation * this.delta

            currentParticle.color.r += currentParticle.deltaColor.r * this.delta
            currentParticle.color.g += currentParticle.deltaColor.g * this.delta
            currentParticle.color.b += currentParticle.deltaColor.b * this.delta
            currentParticle.color.a += currentParticle.deltaColor.a * this.delta
            currentParticle.color.a = Max(0, currentParticle.color.a)

            i += 1
        } else {
            if (i !== this.particleCount - 1) {
                var tmpParticle = this.particles[i]
                this.particles[i] = this.particles[this.particleCount - 1]
                this.particles[this.particleCount - 1] = tmpParticle
            }
            this.particleCount -= 1
        }
    }
}

ParticleEmitter.prototype.draw = function () {
    var currentParticle
    for (var i = 0, l = this.particleCount; i < l; i++) {
        currentParticle = this.particles[i]
        bctx.save()
        if (this.additiveBlend) {
            bctx.globalCompositeOperation = "lighter";
        }
        bctx.translate(currentParticle.position.x >> 0, currentParticle.position.y >> 0)

        if (currentParticle.rotation || currentParticle.angle) {
            bctx.rotate(currentParticle.rotation * MathPI_180)
        }

        bctx.scale(currentParticle.size.x, currentParticle.size.y)

        bctx.globalAlpha = currentParticle.color.a
        bctx.drawImage(this.texture, -this.texture.width2, -this.texture.height2)
        bctx.restore()
    }
}


ParticleEmitter.prototype.addParticle = function () {
    if (this.particleCount >= this.maxParticles) {
        return false
    }
    var particle = this.particles[this.particleCount]
    this.initParticle(particle)
    this.particleCount += 1
    return true
}

ParticleEmitter.prototype.start = function () {
    this.active = true
    this.lastTime = Date.now()
}

ParticleEmitter.prototype.stop = function () {
    this.active = false
    this.elapsedTime = -0.01
    this.emitCounter = 0
}

ParticleEmitter.prototype.halt = function () {
    this.stop()
    this.particleCount = 0
}

ParticleEmitter.prototype.initParticle = function (particle) {
    particle.timeToLive = this.particleLifeSpan + this.particleLifeSpanVariance * Rand1ToMinus1()

    particle.position.x = this.position.x + this.positionVariance.x * Rand1ToMinus1()
    particle.position.y = this.position.y + this.positionVariance.y * Rand1ToMinus1()
    particle.startPosition.x = this.position.x
    particle.startPosition.y = this.position.y


    var newAngle = this.angle + this.angleVariance * Rand1ToMinus1(),
        vectorSpeed = this.speed + this.speedVariance * Rand1ToMinus1()

    particle.direction.set({x: Math.cos(newAngle * MathPI_180), y: Math.sin(Math.sin(newAngle * MathPI_180))})
    particle.direction.mul(vectorSpeed)
    particle.angle = this.angle + this.angleVariance * Rand1ToMinus1()

    particle.radius = this.maxRadius + this.maxRadiusVariance * Rand1ToMinus1()
    particle.radiusDelta = (this.maxRadius / this.particleLifeSpan) * 0.01666666666667  // TODO check (1 / 60)

    particle.degreesPerSecond = this.rotatePerSecond + this.rotatePerSecondVariance * Rand1ToMinus1()
    particle.radialAcceleration = this.radialAcceleration
    particle.tangentialAcceleration = this.tangentialAcceleration

    particle.size.x = this.size.x + this.sizeVariance.x * Rand1ToMinus1()
    particle.size.y = this.size.y + this.sizeVariance.y * Rand1ToMinus1()

    var endX = this.endSize.x + this.endSizeVariance.x * Rand1ToMinus1(),
        endY = this.endSize.y + this.endSizeVariance.y + Rand1ToMinus1()

    particle.deltaSize.x = (endX - particle.size.x) / particle.timeToLive
    particle.deltaSize.y = (endY - particle.size.y) / particle.timeToLive

    if (this.scaleUniform) {
        particle.size.y = particle.size.x
        particle.deltaSize.y = particle.deltaSize.x
    }

    var startAngle = this.rotationStart + this.rotatePerSecondVariance * Rand1ToMinus1(),
        endAngle = this.rotationEnd + this.rotationEndVariance * Rand1ToMinus1()
    particle.rotation = startAngle
    particle.deltaRotation = (endAngle - startAngle) / particle.timeToLive

    var r = this.startColor.r + this.startColorVariance.r * Rand1ToMinus1(),
        g = this.startColor.g + this.startColorVariance.g * Rand1ToMinus1(),
        b = this.startColor.b + this.startColorVariance.b * Rand1ToMinus1(),
        a = this.startColor.a + this.startColorVariance.a * Rand1ToMinus1()

    r = Max(0, r)
    g = Max(0, g)
    b = Max(0, b)
    a = Max(0, a)

    r = Min(255, r)
    g = Min(255, g)
    b = Min(255, b)
    a = Min(1, a)
    particle.color.set({r: r, g: g, b: b, a: a})

    var endR = this.endColor.r + this.endColorVariance.r * Rand1ToMinus1(),
        endG = this.endColor.g + this.endColorVariance.g * Rand1ToMinus1(),
        endB = this.endColor.b + this.endColorVariance.b * Rand1ToMinus1(),
        endA = this.endColor.a + this.endColorVariance.a * Rand1ToMinus1()

    endR = Max(0, endR)
    endG = Max(0, endG)
    endB = Max(0, endB)
    endA = Max(0, endA)

    endR = Min(255, endR)
    endG = Min(255, endG)
    endB = Min(255, endB)
    endA = Min(1, endA)

    particle.deltaColor.r = (endR - r) / particle.timeToLive
    particle.deltaColor.g = (endG - g) / particle.timeToLive
    particle.deltaColor.b = (endB - b) / particle.timeToLive
    particle.deltaColor.a = (endA - a) / particle.timeToLive
}

ParticleEmitter.prototype.initWithSize = function (maxParticles) {
    this.particles = new Array(Math.floor(maxParticles))
    for (var i = 0, l = this.particles.length; i < l; i++) {
        this.particles[i] = new Particle()
    }
    this.maxParticles = Math.floor(maxParticles)
}


ParticleEmitter.prototype.setTexture = function () {
    this.texture.src = this.settings.imageData // base64 image data from json file
    this.texture.onload = function () {

        this.texture.width2 = this.texture.width / 2
        this.texture.height2 = this.texture.height / 2

        console.log('image loaded')
    }.bind(this)
}

ParticleEmitter.prototype.processData = function () {
    this.particleLifeSpan = this.settings.life
    this.particleLifeSpanVariance = this.settings.lifeVariance
    this.emissionRate = this.settings.emissionRate
    this.duration = this.settings.duration

    var arraySize = (this.particleLifeSpan + this.particleLifeSpanVariance * 0.75) * this.emissionRate
    this.initWithSize(arraySize)

    this.additiveBlend = this.settings.additiveBlend
    this.oneShot = this.settings.oneShot
    this.emitDelay = this.settings.emitDelay

    if (this.settings.type === 'radial') {
        this.emitterType = TYPE_RADIAL
        this.maxRadius = this.settings.maxRadius
        this.maxRadiusVariance = this.settings.maxRadiusVariance
        this.minRadius = this.settings.minRadius
        this.rotatePerSecond = this.settings.rotatePerSecond
        this.rotatePerSecondVariance = this.settings.rotatePerSecondVariance
    } else {
        this.emitterType = TYPE_GRAVITY
        this.gravity.x = this.settings.gravityX
        this.gravity.y = this.settings.gravityY

        this.radialAcceleration = this.settings.radialAcceleration
        this.radialAccelVariance = this.settings.radialAccelVariance
        this.tangentialAcceleration = this.settings.tangentialAcceleration
        this.tangentialAccelVariance = this.settings.tangentialAccelVariance

        this.speed = this.settings.speed
        this.speedVariance = this.settings.speedVariance
    }

    this.position.x = this.settings.positionX
    this.position.y = this.settings.positionY
    this.positionVariance.x = this.settings.positionVarianceX
    this.positionVariance.y = this.settings.positionVarianceY

    this.size.x = this.settings.sizeX
    this.size.y = this.settings.sizeY
    this.sizeVariance.x = this.settings.sizeVarianceX
    this.sizeVariance.y = this.settings.sizeVarianceY

    this.endSize.x = this.settings.endSizeX
    this.endSize.y = this.settings.endSizeY
    this.endSizeVariance.x = this.settings.endSizeVarianceX
    this.endSizeVariance.y = this.settings.endSizeVarianceY
    this.scaleUniform = this.settings.scaleUniform


    this.angle = this.settings.angle
    this.angleVariance = this.settings.angleVariance

    this.rotationStart = this.settings.rotationStart
    this.rotatePerSecondVariance = this.settings.rotatePerSecondVariance
    this.rotationEnd = this.settings.rotationEnd
    this.rotationEndVariance = this.settings.rotationEndVariance

    this.startColor.set({
        r: this.settings.color.r,
        g: this.settings.color.g,
        b: this.settings.color.b,
        a: this.settings.color.a
    })
    this.startColorVariance.set({
        r: this.settings.colorVariance.r,
        g: this.settings.colorVariance.g,
        b: this.settings.colorVariance.b,
        a: this.settings.colorVariance.a
    })
    this.endColor.set({
        r: this.settings.endColor.r,
        g: this.settings.endColor.g,
        b: this.settings.endColor.b,
        a: this.settings.endColor.a
    })
    this.endColorVariance.set({
        r: this.settings.endColorVariance.r,
        g: this.settings.endColorVariance.g,
        b: this.settings.endColorVariance.b,
        a: this.settings.endColorVariance.a
    })


    if (this.mirrored) {
        this.position.x = -this.position.x
        this.angle = 360 - this.angle
        this.gravity.x = -this.gravity.x
    }

    this.setTexture()
}

ParticleEmitter.prototype.loadParticleData = function (settings) {
    this.settings = settings

    this.processData()
}


ParticleEmitter.prototype.loadParticleFile = function (path) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send(null);
    if ((xhr.status === 200) || (xhr.status === 0)) {
        this.settings = JSON.parse(xhr.responseText)
        console.log('settings file loaded')

        this.processData()

    }
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};


if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function (searchString, position) {
            var subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/*! howler.js v2.2.4 | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function(){"use strict";var e=function(){this.init()};e.prototype={init:function(){var e=this||n;return e._counter=1e3,e._html5AudioPool=[],e.html5PoolSize=10,e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e._canPlayEvent="canplaythrough",e._navigator="undefined"!=typeof window&&window.navigator?window.navigator:null,e.masterGain=null,e.noAudio=!1,e.usingWebAudio=!0,e.autoSuspend=!0,e.ctx=null,e.autoUnlock=!0,e._setup(),e},volume:function(e){var o=this||n;if(e=parseFloat(e),o.ctx||_(),void 0!==e&&e>=0&&e<=1){if(o._volume=e,o._muted)return o;o.usingWebAudio&&o.masterGain.gain.setValueAtTime(e,n.ctx.currentTime);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.volume=u._volume*e)}return o}return o._volume},mute:function(e){var o=this||n;o.ctx||_(),o._muted=e,o.usingWebAudio&&o.masterGain.gain.setValueAtTime(e?0:o._volume,n.ctx.currentTime);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.muted=!!e||u._muted)}return o},stop:function(){for(var e=this||n,o=0;o<e._howls.length;o++)e._howls[o].stop();return e},unload:function(){for(var e=this||n,o=e._howls.length-1;o>=0;o--)e._howls[o].unload();return e.usingWebAudio&&e.ctx&&void 0!==e.ctx.close&&(e.ctx.close(),e.ctx=null,_()),e},codecs:function(e){return(this||n)._codecs[e.replace(/^x-/,"")]},_setup:function(){var e=this||n;if(e.state=e.ctx?e.ctx.state||"suspended":"suspended",e._autoSuspend(),!e.usingWebAudio)if("undefined"!=typeof Audio)try{var o=new Audio;void 0===o.oncanplaythrough&&(e._canPlayEvent="canplay")}catch(n){e.noAudio=!0}else e.noAudio=!0;try{var o=new Audio;o.muted&&(e.noAudio=!0)}catch(e){}return e.noAudio||e._setupCodecs(),e},_setupCodecs:function(){var e=this||n,o=null;try{o="undefined"!=typeof Audio?new Audio:null}catch(n){return e}if(!o||"function"!=typeof o.canPlayType)return e;var t=o.canPlayType("audio/mpeg;").replace(/^no$/,""),r=e._navigator?e._navigator.userAgent:"",a=r.match(/OPR\/(\d+)/g),u=a&&parseInt(a[0].split("/")[1],10)<33,d=-1!==r.indexOf("Safari")&&-1===r.indexOf("Chrome"),i=r.match(/Version\/(.*?) /),_=d&&i&&parseInt(i[1],10)<15;return e._codecs={mp3:!(u||!t&&!o.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!t,opus:!!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!(o.canPlayType('audio/wav; codecs="1"')||o.canPlayType("audio/wav")).replace(/^no$/,""),aac:!!o.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!o.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(o.canPlayType("audio/x-m4a;")||o.canPlayType("audio/m4a;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),m4b:!!(o.canPlayType("audio/x-m4b;")||o.canPlayType("audio/m4b;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(o.canPlayType("audio/x-mp4;")||o.canPlayType("audio/mp4;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!(_||!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),webm:!(_||!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),dolby:!!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(o.canPlayType("audio/x-flac;")||o.canPlayType("audio/flac;")).replace(/^no$/,"")},e},_unlockAudio:function(){var e=this||n;if(!e._audioUnlocked&&e.ctx){e._audioUnlocked=!1,e.autoUnlock=!1,e._mobileUnloaded||44100===e.ctx.sampleRate||(e._mobileUnloaded=!0,e.unload()),e._scratchBuffer=e.ctx.createBuffer(1,1,22050);var o=function(n){for(;e._html5AudioPool.length<e.html5PoolSize;)try{var t=new Audio;t._unlocked=!0,e._releaseHtml5Audio(t)}catch(n){e.noAudio=!0;break}for(var r=0;r<e._howls.length;r++)if(!e._howls[r]._webAudio)for(var a=e._howls[r]._getSoundIds(),u=0;u<a.length;u++){var d=e._howls[r]._soundById(a[u]);d&&d._node&&!d._node._unlocked&&(d._node._unlocked=!0,d._node.load())}e._autoResume();var i=e.ctx.createBufferSource();i.buffer=e._scratchBuffer,i.connect(e.ctx.destination),void 0===i.start?i.noteOn(0):i.start(0),"function"==typeof e.ctx.resume&&e.ctx.resume(),i.onended=function(){i.disconnect(0),e._audioUnlocked=!0,document.removeEventListener("touchstart",o,!0),document.removeEventListener("touchend",o,!0),document.removeEventListener("click",o,!0),document.removeEventListener("keydown",o,!0);for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("unlock")}};return document.addEventListener("touchstart",o,!0),document.addEventListener("touchend",o,!0),document.addEventListener("click",o,!0),document.addEventListener("keydown",o,!0),e}},_obtainHtml5Audio:function(){var e=this||n;if(e._html5AudioPool.length)return e._html5AudioPool.pop();var o=(new Audio).play();return o&&"undefined"!=typeof Promise&&(o instanceof Promise||"function"==typeof o.then)&&o.catch(function(){console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.")}),new Audio},_releaseHtml5Audio:function(e){var o=this||n;return e._unlocked&&o._html5AudioPool.push(e),o},_autoSuspend:function(){var e=this;if(e.autoSuspend&&e.ctx&&void 0!==e.ctx.suspend&&n.usingWebAudio){for(var o=0;o<e._howls.length;o++)if(e._howls[o]._webAudio)for(var t=0;t<e._howls[o]._sounds.length;t++)if(!e._howls[o]._sounds[t]._paused)return e;return e._suspendTimer&&clearTimeout(e._suspendTimer),e._suspendTimer=setTimeout(function(){if(e.autoSuspend){e._suspendTimer=null,e.state="suspending";var n=function(){e.state="suspended",e._resumeAfterSuspend&&(delete e._resumeAfterSuspend,e._autoResume())};e.ctx.suspend().then(n,n)}},3e4),e}},_autoResume:function(){var e=this;if(e.ctx&&void 0!==e.ctx.resume&&n.usingWebAudio)return"running"===e.state&&"interrupted"!==e.ctx.state&&e._suspendTimer?(clearTimeout(e._suspendTimer),e._suspendTimer=null):"suspended"===e.state||"running"===e.state&&"interrupted"===e.ctx.state?(e.ctx.resume().then(function(){e.state="running";for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("resume")}),e._suspendTimer&&(clearTimeout(e._suspendTimer),e._suspendTimer=null)):"suspending"===e.state&&(e._resumeAfterSuspend=!0),e}};var n=new e,o=function(e){var n=this;if(!e.src||0===e.src.length)return void console.error("An array of source files must be passed with any new Howl.");n.init(e)};o.prototype={init:function(e){var o=this;return n.ctx||_(),o._autoplay=e.autoplay||!1,o._format="string"!=typeof e.format?e.format:[e.format],o._html5=e.html5||!1,o._muted=e.mute||!1,o._loop=e.loop||!1,o._pool=e.pool||5,o._preload="boolean"!=typeof e.preload&&"metadata"!==e.preload||e.preload,o._rate=e.rate||1,o._sprite=e.sprite||{},o._src="string"!=typeof e.src?e.src:[e.src],o._volume=void 0!==e.volume?e.volume:1,o._xhr={method:e.xhr&&e.xhr.method?e.xhr.method:"GET",headers:e.xhr&&e.xhr.headers?e.xhr.headers:null,withCredentials:!(!e.xhr||!e.xhr.withCredentials)&&e.xhr.withCredentials},o._duration=0,o._state="unloaded",o._sounds=[],o._endTimers={},o._queue=[],o._playLock=!1,o._onend=e.onend?[{fn:e.onend}]:[],o._onfade=e.onfade?[{fn:e.onfade}]:[],o._onload=e.onload?[{fn:e.onload}]:[],o._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],o._onplayerror=e.onplayerror?[{fn:e.onplayerror}]:[],o._onpause=e.onpause?[{fn:e.onpause}]:[],o._onplay=e.onplay?[{fn:e.onplay}]:[],o._onstop=e.onstop?[{fn:e.onstop}]:[],o._onmute=e.onmute?[{fn:e.onmute}]:[],o._onvolume=e.onvolume?[{fn:e.onvolume}]:[],o._onrate=e.onrate?[{fn:e.onrate}]:[],o._onseek=e.onseek?[{fn:e.onseek}]:[],o._onunlock=e.onunlock?[{fn:e.onunlock}]:[],o._onresume=[],o._webAudio=n.usingWebAudio&&!o._html5,void 0!==n.ctx&&n.ctx&&n.autoUnlock&&n._unlockAudio(),n._howls.push(o),o._autoplay&&o._queue.push({event:"play",action:function(){o.play()}}),o._preload&&"none"!==o._preload&&o.load(),o},load:function(){var e=this,o=null;if(n.noAudio)return void e._emit("loaderror",null,"No audio support.");"string"==typeof e._src&&(e._src=[e._src]);for(var r=0;r<e._src.length;r++){var u,d;if(e._format&&e._format[r])u=e._format[r];else{if("string"!=typeof(d=e._src[r])){e._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}u=/^data:audio\/([^;,]+);/i.exec(d),u||(u=/\.([^.]+)$/.exec(d.split("?",1)[0])),u&&(u=u[1].toLowerCase())}if(u||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),u&&n.codecs(u)){o=e._src[r];break}}return o?(e._src=o,e._state="loading","https:"===window.location.protocol&&"http:"===o.slice(0,5)&&(e._html5=!0,e._webAudio=!1),new t(e),e._webAudio&&a(e),e):void e._emit("loaderror",null,"No codec support for selected audio sources.")},play:function(e,o){var t=this,r=null;if("number"==typeof e)r=e,e=null;else{if("string"==typeof e&&"loaded"===t._state&&!t._sprite[e])return null;if(void 0===e&&(e="__default",!t._playLock)){for(var a=0,u=0;u<t._sounds.length;u++)t._sounds[u]._paused&&!t._sounds[u]._ended&&(a++,r=t._sounds[u]._id);1===a?e=null:r=null}}var d=r?t._soundById(r):t._inactiveSound();if(!d)return null;if(r&&!e&&(e=d._sprite||"__default"),"loaded"!==t._state){d._sprite=e,d._ended=!1;var i=d._id;return t._queue.push({event:"play",action:function(){t.play(i)}}),i}if(r&&!d._paused)return o||t._loadQueue("play"),d._id;t._webAudio&&n._autoResume();var _=Math.max(0,d._seek>0?d._seek:t._sprite[e][0]/1e3),s=Math.max(0,(t._sprite[e][0]+t._sprite[e][1])/1e3-_),l=1e3*s/Math.abs(d._rate),c=t._sprite[e][0]/1e3,f=(t._sprite[e][0]+t._sprite[e][1])/1e3;d._sprite=e,d._ended=!1;var p=function(){d._paused=!1,d._seek=_,d._start=c,d._stop=f,d._loop=!(!d._loop&&!t._sprite[e][2])};if(_>=f)return void t._ended(d);var m=d._node;if(t._webAudio){var v=function(){t._playLock=!1,p(),t._refreshBuffer(d);var e=d._muted||t._muted?0:d._volume;m.gain.setValueAtTime(e,n.ctx.currentTime),d._playStart=n.ctx.currentTime,void 0===m.bufferSource.start?d._loop?m.bufferSource.noteGrainOn(0,_,86400):m.bufferSource.noteGrainOn(0,_,s):d._loop?m.bufferSource.start(0,_,86400):m.bufferSource.start(0,_,s),l!==1/0&&(t._endTimers[d._id]=setTimeout(t._ended.bind(t,d),l)),o||setTimeout(function(){t._emit("play",d._id),t._loadQueue()},0)};"running"===n.state&&"interrupted"!==n.ctx.state?v():(t._playLock=!0,t.once("resume",v),t._clearTimer(d._id))}else{var h=function(){m.currentTime=_,m.muted=d._muted||t._muted||n._muted||m.muted,m.volume=d._volume*n.volume(),m.playbackRate=d._rate;try{var r=m.play();if(r&&"undefined"!=typeof Promise&&(r instanceof Promise||"function"==typeof r.then)?(t._playLock=!0,p(),r.then(function(){t._playLock=!1,m._unlocked=!0,o?t._loadQueue():t._emit("play",d._id)}).catch(function(){t._playLock=!1,t._emit("playerror",d._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."),d._ended=!0,d._paused=!0})):o||(t._playLock=!1,p(),t._emit("play",d._id)),m.playbackRate=d._rate,m.paused)return void t._emit("playerror",d._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");"__default"!==e||d._loop?t._endTimers[d._id]=setTimeout(t._ended.bind(t,d),l):(t._endTimers[d._id]=function(){t._ended(d),m.removeEventListener("ended",t._endTimers[d._id],!1)},m.addEventListener("ended",t._endTimers[d._id],!1))}catch(e){t._emit("playerror",d._id,e)}};"data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"===m.src&&(m.src=t._src,m.load());var y=window&&window.ejecta||!m.readyState&&n._navigator.isCocoonJS;if(m.readyState>=3||y)h();else{t._playLock=!0,t._state="loading";var g=function(){t._state="loaded",h(),m.removeEventListener(n._canPlayEvent,g,!1)};m.addEventListener(n._canPlayEvent,g,!1),t._clearTimer(d._id)}}return d._id},pause:function(e){var n=this;if("loaded"!==n._state||n._playLock)return n._queue.push({event:"pause",action:function(){n.pause(e)}}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused&&(r._seek=n.seek(o[t]),r._rateSeek=0,r._paused=!0,n._stopFade(o[t]),r._node))if(n._webAudio){if(!r._node.bufferSource)continue;void 0===r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),n._cleanBuffer(r._node)}else isNaN(r._node.duration)&&r._node.duration!==1/0||r._node.pause();arguments[1]||n._emit("pause",r?r._id:null)}return n},stop:function(e,n){var o=this;if("loaded"!==o._state||o._playLock)return o._queue.push({event:"stop",action:function(){o.stop(e)}}),o;for(var t=o._getSoundIds(e),r=0;r<t.length;r++){o._clearTimer(t[r]);var a=o._soundById(t[r]);a&&(a._seek=a._start||0,a._rateSeek=0,a._paused=!0,a._ended=!0,o._stopFade(t[r]),a._node&&(o._webAudio?a._node.bufferSource&&(void 0===a._node.bufferSource.stop?a._node.bufferSource.noteOff(0):a._node.bufferSource.stop(0),o._cleanBuffer(a._node)):isNaN(a._node.duration)&&a._node.duration!==1/0||(a._node.currentTime=a._start||0,a._node.pause(),a._node.duration===1/0&&o._clearSound(a._node))),n||o._emit("stop",a._id))}return o},mute:function(e,o){var t=this;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"mute",action:function(){t.mute(e,o)}}),t;if(void 0===o){if("boolean"!=typeof e)return t._muted;t._muted=e}for(var r=t._getSoundIds(o),a=0;a<r.length;a++){var u=t._soundById(r[a]);u&&(u._muted=e,u._interval&&t._stopFade(u._id),t._webAudio&&u._node?u._node.gain.setValueAtTime(e?0:u._volume,n.ctx.currentTime):u._node&&(u._node.muted=!!n._muted||e),t._emit("mute",u._id))}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length||2===r.length&&void 0===r[1]){t._getSoundIds().indexOf(r[0])>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else r.length>=2&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var a;if(!(void 0!==e&&e>=0&&e<=1))return a=o?t._soundById(o):t._sounds[0],a?a._volume:0;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"volume",action:function(){t.volume.apply(t,r)}}),t;void 0===o&&(t._volume=e),o=t._getSoundIds(o);for(var u=0;u<o.length;u++)(a=t._soundById(o[u]))&&(a._volume=e,r[2]||t._stopFade(o[u]),t._webAudio&&a._node&&!a._muted?a._node.gain.setValueAtTime(e,n.ctx.currentTime):a._node&&!a._muted&&(a._node.volume=e*n.volume()),t._emit("volume",a._id));return t},fade:function(e,o,t,r){var a=this;if("loaded"!==a._state||a._playLock)return a._queue.push({event:"fade",action:function(){a.fade(e,o,t,r)}}),a;e=Math.min(Math.max(0,parseFloat(e)),1),o=Math.min(Math.max(0,parseFloat(o)),1),t=parseFloat(t),a.volume(e,r);for(var u=a._getSoundIds(r),d=0;d<u.length;d++){var i=a._soundById(u[d]);if(i){if(r||a._stopFade(u[d]),a._webAudio&&!i._muted){var _=n.ctx.currentTime,s=_+t/1e3;i._volume=e,i._node.gain.setValueAtTime(e,_),i._node.gain.linearRampToValueAtTime(o,s)}a._startFadeInterval(i,e,o,t,u[d],void 0===r)}}return a},_startFadeInterval:function(e,n,o,t,r,a){var u=this,d=n,i=o-n,_=Math.abs(i/.01),s=Math.max(4,_>0?t/_:t),l=Date.now();e._fadeTo=o,e._interval=setInterval(function(){var r=(Date.now()-l)/t;l=Date.now(),d+=i*r,d=Math.round(100*d)/100,d=i<0?Math.max(o,d):Math.min(o,d),u._webAudio?e._volume=d:u.volume(d,e._id,!0),a&&(u._volume=d),(o<n&&d<=o||o>n&&d>=o)&&(clearInterval(e._interval),e._interval=null,e._fadeTo=null,u.volume(o,e._id),u._emit("fade",e._id))},s)},_stopFade:function(e){var o=this,t=o._soundById(e);return t&&t._interval&&(o._webAudio&&t._node.gain.cancelScheduledValues(n.ctx.currentTime),clearInterval(t._interval),t._interval=null,o.volume(t._fadeTo,e),t._fadeTo=null,o._emit("fade",e)),o},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return!!(o=t._soundById(parseInt(r[0],10)))&&o._loop;e=r[0],t._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var a=t._getSoundIds(n),u=0;u<a.length;u++)(o=t._soundById(a[u]))&&(o._loop=e,t._webAudio&&o._node&&o._node.bufferSource&&(o._node.bufferSource.loop=e,e&&(o._node.bufferSource.loopStart=o._start||0,o._node.bufferSource.loopEnd=o._stop,t.playing(a[u])&&(t.pause(a[u],!0),t.play(a[u],!0)))));return t},rate:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var d;if("number"!=typeof e)return d=t._soundById(o),d?d._rate:t._rate;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"rate",action:function(){t.rate.apply(t,r)}}),t;void 0===o&&(t._rate=e),o=t._getSoundIds(o);for(var i=0;i<o.length;i++)if(d=t._soundById(o[i])){t.playing(o[i])&&(d._rateSeek=t.seek(o[i]),d._playStart=t._webAudio?n.ctx.currentTime:d._playStart),d._rate=e,t._webAudio&&d._node&&d._node.bufferSource?d._node.bufferSource.playbackRate.setValueAtTime(e,n.ctx.currentTime):d._node&&(d._node.playbackRate=e);var _=t.seek(o[i]),s=(t._sprite[d._sprite][0]+t._sprite[d._sprite][1])/1e3-_,l=1e3*s/Math.abs(d._rate);!t._endTimers[o[i]]&&d._paused||(t._clearTimer(o[i]),t._endTimers[o[i]]=setTimeout(t._ended.bind(t,d),l)),t._emit("rate",d._id)}return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)t._sounds.length&&(o=t._sounds[0]._id);else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):t._sounds.length&&(o=t._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if(void 0===o)return 0;if("number"==typeof e&&("loaded"!==t._state||t._playLock))return t._queue.push({event:"seek",action:function(){t.seek.apply(t,r)}}),t;var d=t._soundById(o);if(d){if(!("number"==typeof e&&e>=0)){if(t._webAudio){var i=t.playing(o)?n.ctx.currentTime-d._playStart:0,_=d._rateSeek?d._rateSeek-d._seek:0;return d._seek+(_+i*Math.abs(d._rate))}return d._node.currentTime}var s=t.playing(o);s&&t.pause(o,!0),d._seek=e,d._ended=!1,t._clearTimer(o),t._webAudio||!d._node||isNaN(d._node.duration)||(d._node.currentTime=e);var l=function(){s&&t.play(o,!0),t._emit("seek",o)};if(s&&!t._webAudio){var c=function(){t._playLock?setTimeout(c,0):l()};setTimeout(c,0)}else l()}return t},playing:function(e){var n=this;if("number"==typeof e){var o=n._soundById(e);return!!o&&!o._paused}for(var t=0;t<n._sounds.length;t++)if(!n._sounds[t]._paused)return!0;return!1},duration:function(e){var n=this,o=n._duration,t=n._soundById(e);return t&&(o=n._sprite[t._sprite][1]/1e3),o},state:function(){return this._state},unload:function(){for(var e=this,o=e._sounds,t=0;t<o.length;t++)o[t]._paused||e.stop(o[t]._id),e._webAudio||(e._clearSound(o[t]._node),o[t]._node.removeEventListener("error",o[t]._errorFn,!1),o[t]._node.removeEventListener(n._canPlayEvent,o[t]._loadFn,!1),o[t]._node.removeEventListener("ended",o[t]._endFn,!1),n._releaseHtml5Audio(o[t]._node)),delete o[t]._node,e._clearTimer(o[t]._id);var a=n._howls.indexOf(e);a>=0&&n._howls.splice(a,1);var u=!0;for(t=0;t<n._howls.length;t++)if(n._howls[t]._src===e._src||e._src.indexOf(n._howls[t]._src)>=0){u=!1;break}return r&&u&&delete r[e._src],n.noAudio=!1,e._state="unloaded",e._sounds=[],e=null,null},on:function(e,n,o,t){var r=this,a=r["_on"+e];return"function"==typeof n&&a.push(t?{id:o,fn:n,once:t}:{id:o,fn:n}),r},off:function(e,n,o){var t=this,r=t["_on"+e],a=0;if("number"==typeof n&&(o=n,n=null),n||o)for(a=0;a<r.length;a++){var u=o===r[a].id;if(n===r[a].fn&&u||!n&&u){r.splice(a,1);break}}else if(e)t["_on"+e]=[];else{var d=Object.keys(t);for(a=0;a<d.length;a++)0===d[a].indexOf("_on")&&Array.isArray(t[d[a]])&&(t[d[a]]=[])}return t},once:function(e,n,o){var t=this;return t.on(e,n,o,1),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],a=r.length-1;a>=0;a--)r[a].id&&r[a].id!==n&&"load"!==e||(setTimeout(function(e){e.call(this,n,o)}.bind(t,r[a].fn),0),r[a].once&&t.off(e,r[a].fn,r[a].id));return t._loadQueue(e),t},_loadQueue:function(e){var n=this;if(n._queue.length>0){var o=n._queue[0];o.event===e&&(n._queue.shift(),n._loadQueue()),e||o.action()}return n},_ended:function(e){var o=this,t=e._sprite;if(!o._webAudio&&e._node&&!e._node.paused&&!e._node.ended&&e._node.currentTime<e._stop)return setTimeout(o._ended.bind(o,e),100),o;var r=!(!e._loop&&!o._sprite[t][2]);if(o._emit("end",e._id),!o._webAudio&&r&&o.stop(e._id,!0).play(e._id),o._webAudio&&r){o._emit("play",e._id),e._seek=e._start||0,e._rateSeek=0,e._playStart=n.ctx.currentTime;var a=1e3*(e._stop-e._start)/Math.abs(e._rate);o._endTimers[e._id]=setTimeout(o._ended.bind(o,e),a)}return o._webAudio&&!r&&(e._paused=!0,e._ended=!0,e._seek=e._start||0,e._rateSeek=0,o._clearTimer(e._id),o._cleanBuffer(e._node),n._autoSuspend()),o._webAudio||r||o.stop(e._id,!0),o},_clearTimer:function(e){var n=this;if(n._endTimers[e]){if("function"!=typeof n._endTimers[e])clearTimeout(n._endTimers[e]);else{var o=n._soundById(e);o&&o._node&&o._node.removeEventListener("ended",n._endTimers[e],!1)}delete n._endTimers[e]}return n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new t(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(o<=n)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--)}}},_getSoundIds:function(e){var n=this;if(void 0===e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return[e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.ctx.createBufferSource(),e._node.bufferSource.buffer=r[o._src],e._panner?e._node.bufferSource.connect(e._panner):e._node.bufferSource.connect(e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop||0),e._node.bufferSource.playbackRate.setValueAtTime(e._rate,n.ctx.currentTime),o},_cleanBuffer:function(e){var o=this,t=n._navigator&&n._navigator.vendor.indexOf("Apple")>=0;if(!e.bufferSource)return o;if(n._scratchBuffer&&e.bufferSource&&(e.bufferSource.onended=null,e.bufferSource.disconnect(0),t))try{e.bufferSource.buffer=n._scratchBuffer}catch(e){}return e.bufferSource=null,o},_clearSound:function(e){/MSIE |Trident\//.test(n._navigator&&n._navigator.userAgent)||(e.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")}};var t=function(e){this._parent=e,this.init()};t.prototype={init:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,o._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=n._muted||e._muted||e._parent._muted?0:e._volume;return o._webAudio?(e._node=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),e._node.gain.setValueAtTime(t,n.ctx.currentTime),e._node.paused=!0,e._node.connect(n.masterGain)):n.noAudio||(e._node=n._obtainHtml5Audio(),e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener(n._canPlayEvent,e._loadFn,!1),e._endFn=e._endListener.bind(e),e._node.addEventListener("ended",e._endFn,!1),e._node.src=o._src,e._node.preload=!0===o._preload?"auto":o._preload,e._node.volume=t*n.volume(),e._node.load()),e},reset:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._rateSeek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,e},_errorListener:function(){var e=this;e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorFn,!1)},_loadListener:function(){var e=this,o=e._parent;o._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(o._sprite).length&&(o._sprite={__default:[0,1e3*o._duration]}),"loaded"!==o._state&&(o._state="loaded",o._emit("load"),o._loadQueue()),e._node.removeEventListener(n._canPlayEvent,e._loadFn,!1)},_endListener:function(){var e=this,n=e._parent;n._duration===1/0&&(n._duration=Math.ceil(10*e._node.duration)/10,n._sprite.__default[1]===1/0&&(n._sprite.__default[1]=1e3*n._duration),n._ended(e)),e._node.removeEventListener("ended",e._endFn,!1)}};var r={},a=function(e){var n=e._src;if(r[n])return e._duration=r[n].duration,void i(e);if(/^data:[^;]+;base64,/.test(n)){for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),a=0;a<o.length;++a)t[a]=o.charCodeAt(a);d(t.buffer,e)}else{var _=new XMLHttpRequest;_.open(e._xhr.method,n,!0),_.withCredentials=e._xhr.withCredentials,_.responseType="arraybuffer",e._xhr.headers&&Object.keys(e._xhr.headers).forEach(function(n){_.setRequestHeader(n,e._xhr.headers[n])}),_.onload=function(){var n=(_.status+"")[0];if("0"!==n&&"2"!==n&&"3"!==n)return void e._emit("loaderror",null,"Failed loading audio file with status: "+_.status+".");d(_.response,e)},_.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete r[n],e.load())},u(_)}},u=function(e){try{e.send()}catch(n){e.onerror()}},d=function(e,o){var t=function(){o._emit("loaderror",null,"Decoding audio data failed.")},a=function(e){e&&o._sounds.length>0?(r[o._src]=e,i(o,e)):t()};"undefined"!=typeof Promise&&1===n.ctx.decodeAudioData.length?n.ctx.decodeAudioData(e).then(a).catch(t):n.ctx.decodeAudioData(e,a,t)},i=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue())},_=function(){if(n.usingWebAudio){try{"undefined"!=typeof AudioContext?n.ctx=new AudioContext:"undefined"!=typeof webkitAudioContext?n.ctx=new webkitAudioContext:n.usingWebAudio=!1}catch(e){n.usingWebAudio=!1}n.ctx||(n.usingWebAudio=!1);var e=/iP(hone|od|ad)/.test(n._navigator&&n._navigator.platform),o=n._navigator&&n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),t=o?parseInt(o[1],10):null;if(e&&t&&t<9){var r=/safari/.test(n._navigator&&n._navigator.userAgent.toLowerCase());n._navigator&&!r&&(n.usingWebAudio=!1)}n.usingWebAudio&&(n.masterGain=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),n.masterGain.gain.setValueAtTime(n._muted?0:n._volume,n.ctx.currentTime),n.masterGain.connect(n.ctx.destination)),n._setup()}};"function"==typeof define&&define.amd&&define([],function(){return{Howler:n,Howl:o}}),"undefined"!=typeof exports&&(exports.Howler=n,exports.Howl=o),"undefined"!=typeof global?(global.HowlerGlobal=e,global.Howler=n,global.Howl=o,global.Sound=t):"undefined"!=typeof window&&(window.HowlerGlobal=e,window.Howler=n,window.Howl=o,window.Sound=t)}();
/*! Spatial Plugin */
!function(){"use strict";HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(e){var n=this;if(!n.ctx||!n.ctx.listener)return n;for(var t=n._howls.length-1;t>=0;t--)n._howls[t].stereo(e);return n},HowlerGlobal.prototype.pos=function(e,n,t){var r=this;return r.ctx&&r.ctx.listener?(n="number"!=typeof n?r._pos[1]:n,t="number"!=typeof t?r._pos[2]:t,"number"!=typeof e?r._pos:(r._pos=[e,n,t],void 0!==r.ctx.listener.positionX?(r.ctx.listener.positionX.setTargetAtTime(r._pos[0],Howler.ctx.currentTime,.1),r.ctx.listener.positionY.setTargetAtTime(r._pos[1],Howler.ctx.currentTime,.1),r.ctx.listener.positionZ.setTargetAtTime(r._pos[2],Howler.ctx.currentTime,.1)):r.ctx.listener.setPosition(r._pos[0],r._pos[1],r._pos[2]),r)):r},HowlerGlobal.prototype.orientation=function(e,n,t,r,o,i){var a=this;if(!a.ctx||!a.ctx.listener)return a;var p=a._orientation;return n="number"!=typeof n?p[1]:n,t="number"!=typeof t?p[2]:t,r="number"!=typeof r?p[3]:r,o="number"!=typeof o?p[4]:o,i="number"!=typeof i?p[5]:i,"number"!=typeof e?p:(a._orientation=[e,n,t,r,o,i],void 0!==a.ctx.listener.forwardX?(a.ctx.listener.forwardX.setTargetAtTime(e,Howler.ctx.currentTime,.1),a.ctx.listener.forwardY.setTargetAtTime(n,Howler.ctx.currentTime,.1),a.ctx.listener.forwardZ.setTargetAtTime(t,Howler.ctx.currentTime,.1),a.ctx.listener.upX.setTargetAtTime(r,Howler.ctx.currentTime,.1),a.ctx.listener.upY.setTargetAtTime(o,Howler.ctx.currentTime,.1),a.ctx.listener.upZ.setTargetAtTime(i,Howler.ctx.currentTime,.1)):a.ctx.listener.setOrientation(e,n,t,r,o,i),a)},Howl.prototype.init=function(e){return function(n){var t=this;return t._orientation=n.orientation||[1,0,0],t._stereo=n.stereo||null,t._pos=n.pos||null,t._pannerAttr={coneInnerAngle:void 0!==n.coneInnerAngle?n.coneInnerAngle:360,coneOuterAngle:void 0!==n.coneOuterAngle?n.coneOuterAngle:360,coneOuterGain:void 0!==n.coneOuterGain?n.coneOuterGain:0,distanceModel:void 0!==n.distanceModel?n.distanceModel:"inverse",maxDistance:void 0!==n.maxDistance?n.maxDistance:1e4,panningModel:void 0!==n.panningModel?n.panningModel:"HRTF",refDistance:void 0!==n.refDistance?n.refDistance:1,rolloffFactor:void 0!==n.rolloffFactor?n.rolloffFactor:1},t._onstereo=n.onstereo?[{fn:n.onstereo}]:[],t._onpos=n.onpos?[{fn:n.onpos}]:[],t._onorientation=n.onorientation?[{fn:n.onorientation}]:[],e.call(this,n)}}(Howl.prototype.init),Howl.prototype.stereo=function(n,t){var r=this;if(!r._webAudio)return r;if("loaded"!==r._state)return r._queue.push({event:"stereo",action:function(){r.stereo(n,t)}}),r;var o=void 0===Howler.ctx.createStereoPanner?"spatial":"stereo";if(void 0===t){if("number"!=typeof n)return r._stereo;r._stereo=n,r._pos=[n,0,0]}for(var i=r._getSoundIds(t),a=0;a<i.length;a++){var p=r._soundById(i[a]);if(p){if("number"!=typeof n)return p._stereo;p._stereo=n,p._pos=[n,0,0],p._node&&(p._pannerAttr.panningModel="equalpower",p._panner&&p._panner.pan||e(p,o),"spatial"===o?void 0!==p._panner.positionX?(p._panner.positionX.setValueAtTime(n,Howler.ctx.currentTime),p._panner.positionY.setValueAtTime(0,Howler.ctx.currentTime),p._panner.positionZ.setValueAtTime(0,Howler.ctx.currentTime)):p._panner.setPosition(n,0,0):p._panner.pan.setValueAtTime(n,Howler.ctx.currentTime)),r._emit("stereo",p._id)}}return r},Howl.prototype.pos=function(n,t,r,o){var i=this;if(!i._webAudio)return i;if("loaded"!==i._state)return i._queue.push({event:"pos",action:function(){i.pos(n,t,r,o)}}),i;if(t="number"!=typeof t?0:t,r="number"!=typeof r?-.5:r,void 0===o){if("number"!=typeof n)return i._pos;i._pos=[n,t,r]}for(var a=i._getSoundIds(o),p=0;p<a.length;p++){var s=i._soundById(a[p]);if(s){if("number"!=typeof n)return s._pos;s._pos=[n,t,r],s._node&&(s._panner&&!s._panner.pan||e(s,"spatial"),void 0!==s._panner.positionX?(s._panner.positionX.setValueAtTime(n,Howler.ctx.currentTime),s._panner.positionY.setValueAtTime(t,Howler.ctx.currentTime),s._panner.positionZ.setValueAtTime(r,Howler.ctx.currentTime)):s._panner.setPosition(n,t,r)),i._emit("pos",s._id)}}return i},Howl.prototype.orientation=function(n,t,r,o){var i=this;if(!i._webAudio)return i;if("loaded"!==i._state)return i._queue.push({event:"orientation",action:function(){i.orientation(n,t,r,o)}}),i;if(t="number"!=typeof t?i._orientation[1]:t,r="number"!=typeof r?i._orientation[2]:r,void 0===o){if("number"!=typeof n)return i._orientation;i._orientation=[n,t,r]}for(var a=i._getSoundIds(o),p=0;p<a.length;p++){var s=i._soundById(a[p]);if(s){if("number"!=typeof n)return s._orientation;s._orientation=[n,t,r],s._node&&(s._panner||(s._pos||(s._pos=i._pos||[0,0,-.5]),e(s,"spatial")),void 0!==s._panner.orientationX?(s._panner.orientationX.setValueAtTime(n,Howler.ctx.currentTime),s._panner.orientationY.setValueAtTime(t,Howler.ctx.currentTime),s._panner.orientationZ.setValueAtTime(r,Howler.ctx.currentTime)):s._panner.setOrientation(n,t,r)),i._emit("orientation",s._id)}}return i},Howl.prototype.pannerAttr=function(){var n,t,r,o=this,i=arguments;if(!o._webAudio)return o;if(0===i.length)return o._pannerAttr;if(1===i.length){if("object"!=typeof i[0])return r=o._soundById(parseInt(i[0],10)),r?r._pannerAttr:o._pannerAttr;n=i[0],void 0===t&&(n.pannerAttr||(n.pannerAttr={coneInnerAngle:n.coneInnerAngle,coneOuterAngle:n.coneOuterAngle,coneOuterGain:n.coneOuterGain,distanceModel:n.distanceModel,maxDistance:n.maxDistance,refDistance:n.refDistance,rolloffFactor:n.rolloffFactor,panningModel:n.panningModel}),o._pannerAttr={coneInnerAngle:void 0!==n.pannerAttr.coneInnerAngle?n.pannerAttr.coneInnerAngle:o._coneInnerAngle,coneOuterAngle:void 0!==n.pannerAttr.coneOuterAngle?n.pannerAttr.coneOuterAngle:o._coneOuterAngle,coneOuterGain:void 0!==n.pannerAttr.coneOuterGain?n.pannerAttr.coneOuterGain:o._coneOuterGain,distanceModel:void 0!==n.pannerAttr.distanceModel?n.pannerAttr.distanceModel:o._distanceModel,maxDistance:void 0!==n.pannerAttr.maxDistance?n.pannerAttr.maxDistance:o._maxDistance,refDistance:void 0!==n.pannerAttr.refDistance?n.pannerAttr.refDistance:o._refDistance,rolloffFactor:void 0!==n.pannerAttr.rolloffFactor?n.pannerAttr.rolloffFactor:o._rolloffFactor,panningModel:void 0!==n.pannerAttr.panningModel?n.pannerAttr.panningModel:o._panningModel})}else 2===i.length&&(n=i[0],t=parseInt(i[1],10));for(var a=o._getSoundIds(t),p=0;p<a.length;p++)if(r=o._soundById(a[p])){var s=r._pannerAttr;s={coneInnerAngle:void 0!==n.coneInnerAngle?n.coneInnerAngle:s.coneInnerAngle,coneOuterAngle:void 0!==n.coneOuterAngle?n.coneOuterAngle:s.coneOuterAngle,coneOuterGain:void 0!==n.coneOuterGain?n.coneOuterGain:s.coneOuterGain,distanceModel:void 0!==n.distanceModel?n.distanceModel:s.distanceModel,maxDistance:void 0!==n.maxDistance?n.maxDistance:s.maxDistance,refDistance:void 0!==n.refDistance?n.refDistance:s.refDistance,rolloffFactor:void 0!==n.rolloffFactor?n.rolloffFactor:s.rolloffFactor,panningModel:void 0!==n.panningModel?n.panningModel:s.panningModel};var c=r._panner;c||(r._pos||(r._pos=o._pos||[0,0,-.5]),e(r,"spatial"),c=r._panner),c.coneInnerAngle=s.coneInnerAngle,c.coneOuterAngle=s.coneOuterAngle,c.coneOuterGain=s.coneOuterGain,c.distanceModel=s.distanceModel,c.maxDistance=s.maxDistance,c.refDistance=s.refDistance,c.rolloffFactor=s.rolloffFactor,c.panningModel=s.panningModel}return o},Sound.prototype.init=function(e){return function(){var n=this,t=n._parent;n._orientation=t._orientation,n._stereo=t._stereo,n._pos=t._pos,n._pannerAttr=t._pannerAttr,e.call(this),n._stereo?t.stereo(n._stereo):n._pos&&t.pos(n._pos[0],n._pos[1],n._pos[2],n._id)}}(Sound.prototype.init),Sound.prototype.reset=function(e){return function(){var n=this,t=n._parent;return n._orientation=t._orientation,n._stereo=t._stereo,n._pos=t._pos,n._pannerAttr=t._pannerAttr,n._stereo?t.stereo(n._stereo):n._pos?t.pos(n._pos[0],n._pos[1],n._pos[2],n._id):n._panner&&(n._panner.disconnect(0),n._panner=void 0,t._refreshBuffer(n)),e.call(this)}}(Sound.prototype.reset);var e=function(e,n){n=n||"spatial","spatial"===n?(e._panner=Howler.ctx.createPanner(),e._panner.coneInnerAngle=e._pannerAttr.coneInnerAngle,e._panner.coneOuterAngle=e._pannerAttr.coneOuterAngle,e._panner.coneOuterGain=e._pannerAttr.coneOuterGain,e._panner.distanceModel=e._pannerAttr.distanceModel,e._panner.maxDistance=e._pannerAttr.maxDistance,e._panner.refDistance=e._pannerAttr.refDistance,e._panner.rolloffFactor=e._pannerAttr.rolloffFactor,e._panner.panningModel=e._pannerAttr.panningModel,void 0!==e._panner.positionX?(e._panner.positionX.setValueAtTime(e._pos[0],Howler.ctx.currentTime),e._panner.positionY.setValueAtTime(e._pos[1],Howler.ctx.currentTime),e._panner.positionZ.setValueAtTime(e._pos[2],Howler.ctx.currentTime)):e._panner.setPosition(e._pos[0],e._pos[1],e._pos[2]),void 0!==e._panner.orientationX?(e._panner.orientationX.setValueAtTime(e._orientation[0],Howler.ctx.currentTime),e._panner.orientationY.setValueAtTime(e._orientation[1],Howler.ctx.currentTime),e._panner.orientationZ.setValueAtTime(e._orientation[2],Howler.ctx.currentTime)):e._panner.setOrientation(e._orientation[0],e._orientation[1],e._orientation[2])):(e._panner=Howler.ctx.createStereoPanner(),e._panner.pan.setValueAtTime(e._stereo,Howler.ctx.currentTime)),e._panner.connect(e._node),e._paused||e._parent.pause(e._id,!0).play(e._id,!0)}}();var emitter = {
    events: {},
    publish: function publish(event, data) {
        if (this.events.hasOwnProperty(event)) this.events[event].forEach(function(listener) {
            return listener(data);
        });
    },
    subscribe: function subscribe(event, listener) {
        if (!this.events.hasOwnProperty(event)) this.events[event] = [];
        this.events[event].push(listener);
        return {
            unsubscribe: (function() {
                var index = this.events[event].indexOf(listener);
                if (-1 !== index) this.events[event].splice(index, 1);
            }).bind(this)
        };
    }
};
var EVENTS = {
    CONNECT: {
        NATIVE: "gamepadconnected",
        ALIAS: "connect"
    },
    DISCONNECT: {
        NATIVE: "gamepaddisconnected",
        ALIAS: "disconnect"
    },
    BUTTON_PRESS: {
        NATIVE: null,
        ALIAS: "button_press"
    },
    BUTTON_RELEASE: {
        NATIVE: null,
        ALIAS: "button_release"
    },
    AXIS_MOVEMENT: {
        NATIVE: null,
        ALIAS: "axis_move"
    }
};
var STICKS = {
    LEFT: {
        NAME: "left_stick",
        AXES: {
            X: 0,
            Y: 1
        }
    },
    RIGHT: {
        NAME: "right_stick",
        AXES: {
            X: 2,
            Y: 3
        }
    }
};
var DIRECTIONS = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom"
};
var BUTTON_MAPPING = {
    button_0: 0,
    button_1: 1,
    button_2: 2,
    button_3: 3,
    button_4: 4,
    button_5: 5,
    button_6: 6,
    button_7: 7,
    button_8: 8,
    button_9: 9,
    button_10: 10,
    button_11: 11,
    button_12: 12,
    button_13: 13,
    button_14: 14,
    button_15: 15,
    button_16: 16,
    button_17: 17
};
var AXIS_MOVEMENT_THRESHOLD = 0.8;
var log = function(message) {
    if (console.warn && "function" == typeof console.warn) console.warn(message);
    else console.log(message);
};
var findButtonMapping = function(index, mapping) {
    var results = [];
    Object.keys(mapping).forEach(function(key) {
        if (mapping[key] === index) results.push(key);
        else if (Array.isArray(mapping[key]) && -1 !== mapping[key].indexOf(index)) results.push(key);
    });
    return results;
};
var hasVibrationSupport = function(vibrationActuator) {
    return !!vibrationActuator && !!vibrationActuator.type && !!vibrationActuator.playEffect && "function" == typeof vibrationActuator.playEffect || false;
};
var hasGamepadApiSupport = function() {
    return !!window.navigator.getGamepads && "function" == typeof window.navigator.getGamepads || false;
};
var joypad = {
    loopStarted: false,
    instances: {},
    buttonEvents: {
        joypad: []
    },
    settings: {
        axisMovementThreshold: AXIS_MOVEMENT_THRESHOLD
    },
    remove: function remove(index) {
        return delete this.instances[index];
    },
    on: function on(event, callback) {
        switch(event){
            case EVENTS.CONNECT.ALIAS:
                return emitter.subscribe(EVENTS.CONNECT.ALIAS, callback);
            case EVENTS.DISCONNECT.ALIAS:
                return emitter.subscribe(EVENTS.DISCONNECT.ALIAS, callback);
            case EVENTS.BUTTON_PRESS.ALIAS:
                return emitter.subscribe(EVENTS.BUTTON_PRESS.ALIAS, callback);
            case EVENTS.BUTTON_RELEASE.ALIAS:
                return emitter.subscribe(EVENTS.BUTTON_RELEASE.ALIAS, callback);
            case EVENTS.AXIS_MOVEMENT.ALIAS:
                return emitter.subscribe(EVENTS.AXIS_MOVEMENT.ALIAS, callback);
        }
    },
    vibrate: function vibrate(gamepadInstance, options) {
        var vibrationActuator = gamepadInstance.vibrationActuator;
        var vibrationSettings = options ? options : this.settings.vibration;
        if (hasVibrationSupport(vibrationActuator)) {
            var type = vibrationActuator.type;
            return gamepadInstance.vibrationActuator.playEffect(type, vibrationSettings);
        }
        log("No vibration actuator interface found - https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator");
    },
    set: function set(settings) {
        var axisMovementThreshold = settings.axisMovementThreshold, vibration = settings.vibration, customButtonMapping = settings.customButtonMapping;
        var parsedValue = parseFloat(axisMovementThreshold);
        if (!isNaN(parsedValue)) this.settings.axisMovementThreshold = parsedValue;
        this.settings.vibration = vibration;
        this.settings.customButtonMapping = customButtonMapping;
    },
    trigger: function trigger(event, data) {
        return emitter.publish(event, data);
    }
};
var listenToButtonEvents = function(gamepad) {
    gamepad.buttons.forEach(function(button, index) {
        var customButtonMapping = joypad.settings.customButtonMapping;
        var buttonMapping = customButtonMapping ? customButtonMapping : BUTTON_MAPPING;
        var keys = findButtonMapping(index, buttonMapping);
        var buttonEvents = joypad.buttonEvents;
        if (keys && keys.length) keys.forEach(function(key) {
            if (button.pressed) {
                if (!buttonEvents.joypad[gamepad.index][key]) buttonEvents.joypad[gamepad.index][key] = {
                    pressed: true,
                    hold: false,
                    released: false
                };
                buttonEvents.joypad[gamepad.index][key].button = button;
                buttonEvents.joypad[gamepad.index][key].index = index;
                buttonEvents.joypad[gamepad.index][key].gamepad = gamepad;
            } else if (!button.pressed && buttonEvents.joypad[gamepad.index][key]) {
                buttonEvents.joypad[gamepad.index][key].released = true;
                buttonEvents.joypad[gamepad.index][key].hold = false;
            }
        });
    });
};
var listenToAxisMovements = function(gamepad) {
    var axisMovementEvent = function(eventData) {
        return new CustomEvent(EVENTS.AXIS_MOVEMENT.ALIAS, {
            detail: eventData
        });
    };
    var axisMovementThreshold = joypad.settings.axisMovementThreshold;
    var axes = gamepad.axes;
    var totalAxisIndexes = axes.length;
    var totalSticks = totalAxisIndexes / 2;
    axes.forEach(function(axis, index) {
        if (Math.abs(axis) > axisMovementThreshold) {
            var stickMoved = null;
            var directionOfMovement = null;
            var axisMovementValue = axis;
            stickMoved = index < totalSticks ? STICKS.LEFT.NAME : STICKS.RIGHT.NAME;
            if (index === STICKS.LEFT.AXES.X || index === STICKS.RIGHT.AXES.X) directionOfMovement = axis < 0 ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
            if (index === STICKS.LEFT.AXES.Y || index === STICKS.RIGHT.AXES.Y) directionOfMovement = axis < 0 ? DIRECTIONS.TOP : DIRECTIONS.BOTTOM;
            var eventData = {
                gamepad: gamepad,
                totalSticks: totalSticks,
                stickMoved: stickMoved,
                directionOfMovement: directionOfMovement,
                axisMovementValue: axisMovementValue,
                axis: index
            };
            return window.dispatchEvent(axisMovementEvent(eventData));
        }
    });
};
var handleButtonEvent = function(buttonName, buttonEvents) {
    if (buttonEvents[buttonName].pressed) {
        dispatchCustomEvent(EVENTS.BUTTON_PRESS.ALIAS, buttonEvents, buttonName);
        buttonEvents[buttonName].pressed = false;
        buttonEvents[buttonName].hold = true;
        buttonEvents[buttonName].last_event = EVENTS.BUTTON_PRESS.ALIAS;
    } else if (buttonEvents[buttonName].hold) {}
    else if (buttonEvents[buttonName].released && buttonEvents[buttonName].last_event === EVENTS.BUTTON_PRESS.ALIAS) {
        dispatchCustomEvent(EVENTS.BUTTON_RELEASE.ALIAS, buttonEvents, buttonName);
        delete buttonEvents[buttonName];
    }
};
var loop = {
    id: null,
    start: function start() {
        var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
        var buttonEvents = joypad.buttonEvents;
        var gamepads = window.navigator.getGamepads();
        gamepads = Array.prototype.slice.call(gamepads);
        gamepads.forEach(function(gamepad, index) {
            if (gamepad) {
                if (!buttonEvents.joypad[index]) buttonEvents.joypad[index] = {};
                joypad.instances[index] = gamepad;
                listenToButtonEvents(gamepad);
                listenToAxisMovements(gamepad);
            }
        });
        buttonEvents.joypad.forEach(function(events) {
            if (events) Object.keys(events).forEach(function(key) {
                handleButtonEvent(key, events);
            });
        });
        this.id = requestAnimationFrame(this.start.bind(this));
    },
    stop: function stop(id) {
        var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
        return cancelAnimationFrame(id);
    }
};
var initEventListeners = function() {
    window.addEventListener(EVENTS.CONNECT.NATIVE, function(e) {
        emitter.publish(EVENTS.CONNECT.ALIAS, e);
        if (!joypad.loopStarted) {
            joypad.loopStarted = true;
            return loop.start();
        }
    });
    window.addEventListener(EVENTS.DISCONNECT.NATIVE, function(e) {
        emitter.publish(EVENTS.DISCONNECT.ALIAS, e);
        joypad.remove(e.gamepad.index);
        joypad.buttonEvents.joypad[e.gamepad.index] = null;
        if (!Object.keys(joypad.instances).length) {
            joypad.loopStarted = false;
            return loop.stop(loop.id);
        }
    });
    window.addEventListener(EVENTS.BUTTON_PRESS.ALIAS, function(e) {
        return emitter.publish(EVENTS.BUTTON_PRESS.ALIAS, e);
    });
    window.addEventListener(EVENTS.BUTTON_RELEASE.ALIAS, function(e) {
        return emitter.publish(EVENTS.BUTTON_RELEASE.ALIAS, e);
    });
    window.addEventListener(EVENTS.AXIS_MOVEMENT.ALIAS, function(e) {
        return emitter.publish(EVENTS.AXIS_MOVEMENT.ALIAS, e);
    });
};
var dispatchCustomEvent = function(eventName, buttonEvents, buttonName) {
    var joypadEvent = function(eventData) {
        return new CustomEvent(eventName, {
            detail: eventData
        });
    };
    var _buttonEvents_buttonName = buttonEvents[buttonName], index = _buttonEvents_buttonName.index, gamepad = _buttonEvents_buttonName.gamepad;
    var eventData = {
        buttonName: buttonName,
        button: buttonEvents[buttonName].button,
        index: index,
        gamepad: gamepad
    };
    window.dispatchEvent(joypadEvent(eventData));
};
initEventListeners();
if (hasGamepadApiSupport()) window.joypad = joypad;
else {
    window.joypad = {};
    log("Your browser does not support the Gamepad API - https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API");
}
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {

	Date.now = function () {

		return new Date().valueOf();

	};

}

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '14',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			if ( _tweens.length === 0 ) return false;

			var i = 0;

			time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

			while ( i < _tweens.length ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		_isPlaying = false;

		if ( _onStopCallback !== null ) {

			_onStopCallback.call( _object );

		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

			_chainedTweens[ i ].stop();

		}

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.yoyo = function( yoyo ) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function ( callback ) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		var property;

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
				if ( typeof(end) === "number" ) {
					_object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[ property ];
						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

};
// gamepad detection in Chrome
//var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

var EMPTY = 0,
    WALL = 1,
    DIAMOND = 2,
    DOOR = 3,
    ONEWAY_UP = 4,
    ONEWAY_RIGHT = 5,
    ONEWAY_DOWN = 6,
    ONEWAY_LEFT = 7,
    CYCLE_VER = 8,
    CYCLE_HOR = 9,
    CORNER_UP = 10,
    CORNER_RIGHT = 11,
    CORNER_DOWN = 12,
    CORNER_LEFT = 13,
    ONE_STAND = 14,
    MOVABLE = 15,


    WALK_UP = 0,
    WALK_RIGHT = 90,
    WALK_DOWN = 180,
    WALK_LEFT = 270,

    KEY_ESC = 27,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    KEY_R = 82,
    KEY_D = 68,
    KEY_SPACE = 32,

    GAMESTATE_CURRENT,
    GAMESTATE_STARTSCREEN = 1,
    GAMESTATE_LEVELSCREEN = 2,
    GAMESTATE_GAMESCREEN = 3,
    GAMESTATE_FINALSCREEN = 4,
    GAMESTATE_ABOUTSCREEN = 5,
    GAMESTATE_EMHSCREEN = 6;
function AudioProxy(opt) {
    this.audio = null
    this.url = opt.url || ''
    this.volume = opt.volume || 1
}

AudioProxy.prototype.play = function () {
    if (this.audio === null) {
        this.init()
    }

    this.audio.play()
}

AudioProxy.prototype.init = function () {
    // use Howl to get rid of the promise audio problems
    this.audio = new Howl({
        src: [this.url],
        volume: this.volume
    })
}
let can,
    ctx,
    bcan,
    bctx,
    map,
    diamondCounter,
    points = 0,
    sumpoints = 0,
    counter,
    player,
    welldone,
    levelCounter = 0,
    currentlevel,
    currenttheme,
    door,
    editorLevel,
    gamepad = null,
    gamePadEvents = null,

//audio
    walk,
    digg,
    rotate,
    lock,
    opendoor,
    diamond,
    success,
    sfxback,
    playerVoice,
    btnSound,
    btnTick,

// atlases
    atlasUI,
    atlasGame,

// screen stuff
    title,
    riamond,
    textriamond,
    textrush,

    emitterScreen,
    emitterPlayer,

    finalScreenBack,
    gameTitle,
    aboutScreenBack,
    levelScreenBack,
    btnGroupStart,
    btnAbout,
    btnPlay,
    btnBackToStartScreen,
    btnIngameMenu,
    btnIngameRestart,
    btnIngameDigg,
    btnEasy,
    btnMedium,
    btnHard,
    btnFB,
    btnTW

//levelselect
emhSelectOffset = 0;


function Atlas(pathToTPData, tpFileName) {

    this.image = new Image()

    this.path = pathToTPData
    this.file = tpFileName
    this.tpData = false
    this.loadTexturePacker(pathToTPData + tpFileName)
}


Atlas.prototype.loadTexturePacker = function (path) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send(null);
    if ((xhr.status === 200) || (xhr.status === 0)) {
        this.tpData = JSON.parse(xhr.responseText)

        this.image.src = this.path + this.tpData.meta.image
    }
}

Atlas.prototype.getPicByName = function (picname) {
    for (var i = 0, l = this.tpData.frames.length; i < l; i++) {

        var name = this.tpData.frames[i].filename.split('.')[0]

        if (name === picname) {
            return this.tpData.frames[i]
        }
    }
    throw "Image name not found in atlas: " + picname
}

function Bitmap (opt) {
    opt = opt || {}

    this.x = opt.x || can.width / 2
    this.y = opt.y || can.height / 2

    this.width = opt.width || can.width
    this.height = opt.height || can.height

    this.canvas = document.createElement('canvas')
    this.canvas.height = this.height
    this.canvas.width = this.width

    this.ctx = this.canvas.getContext('2d', {antialias: true})

}


Bitmap.prototype.update = function () {

}


Bitmap.prototype.draw = function () {
    bctx.save()
    bctx.translate(this.x, this.y)
    bctx.drawImage(this.canvas, (this.canvas.width / 2) * -1, (this.canvas.height / 2) * -1)
    bctx.restore()
}


function BitmapFont(opt) {

    opt = opt || {}

    this.ctx = opt.ctx || ctx
    this.atlas = new Image()
    this.fontFile = ''
    this.chars = new Array(256)
    this.x = new Array(256)
    this.y = new Array(256)
    this.width = new Array(256)
    this.height = new Array(256)
    this.xoff = new Array(256)
    this.yoff = new Array(256)
    this.xadv = new Array(256)
    this.lineHeight = 0
    this.face = ''
    this.size = 0
    this.bold = 0
    this.italic = 0
    this.base = 0
    this.scaleW = 0
    this.scaleH = 0
    this.text = ''
    this.currentX = 0
    this.currentY = 0
    this.font = ''
    return this
}

BitmapFont.prototype.update = function () {
    throw {
        name: 'Font Error',
        message: 'TODO, not defined yet.'
    }
}

BitmapFont.prototype.draw = function () {
    throw {
        name: 'Font Error',
        message: 'TODO, not defined yet.'
    }
}

Bitmap.prototype.setCtx = function (ctx) {
    this.ctx = ctx
}

BitmapFont.prototype.drawText = function (opt) {

    var currCtx = this.ctx
    if (opt.drawCtx) {
        currCtx = opt.drawCtx
    }
    this.text = opt.text
    this.currentX = opt.xpos
    this.currentY = opt.ypos

    for (var i = 0, l = this.text.length; i < l; i++) {
        var charCode = this.text.charCodeAt(i)
        try {
            currCtx.drawImage(
                this.atlas,
                this.x[charCode],
                this.y[charCode],
                this.width[charCode],
                this.height[charCode],
                this.currentX,
                this.currentY + this.yoff[charCode],
                this.width[charCode],
                this.height[charCode]
            )
        } catch (e) {
            console.log("drawText error: " + e)
        }
        this.currentX += this.xadv[charCode]
    }
}

BitmapFont.prototype.drawMultiLineText = function (opt) {
    var currCtx = this.ctx
    if (opt.drawCtx) {
        currCtx = opt.drawCtx
    }
    this.text = opt.text
    this.currentX = opt.xpos
    this.currentY = opt.ypos
    this.lineOffset = opt.lineOffset || 0

    this.lines = this.text.split(/\n/)

    for (var ls = 0, ll = this.lines.length; ls < ll; ls++) {

        var line = this.lines[ls]

        for (var i = 0, l = line.length; i < l; i++) {
            var charCode = line.charCodeAt(i)
            try {
                currCtx.drawImage(
                    this.atlas,
                    this.x[charCode],
                    this.y[charCode],
                    this.width[charCode],
                    this.height[charCode],
                    this.currentX,
                    this.currentY + this.yoff[charCode],
                    this.width[charCode],
                    this.height[charCode]
                )
            } catch (e) {
                console.log("drawText error: " + e)
            }
            this.currentX += this.xadv[charCode]
        }

        this.currentX = opt.xpos
        this.currentY += this.getLineHeight() + this.lineOffset
    }
}

BitmapFont.prototype.getLineHeight = function () {
    return this.lineHeight
}

BitmapFont.prototype.getFontSize = function () {
    return this.size
}

BitmapFont.prototype.getTextWidth = function (text) {
    var textwidth = 0
    var c = 0
    for (var i = 0, l = text.length; i < l; i++) {
        textwidth += this.xadv[text.charCodeAt(i)]
    }
    return textwidth
}

BitmapFont.prototype.loadFont = function (opt) {
    idnum = 0
    this.font = opt.font
    this.fontFile = this.loadGlyphDesigner(this.font)

    try {

        var lines = this.fontFile.split('\n')
        for (l in lines) {

            var line = lines[l]

            if (line.length === 0 || typeof line !== 'string') {
                continue
            }

            line = line.trim()

//            console.log(line)

            if (line.startsWith('info')) {
                var infodata = line.split(/([a-zA-Z]*=[" ,.\-_()0-9a-zA-Z]*(?= |\n))/)
//                console.log(infodata)

                for (i in infodata) {
                    var info = infodata[i]
                    if (info.length === 0 || typeof info !== 'string') {
                        continue
                    }
                    if (info.startsWith('face=')) {
                        var face = info.split("=")
                        this.face = face[1].split('"').join('')
                    }
                    if (info.startsWith('size=')) {
                        var size = info.split("=")
                        this.size = parseInt(size[1])
                    }
                    if (info.startsWith('bold=')) {
                        var bold = info.split("=")
                        this.bold = parseInt(bold[1])
                    }
                    if (info.startsWith('italic=')) {
                        var italic = info.split("=")
                        this.italic = parseInt(italic[1])
                    }
                }
            }
            if (line.startsWith('padding')) {
                continue
            }
            if (line.startsWith('common')) {
                var commondata = line.split(' ')
//                console.log(commondata)
                for (c in commondata) {
                    var common = commondata[c]
                    if (common.length === 0 || typeof common !== 'string') {
                        continue
                    }

                    if (common.startsWith('lineHeight=')) {
                        var lnh = common.split("=")
                        this.lineHeight = parseInt(lnh[1])
                    }
                    if (common.startsWith('base=')) {
                        var base = common.split("=")
                        this.base = parseInt(base[1])
                    }
                    if (common.startsWith('scaleW=')) {
                        var scaleW = common.split("=")
                        this.scaleW = parseInt(scaleW[1])
                    }
                    if (common.startsWith('scaleH=')) {
                        var scaleH = common.split("=")
                        this.scaleH = parseInt(scaleH[1])
                    }
                }
            }
            if (line.startsWith('page')) {
                var pagedata = line.split(' ')
//                console.log(pagedata)

                for (p in pagedata) {
                    data = pagedata[p]

                    if (data.length === 0 || typeof data !== 'string') {
                        continue
                    }

                    if (data.startsWith('file=')) {
                        var fn = data.split('=')
                        this.atlas.src = 'font/' + fn[1].split('"').join('')
                    }

                }
            }
            if (line.startsWith('chars')) {
                continue
            }
            if (line.startsWith('char')) {
                var linedata = line.split(' ')
//                console.log(linedata)
                for (l in linedata) {
                    ld = linedata[l]

                    if (ld.length === 0 || typeof ld !== 'string') {
                        continue
                    }

                    if (ld.startsWith('id=')) {
                        var idc = ld.split('=')
                        idnum = parseInt(idc[1])
                    }
                    if (ld.startsWith('x=')) {
                        var xc = ld.split('=')
                        this.x[idnum] = parseInt(xc[1])
                    }
                    if (ld.startsWith('y=')) {
                        var yc = ld.split('=')
                        this.y[idnum] = parseInt(yc[1])
                    }
                    if (ld.startsWith('width=')) {
                        var wc = ld.split('=')
                        this.width[idnum] = parseInt(wc[1])
                    }
                    if (ld.startsWith('height=')) {
                        var hc = ld.split('=')
                        this.height[idnum] = parseInt(hc[1])
                    }
                    if (ld.startsWith('xoffset=')) {
                        var xoc = ld.split('=')
                        this.xoff[idnum] = parseInt(xoc[1])
                    }
                    if (ld.startsWith('yoffset=')) {
                        var yoc = ld.split('=')
                        this.yoff[idnum] = parseInt(yoc[1])
                    }
                    if (ld.startsWith('xadvance=')) {
                        var advc = ld.split('=')
                        this.xadv[idnum] = parseInt(advc[1])
                    }
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
    return this
}

BitmapFont.prototype.loadGlyphDesigner = function (path) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send(null);
    if ((xhr.status === 200) || (xhr.status === 0)) {
        return xhr.responseText
    }
}



function Sprite(opt) {
    this.uid = opt.uid || 0

    // normal image
    this.picturename = opt.imagename || false

    this.nightmode = opt.nightmode || 0
    this.nightmoderadius = opt.nightmoderadius || 0

    this.x = opt.x || 0
    this.y = opt.y || 0

    this.scale = opt.scale || 1

    this.alpha = opt.alpha || 1
    this.distanceTo = opt.distanceTo || false

    this.xspeed = opt.xspeed || 0
    this.yspeed = opt.yspeed || 0

    this.rotation = opt.rotation || 0
    this._rotation = opt._rotation || 0

    this.visible = opt.visible || true

    /*
     * if setup with imagename the sprite is loading the image
     */
    if (this.picturename) {
        this.image = new Image()
        this.image.src = this.picturename
        this.image.onload = function () {
            this.width2 = this.image.width / 2
            this.height2 = this.image.height / 2
        }.bind(this)
    }

    /*
     * otherwise use image from texturepacker
     */
    this.atlasdata = opt.atlasdata || false
    this.atlasimage = opt.atlasimage || false
    this.atlasrotation = 0

    if (this.atlasdata) {
        this.awidth = this.atlasdata.frame.w
        this.aheight = this.atlasdata.frame.h
        if (this.atlasdata.rotated) {
            this.awidth = this.atlasdata.frame.h
            this.aheight = this.atlasdata.frame.w
            this.atlasrotation = 90
        }

        this.width2 = this.awidth / 2
        this.height2 = this.aheight / 2
    }
}

Sprite.prototype.update = function () {

    this.x += this.xspeed;
    this.y += this.yspeed;

    this._rotation += this.rotation

    if (this.nightmode === 1 && this.distanceTo) {
        this.alpha = 1 - (this.getDistance() / this.nightmoderadius)
        if (this.alpha < 0) {
            this.alpha = 0
        }
    }
}


Sprite.prototype.draw = function () {
    if (this.visible) {
        bctx.save()
        bctx.translate(this.x, this.y)
        bctx.scale(this.scale,this.scale)
        bctx.globalAlpha = this.alpha

        bctx.rotate((this._rotation - this.atlasrotation) / 180 * Math.PI)

        // draw normal picture
        if (this.picturename) {
            bctx.drawImage(this.image, (this.image.width / 2) * -1, (this.image.height / 2) * -1)
        } else if (this.atlasimage) {
            bctx.drawImage(this.atlasimage, this.atlasdata.frame.x, this.atlasdata.frame.y, this.awidth, this.aheight, this.width2 * -1, this.height2 * -1, this.awidth, this.aheight)
        }

        bctx.restore()
    }
}

/*

 void drawImage(image, x, y)
 void drawImage(canvas, x, y)

 void drawImage(image, x, y, dw, dh)
 void drawImage(canvas, x, y, dw, dh)

 void drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
 void drawImage(canvas, sx, sy, sw, sh, dx, dy, dw, dh)

 Game.b_ctx.drawImage(

 renderObject.image,
 renderObject.xoffset,
 renderObject.yoffset,
 renderObject.cutwidth,
 renderObject.cutheight,
 0 - renderObject.xhandle,
 0 - renderObject.yhandle,
 renderObject.cutwidth * renderObject.xscale,
 renderObject.cutheight * renderObject.yscale

 )

 image / canvas - Quellelement, das in den Kontext gerendert werden soll
 sx - x-Koordinate der linken oberen Ecke des Ausschnitts im Quellelement
 sy - y-Koordinate der linken oberen Ecke des Ausschnitts im Quellelement
 sw - Breite des Ausschnitts im Quellelement
 sh - Höhe des Ausschnitts im Quellelement
 dx - x-Koordinate der linken oberen Ecke im Kontext
 dy - y-Koordinate der linken oberen Ecke im Kontext
 dw - Breite des Elements im Kontext
 dh - Höhe des Elements im Kontext


 * */

Sprite.prototype.getDistance = function () {
    var xs = 0;
    var ys = 0;

    xs = this.distanceTo.x - this.x;
    xs = xs * xs;

    ys = this.distanceTo.y - this.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
}

Wall.prototype = new Sprite({})
Wall.prototype.constructor = Wall
function Wall(opt) {
    Sprite.call(this, opt)

}
Moveable.prototype = new Sprite({})
Moveable.prototype.constructor = Moveable
function Moveable(opt) {
    Sprite.call(this, opt)

}
Floor.prototype = new Sprite({})
Floor.prototype.constructor = Floor
function Floor(opt) {
    Sprite.call(this, opt)
}
OneStand.prototype = new Sprite({})
OneStand.prototype.constructor = OneStand
function OneStand(opt) {
	Sprite.call(this, opt)

    // TODO rewrite to use atlas?
	this.lockname = opt.lockname || ''
	this.lockimage = new Image()
	this.lockimage.src = this.lockname
	
	this.locked = false
}

OneStand.prototype.trigger = function () {
	this.locked = true
	lock.play();
}

OneStand.prototype.draw = function () {
    Sprite.prototype.draw.call(this)

	bctx.save()
    bctx.globalAlpha = this.alpha
    bctx.translate(this.x, this.y)
//	bctx.drawImage(this.image, (this.image.width / 2) *-1, (this.image.height / 2) *-1)
	if (this.locked) {
		bctx.drawImage(this.lockimage, (this.lockimage.width / 2) *-1, (this.lockimage.height / 2) *-1)
	}
	bctx.restore()
}
Door.prototype = new Sprite({})
Door.prototype.constructor = Door
function Door(opt) {
    Sprite.call(this, opt)

    // TODO rewrite to use atlas?
    this.lockname = opt.lockname || ''
    this.lockimage = new Image()
    this.lockimage.src = this.lockname

    this.unlocked = false
}

Door.prototype.draw = function () {
    Sprite.prototype.draw.call(this)

    bctx.save()
    bctx.globalAlpha = this.alpha
    bctx.translate(this.x, this.y)
//	bctx.drawImage(this.image, (this.image.width / 2) *-1, (this.image.height / 2) *-1)
    if (!this.unlocked) {
        bctx.drawImage(this.lockimage, (this.lockimage.width / 2) * -1, (this.lockimage.height / 2) * -1)
    }
    bctx.restore()
}
Oneway.prototype = new Sprite({})
Oneway.prototype.constructor = Oneway
function Oneway(opt) {
	Sprite.call(this, opt)

}
Cycle.prototype = new Sprite({})
Cycle.prototype.constructor = Cycle
function Cycle(opt) {
    Sprite.call(this, opt)

}

Cycle.prototype.trigger = function () {
    this._rotation += 90;
    rotate.play();
    if (this._rotation >= 360) {
        this._rotation = 0
    }
}
Trickycorner.prototype = new Cycle({})
Trickycorner.prototype.constructor = Trickycorner
function Trickycorner(opt) {
    Cycle.call(this, opt)

}
Points.prototype = new Sprite({})
Points.prototype.constructor = Points
function Points(opt) {
	Sprite.call(this, opt)

	this.points = opt.points || 0
}
Diamond.prototype = new Points({})
Diamond.prototype.constructor = Diamond
function Diamond(opt) {
    Points.call(this, opt)

    this.points = opt.points || 0
}
function LevelMap(currentlevel) {
    this.map = currentlevel.data

    currenttheme = Themes[currentlevel.theme];

    var xstep = 25,
        ystep = 25,
        stepwidth = 50

    for (var i = 0, l = this.map.length; i < l; i++) {
        if (this.map[i] === EMPTY) {
            Game.entities.push(
                new Floor({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('floor'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === MOVABLE) {
            Game.entities.push(
                new Floor({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('floor'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
            Game.entities.push(
                new Moveable({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('moveable'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === WALL) {
            Game.entities.push(
                new Wall({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('wall'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === DIAMOND) {
            Game.entities.push(
                new Floor({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('floor'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
            Game.entities.push(
                new Diamond({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('diamond'),
                    x: xstep,
                    y: ystep,
                    points: 20,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            );
        } else if (this.map[i] === DOOR) {
            // needed globally
            door = new Door({
                uid: i,
                atlasimage: atlasGame.image,
                atlasdata: atlasGame.getPicByName('door'),
                lockname: currenttheme.tiles.lock,
                x: xstep,
                y: ystep,
                nightmode: currentlevel.nightmode,
                nightmoderadius: currentlevel.nightmoderadius,
                distanceTo: player
            })
            Game.entities.push(door)
        } else if (this.map[i] === ONEWAY_UP) {
            Game.entities.push(
                new Oneway({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('oneway'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === ONEWAY_RIGHT) {
            Game.entities.push(
                new Oneway({
                    uid: i,
                    _rotation: 90,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('oneway'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === ONEWAY_DOWN) {
            Game.entities.push(
                new Oneway({
                    uid: i,
                    _rotation: 180,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('oneway'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === ONEWAY_LEFT) {
            Game.entities.push(
                new Oneway({
                    uid: i,
                    _rotation: 270,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('oneway'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === CYCLE_VER) {
            Game.entities.push(
                new Cycle({
                    uid: i,
                    _rotation: 0,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('cycle'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === CYCLE_HOR) {
            Game.entities.push(
                new Cycle({
                    uid: i,
                    _rotation: 90,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('cycle'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === CORNER_UP) {
            Game.entities.push(
                new Trickycorner({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('corner'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === CORNER_RIGHT) {
            Game.entities.push(
                new Trickycorner({
                    uid: i,
                    _rotation: 90,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('corner'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === CORNER_DOWN) {
            Game.entities.push(
                new Trickycorner({
                    uid: i,
                    _rotation: 180,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('corner'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === CORNER_LEFT) {
            Game.entities.push(
                new Trickycorner({
                    uid: i,
                    _rotation: 270,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('corner'),
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        } else if (this.map[i] === ONE_STAND) {
            Game.entities.push(
                new OneStand({
                    uid: i,
                    atlasimage: atlasGame.image,
                    atlasdata: atlasGame.getPicByName('one-stand'),
                    lockname: currenttheme.tiles.lock,
                    x: xstep,
                    y: ystep,
                    nightmode: currentlevel.nightmode,
                    nightmoderadius: currentlevel.nightmoderadius,
                    distanceTo: player
                })
            )
        }

        xstep += stepwidth

        if (((i + 1) % 16) === 0) {
            xstep = 25
            ystep += stepwidth
        }
    }
}

LevelMap.prototype.digTo = function (x, y, direction) {
    var targetX = x,
        targetY = y;

    // target position
    if (direction === WALK_LEFT) {
        targetX -= 50
    } else if (direction === WALK_UP) {
        targetY -= 50
    } else if (direction === WALK_RIGHT) {
        targetX += 50
    } else if (direction === WALK_DOWN) {
        targetY += 50
    }

    var _x = (targetX - 25) / 50,
        _y = (targetY - 25) / 50,
        _pos = (16 * _y) + _x,
        tileToDig = Game.fn.getEntityById(_pos)

    if (tileToDig instanceof Wall) {
        this.map[_pos] = 0

        Game.entities[Game.entities.indexOf(tileToDig)] = new Floor({
            uid: _pos,
            atlasimage: atlasGame.image,
            atlasdata: atlasGame.getPicByName('floor'),
            x: targetX,
            y: targetY,
            nightmode: currentlevel.nightmode,
            nightmoderadius: currentlevel.nightmoderadius,
            distanceTo: player
        })
        return true
    }
    return false
}

LevelMap.prototype.canIGoto = function (x, y, direction) {
    var currentX = targetX = x,
        currentY = targetY = y;

    // target position
    if (direction === WALK_LEFT) {
        targetX -= 50
        if (targetX < 0) {
            return false
        }
    } else if (direction === WALK_UP) {
        targetY -= 50
        if (targetY < 0) {
            return false
        }
    } else if (direction === WALK_RIGHT) {
        targetX += 50
        if (targetX > 800) {
            return false
        }
    } else if (direction === WALK_DOWN) {
        targetY += 50
        if (targetY > 600) {
            return false
        }
    }

    // current tile
    var _x = (currentX - 25) / 50,
        _y = (currentY - 25) / 50,
        _pos = (16 * _y) + _x,
        currentTile = this.map[_pos],
        currentTileObj = Game.fn.getEntityById(_pos)

    if (currentTile === CYCLE_VER || currentTile === CYCLE_HOR) {
        if (direction === WALK_LEFT && (currentTileObj._rotation == 0 || currentTileObj._rotation == 180)) {
            return false
        }
        if (direction === WALK_RIGHT && (currentTileObj._rotation == 0 || currentTileObj._rotation == 180)) {
            return false
        }
        if (direction === WALK_UP && (currentTileObj._rotation == 90 || currentTileObj._rotation == 270)) {
            return false
        }
        if (direction === WALK_DOWN && (currentTileObj._rotation == 90 || currentTileObj._rotation == 270)) {
            return false
        }
    }
    if (currentTile === ONEWAY_UP ||
        currentTile === ONEWAY_RIGHT ||
        currentTile === ONEWAY_DOWN ||
        currentTile === ONEWAY_LEFT) {
        if ((direction === WALK_LEFT || direction === WALK_RIGHT) && (currentTileObj._rotation === 0 || currentTileObj._rotation === 180)) {
            return false
        }
        if ((direction === WALK_UP || direction === WALK_DOWN) && (currentTileObj._rotation === 90 || currentTileObj._rotation === 270)) {
            return false
        }
    }

    // corner
    if (currentTile === CORNER_UP) {
        if ((currentTileObj._rotation === 0) && ((direction === WALK_RIGHT) || (direction === WALK_DOWN)) ||
            (currentTileObj._rotation === 90) && ((direction === WALK_DOWN) || (direction === WALK_LEFT)) ||
            (currentTileObj._rotation === 180) && ((direction === WALK_LEFT) || (direction === WALK_UP)) ||
            (currentTileObj._rotation === 270) && ((direction === WALK_UP) || (direction === WALK_RIGHT))) {
            return false
        }
    }
    if (currentTile === CORNER_RIGHT) {
        if ((currentTileObj._rotation === 90) && ((direction === WALK_LEFT) || (direction === WALK_DOWN)) ||
            (currentTileObj._rotation === 180) && ((direction === WALK_LEFT) || (direction === WALK_UP)) ||
            (currentTileObj._rotation === 270) && ((direction === WALK_UP) || (direction === WALK_RIGHT)) ||
            (currentTileObj._rotation === 0) && ((direction === WALK_RIGHT) || (direction === WALK_DOWN))) {
            return false
        }
    }
    if (currentTile === CORNER_DOWN) {
        if ((currentTileObj._rotation === 180) && ((direction === WALK_LEFT) || (direction === WALK_UP)) ||
            (currentTileObj._rotation === 270) && ((direction === WALK_UP) || (direction === WALK_RIGHT)) ||
            (currentTileObj._rotation === 0) && ((direction === WALK_RIGHT) || (direction === WALK_DOWN)) ||
            (currentTileObj._rotation === 90) && ((direction === WALK_DOWN) || (direction === WALK_LEFT))) {
            return false
        }
    }
    if (currentTile === CORNER_LEFT) {
        if ((currentTileObj._rotation === 270) && ((direction === WALK_UP) || (direction === WALK_RIGHT)) ||
            (currentTileObj._rotation === 0) && ((direction === WALK_RIGHT) || (direction === WALK_DOWN)) ||
            (currentTileObj._rotation === 90) && ((direction === WALK_LEFT) || (direction === WALK_DOWN)) ||
            (currentTileObj._rotation === 180) && ((direction === WALK_LEFT) || (direction === WALK_UP))) {
            return false
        }
    }


    // can i got to
    // target tile
    var _x = (targetX - 25) / 50,
        _y = (targetY - 25) / 50,
        _pos = (16 * _y) + _x,
        targetTile = this.map[_pos],
        targetTileObj = Game.fn.getEntityById(_pos)

    // empty and diamond
    if (targetTile === EMPTY || targetTile === DIAMOND || targetTile === ONE_STAND) {
        if (targetTileObj.locked == true) {
            return false
        }
        return true
    }

    if (targetTile === MOVABLE) {

        var box = Game.fn.getEntityByIdAndInstance(_pos, [Moveable]),
            tileToTheRight = Game.fn.getEntityByIdAndInstance(_pos + 1, [Moveable, Diamond]),
            tileToTheLeft = Game.fn.getEntityByIdAndInstance(_pos - 1, [Moveable, Diamond]),
            tileAbove = Game.fn.getEntityByIdAndInstance(_pos - 16, [Moveable, Diamond]),
            tileBelow = Game.fn.getEntityByIdAndInstance(_pos + 16, [Moveable, Diamond]),
            target

        if (direction === WALK_UP && !tileAbove) {
            target = Game.fn.getEntityById(_pos - 16)
            targetIndex = Game.entities.indexOf(target)
            boxIndex = Game.entities.indexOf(box)
            if (target instanceof Floor) {
                this.map[_pos] = EMPTY
                this.map[_pos - 16] = MOVABLE
                Game.entities.move(boxIndex, targetIndex + 1)
                box.uid = target.uid
                box.y -= 50
                return true
            }
        } else if (direction === WALK_RIGHT && !tileToTheRight) {
            target = Game.fn.getEntityById(_pos + 1)
            targetIndex = Game.entities.indexOf(target)
            boxIndex = Game.entities.indexOf(box)
            if (target instanceof Floor) {
                this.map[_pos] = EMPTY
                this.map[_pos + 1] = MOVABLE
                Game.entities.move(boxIndex, targetIndex + 1)
                box.uid = target.uid
                box.x += 50
                return true
            }
        } else if (direction === WALK_DOWN && !tileBelow) {
            target = Game.fn.getEntityById(_pos + 16)
            targetIndex = Game.entities.indexOf(target)
            boxIndex = Game.entities.indexOf(box)
            if (target instanceof Floor) {
                this.map[_pos] = EMPTY
                this.map[_pos + 16] = MOVABLE
                Game.entities.move(boxIndex, targetIndex + 1)
                box.uid = target.uid
                box.y += 50
                return true
            }
        } else if (direction === WALK_LEFT && !tileToTheLeft) {
            target = Game.fn.getEntityById(_pos - 1)
            targetIndex = Game.entities.indexOf(target)
            boxIndex = Game.entities.indexOf(box)
            if (target instanceof Floor) {
                this.map[_pos] = EMPTY
                this.map[_pos - 1] = MOVABLE
                Game.entities.move(boxIndex, targetIndex + 1)
                box.uid = target.uid
                box.x -= 50
                return true
            }
        }
        return false
    }

    // cylce
    if (targetTile === CYCLE_VER || targetTile === CYCLE_HOR) {
        if ((direction === WALK_LEFT || direction === WALK_RIGHT) && (targetTileObj._rotation === 90 || targetTileObj._rotation === 270)) {
            return true
        }
        if ((direction === WALK_UP || direction === WALK_DOWN) && (targetTileObj._rotation === 0 || targetTileObj._rotation === 180)) {
            return true
        }
    }

    // door
    if (targetTile === DOOR) {
        if (targetTileObj.unlocked) {
            Game.callbacks.levelFinished()
            return true
        }
    }

    // one way
    if (targetTile === ONEWAY_UP ||
        targetTile === ONEWAY_RIGHT ||
        targetTile === ONEWAY_DOWN ||
        targetTile === ONEWAY_LEFT) {
        if (targetTileObj._rotation === direction) {
            return true
        }
    }

    // corner
    if (targetTile === CORNER_UP) {
        if ((targetTileObj._rotation === 0) && ((direction === WALK_RIGHT) || (direction === WALK_DOWN)) ||
            (targetTileObj._rotation === 90) && ((direction === WALK_DOWN) || (direction === WALK_LEFT)) ||
            (targetTileObj._rotation === 180) && ((direction === WALK_LEFT) || (direction === WALK_UP)) ||
            (targetTileObj._rotation === 270) && ((direction === WALK_UP) || (direction === WALK_RIGHT))) {
            return true
        }
    }
    if (targetTile === CORNER_RIGHT) {
        if ((targetTileObj._rotation === 90) && ((direction === WALK_DOWN) || (direction === WALK_LEFT)) ||
            (targetTileObj._rotation === 180) && ((direction === WALK_LEFT) || (direction === WALK_UP)) ||
            (targetTileObj._rotation === 270) && ((direction === WALK_UP) || (direction === WALK_RIGHT)) ||
            (targetTileObj._rotation === 0) && ((direction === WALK_RIGHT) || (direction === WALK_DOWN))) {
            return true
        }
    }
    if (targetTile === CORNER_DOWN) {
        if ((targetTileObj._rotation === 180) && ((direction === WALK_LEFT) || (direction === WALK_UP)) ||
            (targetTileObj._rotation === 270) && ((direction === WALK_UP) || (direction === WALK_RIGHT)) ||
            (targetTileObj._rotation === 0) && ((direction === WALK_RIGHT) || (direction === WALK_DOWN)) ||
            (targetTileObj._rotation === 90) && ((direction === WALK_DOWN) || (direction === WALK_LEFT))) {
            return true
        }
    }
    if (targetTile === CORNER_LEFT) {
        if ((targetTileObj._rotation === 270) && ((direction === WALK_UP) || (direction === WALK_RIGHT)) ||
            (targetTileObj._rotation === 0) && ((direction === WALK_RIGHT) || (direction === WALK_DOWN)) ||
            (targetTileObj._rotation === 90) && ((direction === WALK_DOWN) || (direction === WALK_LEFT)) ||
            (targetTileObj._rotation === 180) && ((direction === WALK_LEFT) || (direction === WALK_UP))) {
            return true
        }
    }

    return false
}

LevelMap.prototype.triggerCurrent = function (x, y) {
    var _x = (x - 25) / 50,
        _y = (y - 25) / 50,
        _pos = (16 * _y) + _x
    if (this.map[_pos] === CYCLE_VER ||
        this.map[_pos] === CYCLE_HOR ||
        this.map[_pos] === CORNER_UP ||
        this.map[_pos] === CORNER_RIGHT ||
        this.map[_pos] === CORNER_DOWN ||
        this.map[_pos] === CORNER_LEFT ||
        this.map[_pos] === ONE_STAND) {
        Game.fn.getEntityById(_pos).trigger()
    }

}

LevelMap.prototype.checkForDiamond = function (x, y) {
    var _x = (x - 25) / 50,
        _y = (y - 25) / 50;

    if (this.map[(16 * _y) + _x] === DIAMOND) {
        return true
    }
    return false
}

PlayerDesktop.prototype = new Sprite({})
PlayerDesktop.prototype.constructor = PlayerDesktop
function PlayerDesktop(opt) {
    Sprite.call(this, opt)
    _self = this

    this.canWalk = true

    this.digging = opt.digging || 0;

    this.currentDirection = WALK_DOWN

    this.frames = opt.frames || false

    this.idle = 0

    // TODO rewrite to use atlas?
    this.shovel = new Image()
    this.shovel.src = 'gfx/player-shovel.png'

    // TODO rewrite to use atlas?
    this.torch = new Image()
    this.torch.src = 'gfx/torch.png'

    if (gamePadEvents === null) {
        gamePadEvents = joypad.on('button_press', function (e) {
            console.log(e.detail);

            var buttonName = e.detail.buttonName;

            // button_12 -> up
            if (buttonName === 'button_12' && this.canWalk) {
                _self.up();
            }

            // button_13 -> down
            if (buttonName === 'button_13' && this.canWalk) {
                _self.down()
            }

            // button_14 -> left
            if (buttonName === 'button_14' && this.canWalk) {
                _self.left()
            }

            // button_15 -> right
            if (buttonName === 'button_15' && this.canWalk) {
                _self.right()
            }

            _self.checkForDiamond()


            // button_0 -> button 0
            if (buttonName === 'button_0') {
                _self.digg()
            }

            // button_8 -> select
            if (buttonName === 'button_8') {
                this.esc()
            }

            // button_9 -> start
            if (buttonName === 'button_9') {
                this.restart()
            }


        }.bind(this));

    }

    document.onkeydown = function (evt) {
        this.idle = 0
        var keyCode = evt.keyCode
        if (keyCode == KEY_LEFT && this.canWalk) { //left
            this.left()
        }
        if (keyCode == KEY_UP && this.canWalk) { //up
            this.up()
        }
        if (keyCode == KEY_RIGHT && this.canWalk) { //right
            this.right()

        }
        if (keyCode == KEY_DOWN && this.canWalk) { //down
            this.down()
        }
        this.checkForDiamond()

        if (keyCode == KEY_R) {
            this.restart()
        }

        if (keyCode == KEY_ESC) {
            this.esc()
        }

        if ((keyCode == KEY_D || keyCode == KEY_SPACE)) {
            this.digg()
        }


    }.bind(this)
}



PlayerDesktop.prototype.up = function () {
    this.currentDirection = WALK_UP
    this.atlasdata = this.frames.up

    if (map.canIGoto(this.x, this.y, WALK_UP)) {
        map.triggerCurrent(this.x, this.y)
        this.y -= 50
        walk.play()
    }
}
PlayerDesktop.prototype.down = function () {
    this.currentDirection = WALK_DOWN
    this.atlasdata = this.frames.down

    if (map.canIGoto(this.x, this.y, WALK_DOWN)) {
        map.triggerCurrent(this.x, this.y)
        this.y += 50
        walk.play()
    }
}
PlayerDesktop.prototype.left = function () {
    this.currentDirection = WALK_LEFT
    this.atlasdata = this.frames.left

    if (map.canIGoto(this.x, this.y, WALK_LEFT)) {
        map.triggerCurrent(this.x, this.y)
        this.x -= 50
        walk.play()
    }
}
PlayerDesktop.prototype.right = function () {
    this.currentDirection = WALK_RIGHT
    this.atlasdata = this.frames.right

    if (map.canIGoto(this.x, this.y, WALK_RIGHT)) {
        map.triggerCurrent(this.x, this.y)
        this.x += 50
        walk.play()
    }
}
PlayerDesktop.prototype.restart = function () {
    Game.callbacks.restart()
}
PlayerDesktop.prototype.esc = function () {
    sfxback.pause()
    sfxback.src = 'sfx/sound-title.ogg'
    sfxback.play()
    Game.init.startscreen()
}
PlayerDesktop.prototype.digg = function () {
    if (this.digging === 0) {
        return
    }

    if (map.digTo(this.x, this.y, this.currentDirection)) {
        digg.play()
        if (this.digging > 0) {
            this.digging -= 1
            if (this.digging === 0) {
                btnIngameDigg.visible = false
            }
            joypad.vibrate(gamepad, {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 1,
                strongMagnitude: 1
            });
        }
    }
}

PlayerDesktop.prototype.checkForDiamond = function () {
    if (map.checkForDiamond(this.x, this.y)) {
        Game.fn.removeDiamondByPosition(this.x, this.y)
        diamondCounter.incrementDiamondFound(this.x, this.y)
    }
}


PlayerDesktop.prototype.update = function () {
    Sprite.prototype.update.call(this)
    this.idle += 1
    if (this.idle > 1400) {
        this.idle = 0
        playerVoice.play()
    }
}

PlayerDesktop.prototype.draw = function () {
    //call super method
    Sprite.prototype.draw.call(this)
    bctx.save()

    if (this.nightmode) {
        bctx.drawImage(this.torch, this.x - 25, this.y - 25)
        emitterPlayer.position.set({ x: this.x - 15, y: this.y - 15 })
    }

    if (this.digging > 0) {
        bctx.drawImage(this.shovel, this.x + 15, this.y - 25)
        bctx.fillStyle = '#ffff00'
        bctx.fillText(this.digging, this.x + 18, this.y - 6)
    }
    if (this.digging == -1) {
        bctx.drawImage(this.shovel, this.x + 15, this.y - 25)
        bctx.fillStyle = '#ffff00'
    }

    bctx.restore()
}


/*
 evtl. mit Tween gehen

 var tween = new TWEEN.Tween({ x: player.x, y: player.y })
 .to({ x: player.x - 50 }, 80)
 .easing(TWEEN.Easing.Cubic.InOut)
 .onUpdate(function () {

 player.x = this.x

 })
 .onComplete(function () {

 })
 .start();


 */
PlayerMobile.prototype = new PlayerDesktop({})
PlayerMobile.prototype.constructor = PlayerMobile
function PlayerMobile(opt) {
    PlayerDesktop.call(this, opt)

    this.buttonUp = new Button({
        imagename: 'gfx/arrow-touch.png',
        x: this.x,
        y: this.y - 50
    })
    this.buttonRight = new Button({
        imagename: 'gfx/arrow-touch.png',
        x: this.x + 50,
        y: this.y,
        _rotation: 90
    })
    this.buttonDown = new Button({
        imagename: 'gfx/arrow-touch.png',
        x: this.x,
        y: this.y + 50,
        _rotation: 180
    })
    this.buttonLeft = new Button({
        imagename: 'gfx/arrow-touch.png',
        x: this.x - 50,
        y: this.y,
        _rotation: 270
    })
}
PlayerMobile.prototype.update = function () {
    // call super method
    PlayerDesktop.prototype.update.call(this)

    this.buttonUp.update()
    this.buttonRight.update()
    this.buttonDown.update()
    this.buttonLeft.update()

    if (this.canWalk) {
        this.buttonUp.isClicked(function () { // up
            this.currentDirection = WALK_UP
            this.atlasdata = this.frames.up

            this.idle = 0

            if (map.canIGoto(this.x, this.y, WALK_UP)) {
                map.triggerCurrent(this.x, this.y)
                this.y -= 50
                walk.play()
            }

        }.bind(this))

        this.buttonRight.isClicked(function () { //right
            this.currentDirection = WALK_RIGHT
            this.atlasdata = this.frames.right

            this.idle = 0

            if (map.canIGoto(this.x, this.y, WALK_RIGHT)) {
                map.triggerCurrent(this.x, this.y)
                this.x += 50
                walk.play()
            }

        }.bind(this))

        this.buttonDown.isClicked(function () { //down
            this.currentDirection = WALK_DOWN
            this.atlasdata = this.frames.down

            this.idle = 0

            if (map.canIGoto(this.x, this.y, WALK_DOWN)) {
                map.triggerCurrent(this.x, this.y)
                this.y += 50
                walk.play()
            }

        }.bind(this))

        this.buttonLeft.isClicked(function () { //left
            this.currentDirection = WALK_LEFT
            this.atlasdata = this.frames.left

            this.idle = 0

            if (map.canIGoto(this.x, this.y, WALK_LEFT)) {
                map.triggerCurrent(this.x, this.y)
                this.x -= 50
                walk.play()
            }

        }.bind(this))
    }


    if (map.checkForDiamond(this.x, this.y)) {
        Game.fn.removeDiamondByPosition(this.x, this.y)
    }

    this.buttonUp.x = this.x
    this.buttonUp.y = this.y - 50

    this.buttonRight.x = this.x + 50
    this.buttonRight.y = this.y

    this.buttonDown.x = this.x
    this.buttonDown.y = this.y + 50

    this.buttonLeft.x = this.x - 50
    this.buttonLeft.y = this.y


}

PlayerMobile.prototype.draw = function () {
    //call super method
    PlayerDesktop.prototype.draw.call(this)

    this.buttonUp.draw()
    this.buttonRight.draw()
    this.buttonDown.draw()
    this.buttonLeft.draw()

}
Button.prototype = new Sprite({})
Button.prototype.constructor = Button
function Button(opt) {
    Sprite.call(this, opt)
    this.clicked = false
    this.audio = opt.audio || false
    this.data = opt.data || false
}

Button.prototype.update = function () {
    Sprite.prototype.update.call(this)
    if (Game.click) {
        if (this.atlasdata.rotated) {
            if (Game.click.x > (this.x - this.height2) &&
                Game.click.x < (this.x + this.height2) &&
                Game.click.y > (this.y - this.width2) &&
                Game.click.y < (this.y + this.width2)) {
                // remove click position object from game
                Game.click = false
                this.clicked = true
                if (this.audio) {
                    this.audio.play()
                }
            }
        } else {
            if (Game.click.x > (this.x - this.width2) &&
                Game.click.x < (this.x + this.width2) &&
                Game.click.y > (this.y - this.height2) &&
                Game.click.y < (this.y + this.height2)) {
                // remove click position object from game
                Game.click = false
                this.clicked = true
                if (this.audio) {
                    this.audio.play()
                }
            }
        }
    }
}

Button.prototype.isClicked = function (callback) {
    if (this.clicked) {
        this.clicked = false
        if (callback) {
            callback()
        }
        return true
    }
    return false
}

LevelButton.prototype = new Button({})
LevelButton.prototype.constructor = LevelButton
function LevelButton(opt) {
    Button.call(this, opt)
    this.clicked = false
    this.audio = opt.audio || false
    this.denied = opt.denied || false
    this.data = opt.data || false
}

LevelButton.prototype.update = function () {
    Sprite.prototype.update.call(this)
    if (Game.click) {
        if (this.atlasdata.rotated) {
            if (Game.click.x > (this.x - this.height2) &&
                Game.click.x < (this.x + this.height2) &&
                Game.click.y > (this.y - this.width2) &&
                Game.click.y < (this.y + this.width2)) {
                // remove click position object from game
                Game.click = false
                this.clicked = true
                if (this.audio && !this.data.locked) {
                    this.audio.play()
                } else {
                    this.denied.play()
                }
            }
        } else {
            if (Game.click.x > (this.x - this.width2) &&
                Game.click.x < (this.x + this.width2) &&
                Game.click.y > (this.y - this.height2) &&
                Game.click.y < (this.y + this.height2)) {
                // remove click position object from game
                Game.click = false
                this.clicked = true
                if (this.audio && !this.data.locked) {
                    this.audio.play()
                } else {
                    this.denied.play()
                }
            }
        }
    }
}

LevelButton.prototype.draw = function () {
    Button.prototype.draw.call(this)

    Game.font.drawText({
        text: '' + (this.data.level + 1),
        xpos: this.x - 19,
        ypos: this.y + 2,
        drawCtx: bctx
    })
}

function ButtonGroup(opt) {

    this.buttons = opt.buttons || []

    if (this.buttons.length < 2) {
        throw 'min. 2 Buttons needed for ButtonGroup'
    }

    this.x = opt.x || 0
    this.y = opt.y || 0
    this.width = opt.width || 100
    this.height = opt.height || 100
    this.type = opt.type || 'hor'
    this.startPoint = 0
    this.offset = this.width

    if (this.type === 'hor' && this.buttons.length > 2) {
        this.offset = (this.width / (this.buttons.length - 1)) << 0
    } else if (this.type === 'ver' && this.buttons.length > 2) {
        this.offset = (this.height / (this.buttons.length - 1)) << 0
    }

}

ButtonGroup.prototype.update = function () {
    this.updateStartPoint()

    var tmpStartpoint = this.startPoint

    if (this.type === 'hor') {
        for (var i = 0, l = this.buttons.length; i < l; i++) {
            this.buttons[i].y = this.y
            this.buttons[i].x = tmpStartpoint

            tmpStartpoint += this.offset
        }

    } else if (this.type === 'ver') {
        for (var i = 0, l = this.buttons.length; i < l; i++) {
            this.buttons[i].x = this.x
            this.buttons[i].y = tmpStartpoint

            tmpStartpoint += this.offset
        }

    }

}

ButtonGroup.prototype.draw = function () {

}

ButtonGroup.prototype.updateStartPoint = function () {
    if (this.type === 'hor') {
        this.startPoint = this.x - (this.width / 2)
    } else if (this.type === 'ver') {
        this.startPoint = this.y - (this.height / 2)
    }

}

function DiamondCounter(opt) {
    this.diamondsNeeded = opt.diamondsNeeded || 0
    this.diamondsFound = opt.diamondsFound || 0
    this.rememberDiamonds = [];
    this.position = opt.position || { x: 0, y: 550 }
    this.diamonds = []


    for (let i = 0; i < this.diamondsNeeded; i++) {
        let diamond = new Diamond({
            uid: i,
            atlasimage: atlasGame.image,
            atlasdata: atlasGame.getPicByName('diamond'),
            x: this.position.x + (i * 20),
            y: this.position.y,
            points: 20,
            scale: 0.5,
            alpha: 0.5
        })
        this.diamonds.push(diamond)
    }
}


DiamondCounter.prototype.incrementDiamondFound = function (x, y) {
    let hash = x + '_' + y
    if (this.rememberDiamonds.indexOf(hash) != -1) {
        return
    }

    this.rememberDiamonds.push(hash)
    this.diamonds[this.diamondsFound].alpha = 1
    this.diamondsFound++
}

DiamondCounter.prototype.update = function () {

}

DiamondCounter.prototype.draw = function () {
    this.diamonds.forEach((diamond) => {
        diamond.draw();
    });
}
var Levels = [
    {"name": "Little Intro", "digging": 0, "timelimit": 50, "startpoint": {"x": 175, "y": 275}, "nightmode": 0, "nightmoderadius": 0, "theme": 2, "pointsToFinish": 40, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Getting warm, check the tiles ;o)", "digging": 2, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 180, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 1, 1, 0, 4, 0, 10, 0, 0, 0, 15, 0, 0, 0, 8, 0, 0, 1, 1, 15, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 5, 0, 11, 0, 1, 2, 2, 2, 1, 0, 9, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 1, 1, 0, 6, 0, 12, 0, 1, 2, 2, 2, 1, 0, 14, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 7, 0, 13, 0, 0, 0, 9, 0, 0, 0, 15, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 1, 1, 15, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Rookie", "digging": 0, "timelimit": 50, "startpoint": {"x": 425, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 240, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 14, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 14, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 14, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Little trap", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 140, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 14, 1, 1, 11, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "The eight", "digging": 0, "timelimit": 50, "startpoint": {"x": 425, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 320, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 14, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 2, 2, 0, 0, 0, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 1, 2, 2, 0, 0, 0, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 2, 2, 0, 0, 0, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 1, 2, 2, 0, 0, 0, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 14, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Divider", "digging": 0, "timelimit": 50, "startpoint": {"x": 325, "y": 325}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 80, "data": [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 14, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 12, 8, 10, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1]}
    ,
    {"name": "Easy peasy", "digging": 0, "timelimit": 50, "startpoint": {"x": 125, "y": 175}, "nightmode": 0, "nightmoderadius": 0, "theme": 2, "pointsToFinish": 160, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 14, 2, 14, 2, 14, 1, 1, 1, 1, 0, 0, 0, 7, 7, 0, 0, 1, 14, 2, 1, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 2, 14, 2, 14, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 14, 14, 2, 14, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 14, 2, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0, 5, 5, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "The cup", "digging": 0, "timelimit": 50, "startpoint": {"x": 375, "y": 525}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 380, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 1, 1, 1, 2, 1, 1, 1, 1, 1, 14, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 14, 2, 2, 1, 1, 1, 2, 1, 1, 1, 14, 0, 0, 0, 2, 2, 1, 2, 2, 0, 0, 0, 14, 1, 1, 1, 1, 1, 1, 1, 2, 2, 14, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Dusty caverns", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 140, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 9, 0, 1, 0, 1, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 6, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 2, 9, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 2, 5, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 5, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Monkey", "digging": 0, "timelimit": 50, "startpoint": {"x": 425, "y": 525}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 240, "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 1, 15, 1, 2, 2, 1, 15, 1, 2, 2, 1, 15, 1, 0, 0, 0, 1, 15, 1, 0, 0, 0, 12, 0, 0, 0, 1, 15, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 12, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 10, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 14, 1, 3, 1, 14, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 15, 0, 15, 0, 15, 0, 15, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 15, 0, 0, 0, 15, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]}
    ,
    {"name": "The Slug", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 2, "pointsToFinish": 80, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 13, 0, 0, 1, 1, 0, 12, 9, 5, 5, 5, 5, 5, 5, 5, 13, 6, 0, 0, 1, 1, 0, 8, 12, 9, 9, 9, 9, 9, 9, 13, 8, 8, 0, 0, 1, 1, 0, 8, 4, 12, 9, 9, 9, 9, 13, 8, 6, 8, 0, 0, 1, 1, 0, 4, 0, 8, 2, 2, 0, 0, 8, 8, 0, 6, 0, 0, 1, 1, 0, 8, 4, 8, 2, 2, 0, 9, 10, 8, 6, 8, 0, 0, 1, 1, 0, 8, 4, 11, 9, 9, 9, 9, 9, 10, 6, 8, 0, 0, 1, 1, 0, 8, 11, 9, 9, 9, 9, 9, 9, 9, 10, 8, 0, 0, 1, 1, 0, 11, 7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Be careful!", "digging": 0, "timelimit": 25, "startpoint": {"x": 725, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 360, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 7, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2, 0, 0, 1, 2, 2, 0, 0, 1, 1, 1, 1, 1, 6, 1, 6, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 1, 2, 2, 0, 0, 1, 2, 2, 0, 0, 1, 1, 1, 1, 1, 6, 1, 1, 6, 1, 1, 1, 1, 6, 1, 1, 1, 1, 2, 2, 0, 0, 7, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2, 2, 0, 0, 1, 2, 2, 0, 0, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Stocked diamonds", "digging": 0, "timelimit": 50, "startpoint": {"x": 325, "y": 275}, "nightmode": 0, "nightmoderadius": 0, "theme": 2, "pointsToFinish": 1060, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 14, 0, 0, 14, 2, 3, 2, 14, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 14, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 14, 1, 1, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 7, 0, 0, 14, 2, 2, 2, 14, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Steelplate", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 180, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 14, 14, 2, 1, 2, 14, 1, 14, 14, 14, 1, 1, 0, 0, 0, 0, 1, 14, 14, 14, 9, 14, 1, 14, 14, 14, 1, 1, 3, 0, 0, 0, 1, 14, 14, 14, 14, 14, 14, 14, 10, 14, 1, 1, 0, 0, 0, 0, 1, 14, 14, 14, 14, 14, 14, 1, 14, 1, 1, 1, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 14, 14, 2, 1, 1, 1, 12, 5, 9, 13, 1, 8, 14, 14, 14, 14, 14, 14, 1, 1, 1, 1, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 2, 14, 1, 1, 14, 14, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 1, 14, 1, 1, 14, 14, 1, 2, 1, 14, 2, 1, 2, 14, 1, 14, 14, 14, 1, 1, 2, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Iron steel", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 80, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 14, 14, 1, 1, 0, 0, 0, 0, 14, 14, 1, 8, 0, 1, 1, 0, 14, 11, 2, 1, 0, 0, 0, 0, 14, 12, 2, 8, 0, 1, 1, 0, 14, 14, 1, 1, 0, 0, 0, 0, 14, 14, 1, 8, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 14, 14, 1, 1, 0, 0, 0, 0, 14, 14, 1, 1, 0, 1, 1, 0, 14, 10, 2, 7, 0, 0, 0, 0, 14, 8, 2, 5, 0, 1, 1, 0, 14, 14, 1, 1, 0, 0, 0, 0, 14, 14, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Metallica", "digging": 0, "timelimit": 50, "startpoint": {"x": 125, "y": 25}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 220, "data": [14, 14, 0, 14, 14, 1, 1, 1, 14, 1, 1, 1, 14, 14, 14, 14, 14, 1, 14, 1, 14, 14, 2, 14, 14, 14, 2, 14, 14, 1, 14, 1, 3, 1, 2, 1, 14, 1, 1, 1, 14, 1, 1, 1, 14, 1, 2, 1, 14, 1, 14, 1, 14, 14, 14, 14, 14, 14, 14, 14, 14, 1, 14, 1, 14, 14, 14, 14, 14, 1, 14, 1, 14, 1, 1, 1, 14, 14, 14, 14, 14, 1, 1, 1, 14, 1, 2, 1, 14, 14, 2, 14, 14, 1, 14, 1, 14, 14, 2, 14, 14, 1, 14, 1, 14, 1, 1, 1, 14, 1, 2, 1, 14, 1, 1, 1, 14, 14, 14, 14, 14, 14, 14, 14, 14, 1, 14, 1, 14, 14, 14, 14, 14, 14, 14, 14, 1, 14, 1, 14, 14, 14, 14, 14, 14, 14, 14, 14, 1, 1, 1, 14, 1, 2, 1, 14, 1, 1, 1, 14, 14, 14, 14, 14, 14, 2, 14, 14, 1, 14, 1, 14, 14, 2, 14, 14, 14, 14, 14, 14, 1, 1, 1, 14, 14, 14, 14, 14, 1, 1, 1, 14]}
    ,
    {"name": "The castle", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 525}, "nightmode": 0, "nightmoderadius": 0, "theme": 2, "pointsToFinish": 140, "data": [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 15, 1, 0, 0, 0, 0, 1, 15, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 14, 14, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 15, 1, 1, 6, 2, 1, 1, 15, 0, 0, 0, 1, 1, 0, 15, 0, 2, 1, 12, 9, 9, 13, 1, 2, 0, 15, 0, 1, 1, 0, 1, 1, 1, 1, 8, 8, 2, 8, 1, 1, 1, 1, 0, 1, 1, 0, 0, 15, 0, 5, 8, 11, 0, 8, 7, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 14, 10, 2, 3, 11, 14, 0, 0, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Getting harder!", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 640, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 5, 0, 2, 2, 2, 2, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 2, 2, 2, 2, 1, 1, 0, 0, 0, 1, 1, 1, 8, 1, 1, 0, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 9, 0, 0, 9, 4, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 6, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 8, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 8, 9, 0, 0, 0, 1, 1, 0, 0, 0, 0, 7, 0, 0, 0, 2, 2, 1, 0, 2, 2, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 1, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Ultra :D", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 20, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 12, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 13, 11, 13, 1, 1, 0, 9, 9, 13, 1, 1, 1, 1, 1, 1, 12, 12, 1, 11, 9, 9, 9, 9, 9, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 13, 1, 11, 2, 1, 1, 1, 0, 12, 0, 0, 1, 1, 1, 12, 10, 11, 0, 10, 1, 1, 1, 1, 0, 8, 11, 0, 1, 1, 1, 11, 13, 10, 1, 1, 1, 1, 1, 1, 0, 8, 11, 0, 1, 1, 1, 12, 8, 13, 12, 5, 0, 1, 1, 1, 0, 8, 1, 1, 1, 1, 1, 11, 10, 11, 9, 13, 10, 13, 0, 0, 0, 8, 0, 0, 1, 1, 1, 1, 1, 1, 11, 10, 1, 11, 0, 0, 0, 10, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Inside/Outside", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 120, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 10, 11, 10, 0, 10, 11, 10, 0, 13, 11, 10, 0, 0, 1, 1, 0, 10, 2, 11, 0, 10, 2, 11, 0, 10, 2, 11, 0, 0, 1, 1, 0, 11, 10, 12, 0, 11, 10, 12, 0, 11, 10, 12, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 9, 9, 9, 0, 8, 6, 0, 0, 0, 6, 0, 0, 1, 1, 0, 0, 5, 2, 7, 0, 8, 2, 7, 0, 5, 2, 7, 0, 1, 1, 0, 0, 0, 4, 0, 0, 8, 4, 0, 0, 9, 9, 9, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Spiralis", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 40, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 5, 0, 0, 0, 0, 0, 0, 5, 0, 2, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 12, 0, 10, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 12, 10, 13, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 5, 0, 1, 0, 1, 3, 0, 1, 0, 1, 11, 12, 10, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 11, 10, 13, 1, 0, 0, 1, 8, 1, 1, 1, 1, 1, 1, 9, 0, 0, 0, 0, 1, 0, 0, 7, 0, 7, 0, 0, 0, 0, 0, 0, 1, 11, 10, 13, 1, 0, 0, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 11, 10, 12, 1, 0, 2, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Crossroads", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 220, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 4, 1, 1, 0, 1, 4, 1, 0, 1, 2, 1, 0, 1, 1, 0, 5, 10, 5, 0, 0, 5, 10, 5, 0, 9, 9, 9, 10, 1, 1, 1, 1, 6, 1, 0, 1, 1, 6, 1, 0, 1, 2, 1, 0, 1, 0, 0, 1, 2, 1, 0, 1, 2, 0, 1, 0, 9, 9, 9, 0, 1, 1, 1, 1, 6, 1, 0, 1, 1, 6, 1, 0, 1, 2, 1, 0, 1, 1, 0, 7, 11, 5, 0, 0, 7, 10, 5, 0, 9, 9, 9, 0, 1, 1, 0, 1, 6, 1, 1, 0, 1, 6, 1, 0, 1, 2, 1, 1, 1, 1, 2, 5, 2, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1]}
    ,
    {"name": "Pizza Centro", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 20, "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 6, 8, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 10, 8, 10, 11, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 11, 13, 0, 11, 11, 7, 10, 0, 0, 0, 0, 0, 0, 0, 11, 13, 10, 11, 9, 7, 9, 13, 11, 9, 0, 0, 0, 0, 0, 0, 9, 8, 13, 11, 0, 0, 13, 4, 12, 7, 0, 0, 0, 0, 0, 0, 5, 10, 9, 7, 2, 0, 9, 11, 10, 9, 0, 0, 0, 0, 0, 0, 12, 9, 9, 11, 9, 12, 10, 9, 9, 13, 0, 0, 0, 0, 0, 0, 0, 12, 9, 11, 0, 10, 8, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 11, 0, 4, 12, 7, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 10, 4, 11, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
    ,
    {"name": "Boxy", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "theme": 0, "nightmoderadius": 0, "pointsToFinish": 20, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 15, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 1, 1, 1, 1, 0, 0, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 2, 3, 1, 1, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 13, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 15, 0, 1, 1, 1, 1, 0, 0, 1, 1, 15, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "A lot of work", "digging": 3, "timelimit": 50, "startpoint": {"x": 125, "y": 25}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 580, "data": [1, 1, 0, 0, 0, 0, 0, 0, 0, 15, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 4, 1, 1, 1, 1, 1, 1, 0, 15, 0, 15, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 14, 14, 14, 5, 9, 7, 2, 2, 2, 2, 2, 2, 2, 0, 0, 15, 14, 14, 14, 0, 15, 0, 2, 1, 1, 1, 1, 1, 2, 0, 0, 0, 15, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 1, 2, 8, 0, 0, 8, 9, 0, 0, 0, 0, 2, 1, 2, 2, 2, 1, 0, 8, 0, 0, 8, 6, 0, 0, 0, 0, 2, 1, 2, 2, 2, 1, 2, 0, 0, 0, 8, 2, 7, 8, 0, 0, 2, 1, 1, 1, 1, 1, 2, 0, 0, 0, 8, 4, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 0, 0, 0, 0, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 8, 9, 9, 9, 8, 8, 8, 3, 1]}
    ,
    {"name": "Blind diamond", "digging": 8, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 1, "nightmoderadius": 300, "theme": 0, "pointsToFinish": 20, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 3, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Pitch black", "digging": 0, "timelimit": 50, "startpoint": {"x": 125, "y": 75}, "nightmode": 1, "nightmoderadius": 100, "theme": 0, "pointsToFinish": 20, "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
    ,
    {"name": "Dark castle", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 525}, "nightmode": 1, "nightmoderadius": 275, "theme": 1, "pointsToFinish": 480, "data": [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 14, 1, 1, 1, 1, 1, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 0, 2, 2, 0, 1, 1, 1, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 14, 1, 1, 1, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 14, 14, 14, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 14, 1, 1, 1, 14, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 2, 2, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 14, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 2, 2, 2, 0, 0, 0, 1, 1, 1]}
    ,
    {"name": "Hide and seek", "digging": 2, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 1, "nightmoderadius": 200, "theme": 0, "pointsToFinish": 60, "data": [1, 1, 1, 1, 1, 5, 5, 2, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 5, 5, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 5, 5, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 5, 5, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 5, 5, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 5, 5, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 7, 7, 7, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 5, 5, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 5, 5, 0, 0, 0, 0, 0, 0, 1, 0, 2, 1, 1, 1, 0, 1, 5, 5, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 3, 0, 0, 1, 5, 5, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 5, 5, 1, 0, 1, 0, 1, 0, 2, 0, 1]}
    ,
    {"name": "Rumble on the floor", "digging": 1, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 1, "nightmoderadius": 300, "theme": 0, "pointsToFinish": 120, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 0, 0, 1, 1, 3, 1, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 1, 15, 1, 1, 1, 1, 0, 15, 0, 15, 0, 1, 1, 1, 1, 1, 1, 0, 15, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 15, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 15, 0, 1, 1, 15, 0, 15, 0, 0, 0, 0, 0, 1, 15, 0, 9, 9, 13, 1, 1, 0, 6, 1, 0, 0, 0, 1, 0, 1, 0, 1, 11, 13, 8, 1, 1, 0, 0, 1, 4, 1, 1, 1, 11, 15, 0, 0, 2, 8, 8, 1, 1, 2, 1, 1, 2, 0, 0, 0, 0, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Oh' Sokoban", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 275}, "nightmode": 1, "nightmoderadius": 300, "theme": 0, "pointsToFinish": 80, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 0, 15, 15, 0, 0, 15, 15, 0, 0, 0, 15, 1, 1, 15, 1, 15, 0, 15, 1, 15, 2, 15, 0, 15, 0, 15, 0, 1, 1, 0, 15, 15, 15, 1, 15, 0, 15, 0, 15, 0, 15, 2, 0, 1, 1, 15, 15, 0, 0, 0, 0, 15, 0, 15, 0, 15, 0, 0, 0, 1, 1, 0, 0, 15, 0, 15, 0, 15, 2, 0, 0, 0, 15, 1, 0, 1, 1, 0, 15, 15, 15, 0, 0, 15, 1, 15, 0, 1, 0, 15, 0, 1, 1, 0, 0, 0, 15, 15, 0, 15, 0, 15, 0, 15, 0, 0, 15, 1, 1, 15, 0, 15, 0, 15, 0, 15, 0, 15, 15, 0, 1, 0, 0, 1, 1, 2, 15, 1, 15, 0, 15, 0, 0, 0, 0, 15, 0, 15, 1, 1, 1, 15, 0, 0, 0, 15, 0, 15, 0, 15, 15, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Honeycomb", "digging": 0, "timelimit": 50, "startpoint": {"x": 325, "y": 475}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 20, "data": [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 15, 1, 1, 1, 15, 1, 1, 0, 0, 15, 1, 15, 15, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 15, 2, 0, 15, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 15, 15, 0, 15, 0, 15, 0, 15, 0, 0, 1, 1, 1, 0, 0, 15, 15, 0, 1, 0, 15, 0, 1, 0, 15, 0, 0, 1, 0, 0, 15, 15, 0, 15, 0, 1, 0, 15, 0, 1, 0, 15, 0, 0, 0, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 0, 15, 0, 0, 1, 0, 0, 15, 0, 15, 0, 1, 0, 1, 0, 15, 15, 0, 0, 1, 1, 1, 0, 0, 15, 0, 1, 0, 15, 0, 1, 15, 0, 0, 1, 1, 1, 15, 1, 0, 0, 15, 0, 15, 0, 15, 15, 0, 0, 1, 14, 1, 1, 1, 1, 1, 0, 0, 1, 15, 15, 15, 0, 0, 1, 14, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]}
    ,
    {"name": "Chambers of chaolin", "digging": 0, "timelimit": 50, "startpoint": {"x": 25, "y": 125}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 100, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 14, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 1, 0, 14, 10, 14, 0, 1, 14, 14, 2, 1, 4, 1, 4, 1, 6, 1, 1, 1, 14, 1, 0, 0, 14, 12, 13, 0, 14, 15, 0, 0, 14, 1, 1, 1, 2, 1, 1, 1, 14, 14, 14, 1, 14, 14, 9, 14, 14, 1, 1, 14, 14, 14, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1, 14, 8, 5, 2, 0, 1, 12, 9, 9, 13, 1, 6, 12, 0, 1, 1, 14, 14, 14, 1, 0, 1, 11, 9, 13, 6, 1, 11, 9, 10, 1, 1, 1, 1, 1, 1, 0, 0, 5, 9, 10, 6, 1, 0, 10, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 11, 7, 10, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Psychedelic", "digging": 0, "timelimit": 50, "startpoint": {"x": 725, "y": 475}, "nightmode": 1, "nightmoderadius": 400, "theme": 1, "pointsToFinish": 240, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 14, 2, 0, 0, 0, 1, 0, 2, 0, 1, 0, 5, 2, 1, 1, 11, 8, 13, 1, 4, 8, 1, 12, 9, 12, 5, 0, 1, 0, 1, 1, 12, 8, 10, 1, 0, 0, 1, 0, 2, 0, 1, 14, 1, 0, 1, 1, 11, 8, 13, 1, 8, 4, 1, 12, 9, 12, 7, 2, 1, 0, 1, 1, 12, 8, 10, 1, 0, 0, 1, 0, 2, 0, 1, 14, 1, 0, 1, 1, 11, 8, 13, 1, 4, 8, 1, 12, 9, 13, 5, 0, 14, 0, 1, 1, 0, 0, 0, 14, 0, 0, 14, 0, 0, 0, 1, 1, 6, 1, 1, 1, 1, 6, 1, 1, 4, 1, 1, 1, 1, 1, 1, 15, 0, 0, 3, 1, 2, 8, 14, 2, 15, 2, 0, 0, 1, 0, 0, 0, 15, 0, 0, 1, 0, 15, 1, 0, 1, 0, 0, 15, 0, 2, 1, 0, 15, 0, 0, 1, 2, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Checkerboard", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 260, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 7, 0, 5, 2, 9, 0, 7, 0, 9, 0, 9, 2, 1, 1, 1, 6, 1, 4, 1, 4, 1, 6, 1, 8, 1, 6, 1, 4, 1, 1, 1, 0, 9, 2, 9, 0, 9, 0, 5, 2, 7, 0, 9, 0, 1, 1, 1, 8, 1, 6, 1, 4, 1, 6, 1, 6, 1, 8, 1, 14, 1, 1, 1, 2, 5, 0, 5, 2, 7, 0, 7, 0, 9, 0, 14, 0, 1, 1, 1, 4, 1, 4, 1, 8, 1, 6, 1, 4, 1, 14, 1, 4, 1, 1, 1, 0, 7, 0, 7, 0, 5, 0, 9, 2, 7, 0, 9, 0, 1, 1, 1, 8, 1, 4, 1, 14, 1, 14, 1, 4, 1, 8, 1, 6, 1, 1, 1, 2, 9, 0, 9, 2, 5, 0, 9, 0, 5, 2, 7, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Serpentine", "digging": 2, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 3, "pointsToFinish": 20, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 14, 0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 14, 0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0, 14, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 14, 0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0, 14, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 0, 0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0, 14, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 2, 0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0, 14, 1]}
    ,
    {"name": "Logistics", "digging": 0, "timelimit": 50, "startpoint": {"x": 125, "y": 25}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 260, "data": [1, 1, 0, 1, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 1, 1, 0, 1, 0, 1, 3, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 15, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 15, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 1, 1, 4, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 14, 9, 9, 9, 13, 1, 0, 15, 0, 0, 0, 2, 1, 2, 15, 15, 1, 2, 14, 14, 14, 1, 1, 0, 1, 14, 1, 8, 0, 0, 15, 0, 1, 14, 6, 2, 6, 1, 1, 15, 15, 0, 0, 2, 1, 0, 15, 0, 1, 2, 14, 14, 14, 1, 0, 0, 0, 1, 6, 1, 1, 15, 15, 0, 0, 1, 4, 2, 4, 1, 0, 0, 0, 7, 2, 5, 0, 0, 15, 0, 2, 1, 14, 14, 14, 1, 2, 1, 1, 1, 1, 1, 1, 15, 0, 15, 0, 1, 1, 1, 1, 1]}
    ,
    {"name": "Grasberry", "digging": 6, "timelimit": 50, "startpoint": {"x": 125, "y": 25}, "nightmode": 0, "nightmoderadius": 0, "theme": 3, "pointsToFinish": 140, "data": [1, 0, 0, 0, 0, 0, 15, 0, 0, 15, 0, 0, 15, 0, 0, 1, 0, 0, 15, 2, 0, 0, 0, 0, 15, 0, 15, 2, 0, 0, 15, 0, 15, 15, 15, 0, 15, 0, 15, 0, 0, 0, 15, 0, 15, 0, 0, 0, 15, 15, 15, 0, 0, 15, 0, 15, 0, 15, 0, 0, 0, 0, 15, 0, 2, 15, 0, 15, 0, 0, 15, 0, 2, 0, 0, 15, 15, 2, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 0, 15, 0, 15, 0, 0, 15, 0, 0, 15, 2, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 15, 0, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Night diamonds", "digging": 3, "timelimit": 50, "startpoint": {"x": 575, "y": 75}, "nightmode": 1, "nightmoderadius": 120, "theme": 2, "pointsToFinish": 600, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 2, 1, 2, 0, 0, 2, 1, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 7, 0, 2, 0, 0, 7, 0, 2, 0, 2, 1, 1, 2, 2, 0, 0, 1, 2, 0, 0, 2, 1, 2, 0, 0, 0, 1, 1, 1, 1, 1, 6, 1, 6, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 9, 0, 0, 14, 2, 14, 2, 0, 8, 1, 1, 1, 1, 1, 0, 5, 2, 8, 0, 2, 14, 2, 14, 0, 8, 1, 1, 1, 1, 1, 13, 0, 9, 0, 0, 14, 2, 14, 2, 0, 9, 1, 1, 1, 1, 1, 3, 7, 7, 7, 7, 2, 14, 2, 14, 0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Cocoon", "digging": 0, "timelimit": 50, "startpoint": {"x": 275, "y": 475}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 20, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 15, 0, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 15, 0, 15, 0, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 15, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 15, 0, 15, 0, 15, 0, 15, 0, 15, 1, 1, 1, 1, 1, 1, 1, 0, 15, 1, 15, 0, 15, 1, 15, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 15, 0, 15, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 15, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Preparation", "digging": 0, "timelimit": 50, "startpoint": {"x": 275, "y": 525}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 40, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 15, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 1, 0, 1, 0, 1, 0, 14, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 14, 0, 0, 0, 15, 15, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 14, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 15, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 15, 15, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "CCW", "digging": 0, "timelimit": 50, "startpoint": {"x": 125, "y": 175}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 140, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 15, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 7, 0, 0, 15, 14, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 7, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 4, 1, 1, 3, 0, 0, 0, 1, 1, 0, 1, 1, 14, 5, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 14, 5, 15, 0, 15, 0, 0, 15, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 2, 1, 1, 0, 9, 2, 1, 0, 1, 1, 0, 1, 0, 15, 2, 1, 1, 1, 2, 5, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 2, 12, 12, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 10, 11, 0, 1, 1, 1, 1]}
    ,
    {"name": "Watch your step", "digging": 0, "timelimit": 50, "startpoint": {"x": 275, "y": 275}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 100, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 15, 0, 15, 0, 0, 15, 0, 2, 1, 1, 1, 1, 1, 1, 1, 4, 1, 0, 1, 1, 0, 15, 0, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 15, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 14, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 15, 0, 0, 1, 2, 15, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 14, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Locking", "digging": 0, "timelimit": 50, "startpoint": {"x": 475, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 20, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 15, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 15, 0, 2, 0, 0, 0, 15, 0, 15, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 15, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 0, 15, 14, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 3, 0, 0, 1, 1, 15, 1, 1, 1, 1, 1, 1, 1, 1, 15, 1, 1, 1, 15, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Little Pirate", "digging": 0, "timelimit": 50, "startpoint": {"x": 375, "y": 275}, "nightmode": 0, "nightmoderadius": 0, "theme": 1, "pointsToFinish": 80, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 14, 2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 0, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 0, 0, 14, 0, 0, 0, 14, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 11, 0, 1, 14, 1, 0, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 14, 14, 14, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 3, 15, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Boxmania", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 125}, "nightmode": 1, "nightmoderadius": 250, "theme": 0, "pointsToFinish": 180, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 2, 1, 1, 1, 1, 15, 15, 0, 0, 0, 1, 15, 0, 0, 0, 15, 0, 1, 1, 2, 2, 0, 0, 15, 0, 15, 1, 0, 15, 1, 1, 1, 1, 1, 1, 2, 2, 15, 15, 1, 0, 15, 1, 15, 0, 0, 0, 15, 15, 1, 1, 2, 2, 0, 0, 1, 15, 0, 1, 0, 15, 0, 15, 15, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 15, 0, 1, 1, 0, 15, 15, 0, 1, 0, 0, 0, 0, 15, 0, 14, 9, 15, 0, 1, 2, 0, 0, 0, 1, 2, 15, 1, 15, 0, 15, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Blocked", "digging": 0, "timelimit": 50, "startpoint": {"x": 325, "y": 275}, "nightmode": 1, "nightmoderadius": 350, "theme": 0, "pointsToFinish": 60, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 2, 1, 1, 0, 0, 0, 0, 0, 3, 1, 0, 0, 14, 0, 0, 15, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 15, 0, 0, 15, 15, 0, 1, 1, 1, 1, 14, 1, 1, 1, 1, 1, 1, 1, 15, 0, 15, 0, 15, 0, 0, 1, 0, 1, 15, 1, 1, 1, 1, 1, 1, 14, 1, 0, 0, 0, 0, 1, 0, 1, 15, 1, 15, 1, 1, 1, 0, 0, 1, 1, 1, 15, 1, 1, 0, 1, 15, 15, 1, 15, 1, 1, 0, 15, 1, 1, 1, 14, 1, 1, 0, 1, 1, 1, 1, 1, 15, 1, 0, 0, 0, 0, 0, 0, 15, 0, 0, 2, 1, 15, 1, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 1, 1, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Trapped", "digging": 0, "timelimit": 50, "startpoint": {"x": 25, "y": 125}, "nightmode": 1, "nightmoderadius": 650, "theme": 0, "pointsToFinish": 640, "data": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 14, 1, 1, 14, 1, 1, 14, 1, 1, 15, 1, 15, 1, 0, 0, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1, 1, 14, 1, 14, 0, 1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 15, 1, 0, 2, 2, 9, 2, 2, 9, 2, 2, 8, 2, 2, 0, 1, 14, 1, 14, 1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1, 0, 1, 1, 1, 0, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 0, 1, 1, 0, 1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1, 1, 0, 14, 0, 0, 2, 2, 9, 2, 2, 0, 2, 2, 10, 2, 2, 3, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 14, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 1, 1, 1]}
    ,
    {"name": "Fort Knox", "digging": 0, "timelimit": 50, "startpoint": {"x": 375, "y": 275}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 40, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 14, 0, 0, 15, 0, 0, 14, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 14, 1, 14, 1, 14, 1, 0, 0, 1, 1, 1, 1, 1, 14, 1, 15, 0, 15, 0, 15, 0, 15, 1, 14, 1, 1, 1, 1, 1, 0, 14, 0, 15, 0, 15, 1, 15, 2, 14, 0, 1, 1, 1, 1, 3, 0, 1, 15, 14, 15, 0, 15, 14, 15, 1, 0, 1, 1, 1, 1, 1, 0, 14, 2, 15, 1, 15, 0, 15, 0, 14, 0, 1, 1, 1, 1, 1, 14, 1, 15, 0, 15, 0, 15, 0, 15, 1, 14, 1, 1, 1, 1, 1, 0, 0, 1, 14, 1, 14, 1, 14, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 14, 0, 0, 15, 0, 0, 14, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Firewall", "digging": 1, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 280, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 14, 2, 14, 14, 2, 14, 14, 2, 14, 14, 2, 14, 14, 1, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 1, 14, 14, 1, 14, 14, 1, 14, 14, 2, 14, 14, 2, 14, 14, 1, 1, 14, 14, 2, 14, 14, 2, 14, 14, 1, 14, 14, 1, 14, 14, 1, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 1, 14, 14, 1, 14, 14, 1, 14, 14, 2, 14, 14, 2, 14, 14, 1, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 1, 14, 14, 1, 14, 14, 1, 14, 14, 1, 14, 14, 3, 14, 14, 1, 1, 14, 14, 2, 14, 14, 2, 14, 14, 2, 14, 14, 2, 14, 14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Blind Digg", "digging": 8, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 1, "nightmoderadius": 225, "theme": 0, "pointsToFinish": 160, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Mind your step", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 0, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 10, 10, 10, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 10, 10, 10, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 10, 10, 10, 1, 1, 0, 10, 10, 10, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Mind your step plus", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 0, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 10, 10, 10, 10, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 10, 10, 10, 10, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 10, 10, 10, 10, 1, 1, 0, 10, 10, 10, 10, 0, 1, 1, 1, 1, 10, 14, 10, 10, 0, 0, 0, 10, 10, 10, 10, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 14, 10, 10, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Singleton", "digging": 0, "timelimit": 50, "startpoint": {"x": 675, "y": 525}, "nightmode": 1, "nightmoderadius": 275, "theme": 0, "pointsToFinish": 20, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 15, 0, 14, 0, 0, 0, 15, 0, 0, 15, 0, 1, 1, 0, 1, 0, 15, 0, 15, 0, 15, 0, 0, 15, 15, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 15, 1, 1, 0, 0, 15, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 15, 0, 0, 0, 1, 0, 15, 0, 1, 1, 8, 1, 0, 1, 1, 1, 1, 1, 1, 14, 1, 1, 0, 0, 1, 1, 2, 5, 0, 14, 0, 0, 15, 0, 15, 0, 15, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 15, 0, 0, 0, 0, 1, 0, 0, 1, 1, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "Twins", "digging": 0, "timelimit": 50, "startpoint": {"x": 275, "y": 325}, "nightmode": 1, "nightmoderadius": 300, "theme": 0, "pointsToFinish": 40, "data": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 15, 15, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 15, 0, 1, 0, 0, 0, 1, 15, 1, 1, 1, 1, 1, 1, 1, 14, 1, 15, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 15, 0, 1, 11, 15, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 15, 0, 0, 1, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]}
    ,
    {"name": "The Rocket", "digging": 0, "timelimit": 50, "startpoint": {"x": 425, "y": 225}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 40, "data": [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 6, 1, 1, 1, 14, 1, 1, 1, 6, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 11, 0, 0, 0, 0, 0, 0, 0, 14, 1, 1, 0, 0, 1, 14, 0, 9, 14, 0, 0, 0, 0, 0, 10, 8, 0, 14, 1, 0, 1, 14, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 14, 1, 0, 1, 2, 14, 14, 1, 0, 0, 0, 0, 0, 1, 14, 14, 2, 1]}
    ,
    {"name": "Warehouse", "digging": 0, "timelimit": 50, "startpoint": {"x": 425, "y": 75}, "nightmode": 0, "nightmoderadius": 0, "theme": 0, "pointsToFinish": 20, "data": [15, 15, 0, 15, 0, 15, 15, 15, 0, 15, 0, 15, 0, 15, 15, 15, 15, 15, 14, 15, 15, 0, 15, 15, 0, 14, 15, 0, 0, 0, 15, 15, 14, 0, 15, 0, 15, 0, 15, 0, 15, 0, 0, 15, 15, 0, 15, 0, 0, 0, 15, 15, 0, 15, 0, 0, 15, 15, 15, 0, 0, 15, 0, 0, 15, 15, 15, 0, 14, 15, 15, 15, 0, 15, 0, 15, 0, 15, 15, 0, 0, 15, 0, 0, 15, 0, 0, 15, 0, 0, 15, 0, 15, 0, 0, 15, 0, 0, 15, 15, 15, 0, 15, 0, 15, 15, 0, 15, 0, 0, 15, 0, 15, 0, 15, 0, 0, 0, 15, 0, 15, 0, 14, 15, 15, 0, 15, 0, 15, 15, 0, 15, 0, 15, 15, 15, 0, 15, 0, 0, 15, 15, 15, 0, 0, 15, 0, 15, 15, 15, 0, 15, 15, 0, 15, 15, 0, 15, 0, 15, 0, 0, 15, 15, 0, 15, 0, 0, 0, 15, 0, 0, 0, 14, 0, 0, 3, 0, 15, 0, 15, 0, 14, 15, 15, 0, 15, 0, 15, 0, 15, 2]}
    ,
    {"name": "Crazy", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 25}, "nightmode": 0, "nightmoderadius": 4, "theme": 0, "pointsToFinish": 420, "data": [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2, 2, 2, 1, 14, 14, 1, 1, 0, 14, 0, 0, 1, 1, 0, 13, 1, 1, 0, 2, 2, 14, 1, 1, 12, 8, 10, 1, 1, 1, 15, 8, 5, 13, 1, 2, 14, 14, 2, 1, 0, 0, 10, 0, 0, 0, 0, 10, 5, 14, 1, 2, 1, 14, 14, 1, 0, 0, 1, 1, 1, 1, 1, 12, 9, 10, 1, 2, 1, 14, 1, 1, 1, 14, 1, 2, 0, 0, 1, 0, 1, 1, 0, 2, 1, 14, 2, 14, 14, 10, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 1, 0, 1, 15, 15, 15, 3, 7, 14, 1, 14, 14, 1, 6, 1, 1, 1, 0, 1, 0, 14, 0, 11, 12, 14, 14, 12, 7, 11, 2, 7, 7, 7, 14, 1, 15, 0, 0, 12, 2, 14, 2, 14, 1, 2, 14, 1, 1, 0, 0, 0, 0, 15, 0, 2, 7, 14, 14, 14, 7, 11, 2, 7, 7, 7, 14, 1, 1, 1, 1]}
    ,
    {"name": "Why?", "digging": 0, "timelimit": 50, "startpoint": {"x": 75, "y": 75}, "nightmode": 1, "nightmoderadius": 300, "theme": 0, "pointsToFinish": 40, "data": [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 15, 1, 0, 0, 0, 0, 0, 0, 1, 0, 15, 3, 1, 1, 15, 0, 15, 0, 1, 0, 0, 0, 0, 1, 15, 0, 15, 0, 1, 0, 1, 15, 0, 15, 0, 1, 0, 0, 1, 15, 0, 15, 0, 1, 0, 0, 0, 1, 0, 15, 0, 0, 1, 1, 0, 0, 15, 0, 1, 0, 0, 0, 0, 0, 1, 0, 15, 15, 0, 0, 15, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 15, 0, 0, 15, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 9, 13, 13, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 11, 0, 10, 14, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 8, 11, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 14, 14, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]}
    ,
    {"name": "Finalis", "digging": 0, "timelimit": 50, "startpoint": {"x": 25, "y": 375}, "nightmode": 1, "nightmoderadius": 150, "theme": 2, "pointsToFinish": 200, "data": [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 11, 8, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 15, 1, 0, 15, 0, 0, 0, 1, 0, 0, 0, 0, 1, 15, 1, 0, 0, 0, 1, 0, 0, 1, 0, 3, 1, 1, 1, 0, 1, 0, 15, 0, 1, 0, 2, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 2, 1, 0, 1, 1, 1, 1, 0, 14, 0, 0, 10, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 11, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 1, 11, 0, 0, 2, 1, 0, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 1, 1, 1]}
]


var Themes = [
    {
        name: 'The Caverns',
        tiles: {
            floor: 'gfx/theme-0/floor.jpg',
            wall: 'gfx/theme-0/wall.jpg',
            diamond: 'gfx/theme-0/diamond.png',
            door: 'gfx/theme-0/door.png',
            onestand: 'gfx/theme-0/one-stand.jpg',
            lock: 'gfx/theme-0/lock.png',
            oneway: 'gfx/theme-0/oneway.png',
            cycle: 'gfx/theme-0/cycle.png',
            box: 'gfx/theme-0/movable.png',
            corner: 'gfx/theme-0/corner.png'
        }
    },
    {
        name: 'Into dark',
        tiles: {
            floor: 'gfx/theme-1/floor.jpg',
            wall: 'gfx/theme-1/wall.jpg',
            diamond: 'gfx/theme-1/diamond.png',
            door: 'gfx/theme-1/door.png',
			onestand: 'gfx/theme-1/one-stand.jpg',
            lock: 'gfx/theme-1/lock.png',
            oneway: 'gfx/theme-1/oneway.png',
            cycle: 'gfx/theme-1/cycle.png',
            box: 'gfx/theme-0/movable.png',
            corner: 'gfx/theme-1/corner.png'
        }
    },
    {
        name: 'Grey Walls',
        tiles: {
            floor: 'gfx/theme-2/floor.jpg',
            wall: 'gfx/theme-2/wall.jpg',
            diamond: 'gfx/theme-2/diamond.png',
            door: 'gfx/theme-2/door.png',
			onestand: 'gfx/theme-2/one-stand.jpg',
            lock: 'gfx/theme-2/lock.png',
            oneway: 'gfx/theme-2/oneway.png',
            cycle: 'gfx/theme-2/cycle.png',
            box: 'gfx/theme-0/movable.png',
            corner: 'gfx/theme-2/corner.png'
        }
    },
    {
        name: 'Grasland',
        tiles: {
            floor: 'gfx/theme-3/floor.jpg',
            wall: 'gfx/theme-3/wall.jpg',
            diamond: 'gfx/theme-3/diamond.png',
            door: 'gfx/theme-3/door.png',
            onestand: 'gfx/theme-3/one-stand.jpg',
            lock: 'gfx/theme-3/lock.png',
            oneway: 'gfx/theme-3/oneway.png',
            cycle: 'gfx/theme-3/cycle.png',
            box: 'gfx/theme-3/movable.png',
            corner: 'gfx/theme-3/corner.png'
        }
    },
    {
        name: 'Waterworld',
        tiles: {
            floor: 'gfx/theme-4/floor.jpg',
            wall: 'gfx/theme-4/wall.jpg',
            diamond: 'gfx/theme-4/diamond.png',
            door: 'gfx/theme-4/door.png',
            onestand: 'gfx/theme-4/one-stand.jpg',
            lock: 'gfx/theme-4/lock.png',
            oneway: 'gfx/theme-4/oneway.png',
            cycle: 'gfx/theme-4/cycle.png',
            box: 'gfx/theme-4/movable.png',
            corner: 'gfx/theme-4/corner.png'
        }
    }

]
function GameCreate() {

}
GameCreate.prototype.aboutscreenObjects = function () {
    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: 70,
        rotation: -0.02,
        scale: 0.4
    })
    Game.entities.push(riamond)


    // new bitmap

    var aboutText = new Bitmap({
        x: can.width / 2,
        y: can.height / 2 - 100,
        width: 700,
        height: 400
    })

    // draw text to bitmap context
    Game.font.drawMultiLineText({
        text: 'RIAMOND RUSH (c) 2014, 2024\n\n' +
            'PROGRAMMING: CHRISTIAN SONNTAG\n' +
            'LEVELS: CHRISTIAN+MONA SONNTAG, NICO GREIN\n' +
            'TESTING: CHRISTIAN+MONA SONNTAG, ALEX GREIN\n' +
            'SOUND: www.nosoapradio.us\n' +
            'CONTACT: www.motions-media.de\n\n' +
            'PROUDLY WRITTEN IN VANILLA JAVASCRIPT\n',
        xpos: 0,
        ypos: Game.font.getLineHeight(),
        lineOffset: 2,
        drawCtx: aboutText.ctx
    })

    Game.entities.push(aboutText)

    controls = new Sprite({
        imagename: 'gfx/control.png',
        x: can.width / 2,
        y: can.height - 200
    })
    Game.entities.push(controls)


    btnBackToStartScreen = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-back'),
        x: -200,
        y: can.height - 50,
        audio: btnSound
    })
    Game.entities.push(btnBackToStartScreen)

    Game.tweens.aboutScreenIn()

}


// easy,medium,hard screen ;o)
GameCreate.prototype.emhscreenObjects = function () {
    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: can.height / 2 - 200,
        rotation: -0.02
    })
    Game.entities.push(riamond)

    btnEasy = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-level-easy'),
        x: -600,
        y: can.height / 2 - 50,
        audio: btnSound
    })
    Game.entities.push(btnEasy)

    btnMedium = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-level-medium'),
        x: -800,
        y: can.height / 2 - 50,
        audio: btnSound
    })
    Game.entities.push(btnMedium)

    btnHard = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-level-hard'),
        x: -1000,
        y: can.height / 2 - 50,
        audio: btnSound
    })
    Game.entities.push(btnHard)

    btnBackToStartScreen = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-back'),
        x: -200,
        y: can.height - 125,
        audio: btnSound
    })
    Game.entities.push(btnBackToStartScreen)

    Game.tweens.emhScreenIn()

}

GameCreate.prototype.finalscreenObjects = function () {
    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: 70,
        rotation: -0.02,
        scale: 0.2
    })
    Game.entities.push(riamond)


    var finalText = new Bitmap({
        x: can.width / 2,
        y: can.height / 2,
        width: 700,
        height: 350
    })

    // draw text to bitmap context
    Game.font.drawMultiLineText({
        text: 'CONGRATULATIONS! YOU DID A GREAT JOB!\n\n' +
        'WE HOPE YOU HAVE A LOT OF FUN WITH THIS GAME!\n\n' +
        '',
        xpos: 0,
        ypos: Game.font.getLineHeight(),
        lineOffset: 3,
        drawCtx: finalText.ctx
    })

    Game.entities.push(finalText)

    btnBackToStartScreen = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-back'),
        x: -200,
        y: can.height - 125,
        audio: btnSound
    })
    Game.entities.push(btnBackToStartScreen)

    Game.tweens.finalScreenIn()

}


GameCreate.prototype.gamescreenObjects = function () {
    sfxback.pause()
    if (levelCounter % 2) {
        sfxback.src = "sfx/sound-ingame-2.ogg"
    } else {
        sfxback.src = "sfx/sound-ingame-1.ogg"
    }
    sfxback.play()

    Game.entities = []

    atlasGame = new Atlas('gfx/theme-' + currentlevel.theme + '/', 'theme.json')

    Game.levelname = {
        name: currentlevel.name,
        width: Game.font.getTextWidth(currentlevel.name)
    }

    if (Game.mobile) {
        player = new PlayerMobile({
            atlasimage: atlasGame.image,
            atlasdata: atlasGame.getPicByName('player-down'),
            frames: {
                up: atlasGame.getPicByName('player-up'),
                left: atlasGame.getPicByName('player-left'),
                down: atlasGame.getPicByName('player-down'),
                right: atlasGame.getPicByName('player-right')
            },
            x: currentlevel.startpoint.x,
            y: currentlevel.startpoint.y,
            nightmode: currentlevel.nightmode,
            digging: currentlevel.digging
        })
    } else {
        player = new PlayerDesktop({
            atlasimage: atlasGame.image,
            atlasdata: atlasGame.getPicByName('player-down'),
            frames: {
                up: atlasGame.getPicByName('player-up'),
                left: atlasGame.getPicByName('player-left'),
                down: atlasGame.getPicByName('player-down'),
                right: atlasGame.getPicByName('player-right')
            },
            x: currentlevel.startpoint.x,
            y: currentlevel.startpoint.y,
            nightmode: currentlevel.nightmode,
            digging: currentlevel.digging
        })
    }

    map = new LevelMap(currentlevel)

    Game.entities.push(player)

    if (currentlevel.nightmode) {
        Game.entities.push(emitterPlayer)
    }


    btnIngameMenu = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-ingame-menu'),
        x: -25,
        y: -25,
        audio: btnSound
    })

    Game.entities.push(btnIngameMenu)

    new TWEEN.Tween({x: btnIngameMenu.x, y: btnIngameMenu.y})
        .to({x: 25, y: 25}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnIngameMenu.x = this.x
            btnIngameMenu.y = this.y
        })
        .start();

    btnIngameRestart = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-ingame-restart'),
        x: can.width + 25,
        y: -25,
        audio: btnSound
    })
    Game.entities.push(btnIngameRestart)


    new TWEEN.Tween({x: btnIngameRestart.x, y: btnIngameRestart.y})
        .to({x: can.width - 25, y: 25}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnIngameRestart.x = this.x
            btnIngameRestart.y = this.y
        })
        .start();


    if (currentlevel.digging > 0) {
        btnIngameDigg = new Button({
            atlasimage: atlasUI.image,
            atlasdata: atlasUI.getPicByName('btn-ingame-digg'),
            x: can.width + 25,
            y: can.height + 25,
            audio: btnSound
        })
        Game.entities.push(btnIngameDigg)

        new TWEEN.Tween({x: btnIngameDigg.x, y: btnIngameDigg.y})
            .to({x: can.width - 25, y: can.height - 25}, 1000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function () {
                btnIngameDigg.x = this.x
                btnIngameDigg.y = this.y
            })
            .start();

    }

    welldone = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('well-done'),
        x: -100,
        y: 300,
        audio: btnSound
    })
    welldone.visible = false
    Game.entities.push(welldone)


    // render level title once to Bitmap
    var lTitle = '' + (levelCounter + 1) + '. ' + currentlevel.name,
        tWidth = Game.font.getTextWidth(lTitle) + 2,
        tHeight = Game.font.getLineHeight() + 24

    // new bitmap
    title = new Bitmap({
        x: can.width / 2,
        y: -200,
        width: tWidth,
        height: tHeight
    })

    // draw text to bitmap context
    Game.font.drawText({
        text: lTitle,
        xpos: 0,
        ypos: Game.font.getLineHeight(),
        drawCtx: title.ctx
    })

    Game.entities.push(title)

    var tween = new TWEEN.Tween({x: title.x, y: title.y})
        .to({y: 250}, 1000)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(function () {
            title.y = this.y
        })
        .onComplete(function () {

            setTimeout(function () {
                var tween = new TWEEN.Tween({x: title.x, y: title.y})
                    .to({y: 0}, 2000)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onUpdate(function () {
                        title.y = this.y
                    })
                    .start();
            }, 1000)

        })
        .start();

    diamondCounter = new DiamondCounter({
        diamondsNeeded: currentlevel.pointsToFinish / 20,
        position: {
            x: 20,
            y: 580
        }
    })

    Game.entities.push(diamondCounter)

}


GameCreate.prototype.levelscreenObjects = function () {
    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: can.height / 2 + 100,
        rotation: -0.02
    })
    Game.entities.push(riamond)

    // TODO create Buttons depending on emh select
    var colCounter = 0,
        rowCounter = 0,
        levelsPerScreen = 20,
        colX = 145,
        rowY = 50,
        colOffset = 130,
        rowOffset = 100,
        currLevel = parseInt(localStorage.getItem('playedLevels'))

    for (var i = 0 + ( emhSelectOffset * levelsPerScreen ), l = levelsPerScreen + ( emhSelectOffset * levelsPerScreen ); i < l; i++) {

        if (i > currLevel) {
            var btnType = 'btn-level-select-locked',
                level = i,
                locked = true
        } else {
            var btnType = 'btn-level-select',
                level = i,
                locked = false
        }

        level = new LevelButton({
            atlasimage: atlasUI.image,
            atlasdata: atlasUI.getPicByName(btnType),
            x: colX + (colOffset * colCounter),
            y: rowY + (rowOffset * rowCounter),
            audio: btnSound,
            denied: btnTick,
            data: {
                locked: locked,
                level: level
            }
        })

        Game.entities.push(level)
        colCounter += 1
        if (colCounter > 4) {
            colCounter = 0
            rowCounter += 1
        }

    }

    btnBackToStartScreen = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-back'),
        x: -200,
        y: can.height - 125,
        audio: btnSound
    })
    Game.entities.push(btnBackToStartScreen)

    Game.tweens.levelScreenIn()

}

GameCreate.prototype.startscreenObjects = function () {

    Game.entities = []

    Game.entities.push(emitterScreen)

    riamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-riamond-player'),
        x: 1400,
        y: can.height / 2 + 100,
        rotation: -0.02
    })
    Game.entities.push(riamond)

    textriamond = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-text-riamond'),
        x: -1000,
        y: 100
    })
    Game.entities.push(textriamond)


    textrush = new Sprite({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('title-text-rush'),
        _rotation: -9,
        x: -1500,
        y: 200
    })
    Game.entities.push(textrush)

    btnPlay = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-play'),
        x: -200,
        y: can.height - 200,
        audio: btnSound
    })
    btnAbout = new Button({
        atlasimage: atlasUI.image,
        atlasdata: atlasUI.getPicByName('btn-about'),
        x: -400,
        y: can.height - 125,
        audio: btnSound
    })


    btnGroupStart = new ButtonGroup({
        x: -600,
        y: can.height - 200,
        width: 500,
        type: 'hor',
        buttons: [btnPlay, btnAbout]
    })

    Game.entities.push(btnGroupStart)
    Game.entities.push(btnPlay)
    Game.entities.push(btnAbout)

    Game.tweens.startScreenIn()
}
function GameCallbacks() {

}




GameCallbacks.prototype.levelFinished = function () {
    player.canWalk = false
    success.play()
    levelCounter += 1

    Game.fn.raiseLevelNumberInLocalStorage()

    // check if all levels are played
    if (levelCounter >= Levels.length) {
        levelCounter = 0
        sfxback.pause()
        sfxback.src = 'sfx/sound-title.ogg'
        sfxback.play()
        Game.init.finalscreen()
        return
    }

    points = 0
    counter = currentlevel.timelimit
    currentlevel = JSON.parse(JSON.stringify(Levels[levelCounter]))            // 'copy' instead of call by reference


    welldone.visible = true

    var tween = new TWEEN.Tween({x: welldone.x, y: welldone.y})
        .to({x: 400}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            welldone.x = this.x
        })
        .onComplete(function () {

            setTimeout(function () {
                var tween = new TWEEN.Tween({x: welldone.x, y: welldone.y})
                    .to({x: 1000}, 1000)
                    .easing(TWEEN.Easing.Elastic.InOut)
                    .onUpdate(function () {

                        welldone.x = this.x
                        welldone.y = this.y

                    })
                    .onComplete(function () {
                        welldone.x = -100
                        welldone.visible = false
                        Game.create.gamescreenObjects()
                    })
                    .start();
            }, 500)
        })
        .start();
}
GameCallbacks.prototype.restart = function () {
    currentlevel = JSON.parse(JSON.stringify(Levels[levelCounter]))            // 'copy' instead of call by reference

    sumpoints -= points
    points = 0

    counter = currentlevel.timelimit
    Game.create.gamescreenObjects()
}

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
        url: '/sfx/save-lock.ogg'
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

    player = null
    Game.entities = []
    Game.create.finalscreenObjects()
    GAMESTATE_CURRENT = GAMESTATE_FINALSCREEN
}


function GameFunctions() {

}


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
GameFunctions.prototype.getEntityById = function (uid) {
    for (var i = 0, l = Game.entities.length; i < l; i++) {
        var entity = Game.entities[i]
        if (entity.uid === uid) {
            return entity
        }
    }
    return false
}

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


GameFunctions.prototype.loop = function () {
    // clear canvases
    ctx.clearRect(0, 0, can.width, can.height)
    bctx.clearRect(0, 0, bcan.width, bcan.height)

    if (Game.entities.length) {


        // update / draw entities
        try {
            for (var i = 0, l = Game.entities.length; i < l; i++) {
                Game.entities[i].update()
                Game.entities[i].draw()
            }
        } catch (e) {
            console.log(e)
        }


        ctx.drawImage(bcan, 0, 0)
        if (GAMESTATE_CURRENT === GAMESTATE_STARTSCREEN) {

            btnPlay.isClicked(function () {

                Game.tweens.startScreenOutGame()

            })

            btnAbout.isClicked(function () {

                Game.tweens.startScreenOutAbout()

            })


        }
        else if (GAMESTATE_CURRENT === GAMESTATE_EMHSCREEN) {

            btnEasy.isClicked(function () {
                emhSelectOffset = 0
                Game.tweens.emhScreenOut()
            })

            btnMedium.isClicked(function () {
                emhSelectOffset = 1
                Game.tweens.emhScreenOut()
            })

            btnHard.isClicked(function () {
                emhSelectOffset = 2
                Game.tweens.emhScreenOut()
            })

            btnBackToStartScreen.isClicked(function () {
                Game.tweens.emhScreenBack()
            })
        }
        else if (GAMESTATE_CURRENT === GAMESTATE_LEVELSCREEN) {

            btnBackToStartScreen.isClicked(function () {
                Game.tweens.levelScreenBack()
            })

            // check all buttons, set depending currentlevel and then jump to gamescreen

            for (var i = 0, l = Game.entities.length; i < l; i++) {
                var btn = Game.entities[i]
                if (btn instanceof Button) {
                    if (btn.isClicked() && btn.data) {
                        if (btn.data.locked === false) {
                            levelCounter = btn.data.level
                            Game.init.gamescreen()
                        }
                    }
                }
            }

        }
        else if (GAMESTATE_CURRENT === GAMESTATE_ABOUTSCREEN) {

            btnBackToStartScreen.isClicked(function () {
                Game.tweens.aboutScreenBack()
            })
        }
        else if (GAMESTATE_CURRENT === GAMESTATE_FINALSCREEN) {

            btnBackToStartScreen.isClicked(function () {
                Game.tweens.finalScreenBack()
            })
        }
        else if (GAMESTATE_CURRENT === GAMESTATE_GAMESCREEN) {

            btnIngameRestart.isClicked(function () {
                Game.callbacks.restart()
            })

            btnIngameMenu.isClicked(function () {
                sfxback.pause()
                sfxback.src = 'sfx/sound-title.ogg'
                sfxback.play()
                Game.init.startscreen()
            })

            if (btnIngameDigg) {
                btnIngameDigg.isClicked(function () {

                    if (map.digTo(player.x, player.y, player.currentDirection)) {
                        digg.play()
                        if (player.digging > 0) {
                            player.digging -= 1
                            if (player.digging === 0) {
                                btnIngameDigg.visible = false
                            }
                        }
                    }
                })
            }

            if (points === currentlevel.pointsToFinish && door.unlocked === false) {
                door.unlocked = true
                opendoor.play()
            }
        }
        TWEEN.update();
    }
    requestAnimationFrame(Game.fn.loop)
}

GameFunctions.prototype.raiseLevelNumberInLocalStorage = function () {
    var lvlNumber = parseInt(localStorage.getItem('playedLevels'))
    if (lvlNumber < levelCounter) {
        localStorage.setItem('playedLevels', levelCounter)
    }
}


GameFunctions.prototype.removeDiamondByPosition = function (x, y) {
    for (var i = 0, l = Game.entities.length; i < l; i++) {
        var entity = Game.entities[i]
        if (
            entity instanceof Diamond &&
            entity.x === x &&
            entity.y === y &&
            entity.visible === true
        ) {
            diamond.play()
            entity.visible = false
            points += entity.points
            sumpoints += entity.points
        }
    }
}

function GameTweens() { }


GameTweens.prototype.aboutScreenIn = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: can.width / 2}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();


    var tween = new TWEEN.Tween({x: btnBackToStartScreen.x, y: btnBackToStartScreen.y})
        .to({x: can.width / 2}, 1500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
        })
        .start();
}

GameTweens.prototype.aboutScreenBack = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
            Game.init.startscreen()
        })
        .start();

}

GameTweens.prototype.emhScreenIn = function () {

    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: can.width / 2}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnEasy.x, y: btnEasy.y})
        .to({x: can.width / 4}, 1500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnEasy.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnMedium.x, y: btnMedium.y})
        .to({x: can.width / 2}, 1750)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnMedium.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnHard.x, y: btnHard.y})
        .to({x: can.width / 4 * 3}, 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnHard.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnBackToStartScreen.x, y: btnBackToStartScreen.y})
        .to({x: can.width / 2}, 1500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
        })
        .start();
}

GameTweens.prototype.emhScreenOut = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
            btnEasy.x = this.x - (can.width / 4)
            btnMedium.x = this.x
            btnHard.x = this.x + (can.width / 4)
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
            Game.init.levelscreen()
        })
        .start();
}

GameTweens.prototype.emhScreenBack = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
            btnEasy.x = this.x - (can.width / 4)
            btnMedium.x = this.x
            btnHard.x = this.x + (can.width / 4)
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
            Game.init.startscreen()
        })
        .start();

}



GameTweens.prototype.finalScreenIn = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: can.width / 2}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();


    var tween = new TWEEN.Tween({x: btnBackToStartScreen.x, y: btnBackToStartScreen.y})
        .to({x: can.width / 2}, 1500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
        })
        .start();
}
GameTweens.prototype.finalScreenBack = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
            Game.init.startscreen()
        })
        .start();
}


GameTweens.prototype.levelScreenIn = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: can.width / 2}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnPlay.x, y: btnPlay.y})
        .to({x: can.width / 2}, 1250)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnPlay.x = this.x
        })
        .onComplete(function () {
        })
        .start();
    var tween = new TWEEN.Tween({x: btnBackToStartScreen.x, y: btnBackToStartScreen.y})
        .to({x: can.width / 2}, 1500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
        })
        .start();
}

GameTweens.prototype.levelScreenOut = function () {}

GameTweens.prototype.levelScreenBack = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
            btnBackToStartScreen.x = this.x
        })
        .onComplete(function () {
            Game.init.emhscreen()
        })
        .start();
}


GameTweens.prototype.startScreenIn = function () {
    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: can.width - 200}, 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: textriamond.x, y: textriamond.y})
        .to({x: can.width / 2}, 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            textriamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: textrush.x, y: textrush.y})
        .to({x: can.width / 2 + 100}, 2000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            textrush.x = this.x
        })
        .onComplete(function () {
        })
        .start();


    var tween = new TWEEN.Tween({x: btnGroupStart.x, y: btnGroupStart.y})
        .to({x: can.width / 2}, 2500)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(function () {
            btnGroupStart.x = this.x
        })
        .onComplete(function () {
        })
        .start();

}

GameTweens.prototype.startScreenOutGame = function () {

    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: -600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: textriamond.x, y: textriamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            textriamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: textrush.x, y: textrush.y})
        .to({x: -700}, 1500)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            textrush.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnGroupStart.x, y: btnGroupStart.y})
        .to({x: 1600}, 1500)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            btnGroupStart.x = this.x
        })
        .onComplete(function () {
            Game.init.emhscreen()
        })
        .start();

}



GameTweens.prototype.startScreenOutAbout = function () {

    var tween = new TWEEN.Tween({x: riamond.x, y: riamond.y})
        .to({x: -600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            riamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: textriamond.x, y: textriamond.y})
        .to({x: 1600}, 1000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            textriamond.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: textrush.x, y: textrush.y})
        .to({x: -700}, 2000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            textrush.x = this.x
        })
        .onComplete(function () {
        })
        .start();

    var tween = new TWEEN.Tween({x: btnGroupStart.x, y: btnGroupStart.y})
        .to({x: 1600}, 2000)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            btnGroupStart.x = this.x
        })
        .onComplete(function () {
            Game.init.aboutscreen()
        })
        .start();

}

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
//'use strict'



window.onload = function () {
    Game.init.main()

    joypad.on('connect', e => {
        gamepad = e
        console.log('Gamepad connected', gamepad)
    });

}


