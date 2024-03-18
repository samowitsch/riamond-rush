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

