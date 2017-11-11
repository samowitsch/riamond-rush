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

