function ButtonGroup(opt) {

    this.buttons = opt.buttons || []

    if ( this.buttons.length < 2) {
        throw 'min. Buttons needed for ButtonGroup'
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

