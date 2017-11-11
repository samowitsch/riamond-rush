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



