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

