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
