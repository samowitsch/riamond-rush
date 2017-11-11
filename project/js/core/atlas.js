
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
