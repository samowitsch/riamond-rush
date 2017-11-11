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

