function Sprite(opt) {
    this.uid = opt.uid || 0

    // normal image
    this.picturename = opt.imagename || false

    this.nightmode = opt.nightmode || 0
    this.nightmoderadius = opt.nightmoderadius || 0

    this.x = opt.x || 0
    this.y = opt.y || 0

    this.scale = opt.scale || 1

    this.alpha = 1
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

