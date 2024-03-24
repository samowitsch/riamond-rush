var mousedown = false,
    btnGenerateMap,
    btnSaveToLocalStorage,
    btnLoadFromLocalStorage,
    btnSendMail,
    btnPlayMap,
    btnImportMap,
    selectOriginX,
    selectOriginY,
    storageTrigger = false


var Editor = {
    init: function () {
        document.getElementsByTagName('body')[0].addEventListener('mousedown', function () {
            mousedown = true
        })
        document.getElementsByTagName('body')[0].addEventListener('mouseup', function () {
            mousedown = false
        })
        Editor.selects.makeLevelSelect()
        Editor.selects.makeThemeSelect()
        Editor.drawRaster()
        Editor.origin.create()
        Editor.addTileListeners()

        // add generate event handler
        btnGenerateMap = document.querySelector('#generate')
        btnGenerateMap.addEventListener('click', Editor.callbacks.generateMap)

        // add save to localStorage event handler
        btnSaveToLocalStorage = document.querySelector('#savetostorage')
        btnSaveToLocalStorage.addEventListener('click', Editor.callbacks.saveToStorage)

        // add save to localStorage event handler
        btnLoadFromLocalStorage = document.querySelector('#loadfromstorage')
        btnLoadFromLocalStorage.addEventListener('click', Editor.callbacks.loadFromStorage)

        // add save to localStorage event handler
        btnSendMail = document.querySelector('#sendmail')
        btnSendMail.addEventListener('click', Editor.callbacks.sendMail)


        // add play event handler
        btnPlayMap = document.querySelector('#play')
        btnPlayMap.addEventListener('click', Editor.callbacks.playMap)

        // add origin listeners
        selectOriginX = document.querySelector('#startpointx')
        selectOriginY = document.querySelector('#startpointy')

        selectOriginX.addEventListener('change', Editor.callbacks.originChanged)
        selectOriginY.addEventListener('change', Editor.callbacks.originChanged)

    },
    callbacks: {
        playMap: function () {
            Editor.callbacks.generateMap()
            var output = document.getElementById('output'),
                level = output.value,
                url = '/index.html?leveleditor=' + encodeURI(level)

            iframe = document.createElement('iframe')
            iframe.id = 'playit'
            iframe.class = 'lightbox'
            iframe.width = 800
            iframe.height = 600
            iframe.src = url
            document.getElementsByTagName('body')[0].appendChild(iframe)

            $.featherlight($('#playit'), {type: 'html'})

            console.log(iframe, level)

        },
        originChanged: function () {
            Editor.origin.setOrigin(
                document.querySelector('#startpointx').value,
                document.querySelector('#startpointy').value
            )
        },
        importMap: function () {
            if (storageTrigger === true) {
                var storage = localStorage.getItem('tempLevel'),
                    levelData = JSON.parse(storage)
                storageTrigger = false
                document.querySelector('#output').value = storage
            } else {
                var levelData = Levels[document.querySelector('#levels').value]
            }

            document.querySelector('#levelname').value = levelData.name
            document.querySelector('#author').value = levelData.author || 'unknown'

            // set night mode checkbox
            document.querySelector('#nightmode').checked = levelData.nightmode
            // set night mode radius
            document.querySelector('#nightmoderadius').value = levelData.nightmoderadius
            // set theme select
            document.querySelector('#themes').value = levelData.theme
            // set startpoint x
            document.querySelector('#startpointx').value = levelData.startpoint.x
            // set startpoint y
            document.querySelector('#startpointy').value = levelData.startpoint.y
            // digging
            document.querySelector('#digging').value = levelData.digging

            Editor.origin.setOrigin(levelData.startpoint.x, levelData.startpoint.y)

            // set tiles in map
            for (var i = 0, l = levelData.data.length; i < l; i++) {
                // get tile infos
                var ti = document.querySelector('#t' + levelData.data[i]),
                    image = ti.getAttribute('image'),
                    rotation = ti.getAttribute('rotation')

                // set gridtile
                var gt = document.querySelector('#tile-' + (i + 1))

                if (levelData.data[i] === 0) {
                    gt.setAttribute('value', levelData.data[i])
                    gt.setAttribute('style', 'background: #333;border: 1px solid #666;')
                } else {
                    gt.setAttribute('value', levelData.data[i])
                    gt.setAttribute('style', 'background: url(' + image + '); -webkit-transform: rotate(' + rotation + 'deg); transform: rotate(' + rotation + 'deg); border: none;')
                }
            }
            document.querySelector('#output').value = ''
        },
        loadFromStorage: function () {
            storageTrigger = true
            Editor.callbacks.importMap()
        },
        saveToStorage: function () {
            Editor.callbacks.generateMap()
            localStorage.setItem('tempLevel', document.querySelector('#output').value)
        },
        generateMap: function () {
            var tileids = [],
                btnTiles = document.querySelectorAll('.btntile'),
                output = document.querySelector('#output'),
                pointsToFinish = 0;

            for (var i = 0, l = btnTiles.length; i < l; i++) {
                var tileid = parseInt(btnTiles[i].getAttribute('value'))
                tileids.push(tileid)
                if (tileid === 2) {
                    pointsToFinish += 20
                }
            }

            var lvl = {
                name: document.querySelector('#levelname').value,
                author: document.querySelector('#author').value,
                digging: parseInt(document.querySelector('#digging').value),
                timelimit: 50,
                startpoint: {
                    x: parseInt(document.querySelector('#startpointx').value),
                    y: parseInt(document.querySelector('#startpointy').value)
                },
                nightmode: (document.querySelector('#nightmode').checked === true) ? 1 : 0,
                nightmoderadius: parseInt(document.querySelector('#nightmoderadius').value) || 0,
                theme: parseInt(document.querySelector('#themes').value),
                pointsToFinish: pointsToFinish,
                data: tileids
            }
            output.value = JSON.stringify(lvl)

        },
        tileListeners: function () {
            var tl = document.querySelector('input[name=tileid]:checked'),
                image = tl.getAttribute('image'),
                rotation = tl.getAttribute('rotation') || 0,
                id = tl.getAttribute('value');
            if (id === '0') {
                this.setAttribute('value', id)
                this.setAttribute('style', 'background: #333;border: 1px solid #666;')
            } else {
                this.setAttribute('value', id)
                this.setAttribute('style', 'background: url(' + image + '); -webkit-transform: rotate(' + rotation + 'deg); transform: rotate(' + rotation + 'deg); border: none;')
            }
        },
        btnTilesMouseOver: function () {
            if (mousedown) {
                var tl = document.querySelector('input[name=tileid]:checked'),
                    image = tl.getAttribute('image'),
                    rotation = tl.getAttribute('rotation') || 0,
                    id = tl.getAttribute('value');
                if (id === '0') {
                    this.setAttribute('value', id)
                    this.setAttribute('style', 'background: #333;border: 1px solid #666;')
                } else {
                    this.setAttribute('value', id)
                    this.setAttribute('style', 'background: url(' + image + '); -webkit-transform: rotate(' + rotation + 'deg); transform: rotate(' + rotation + 'deg); border: none;')
                }
            }
        },
        sendMail: function () {
            Editor.callbacks.generateMap()
            var output = document.querySelector('#output'),
                level = output.value

            var link = 'http://www.motions-media.de/developing/riamond-rush/index.html?level=' + encodeURI(level)

            var bodyText = encodeURIComponent('LINK:\r\n' + link + '\r\n\r\n\r\n\r\nLEVELDATA:\r\n' + level)

            var mailto_link = 'mailto:info@motions-media.de?subject=Riamond Rush - Level: ' + document.querySelector('#levelname').value +
                '&body=' + bodyText

            var win = window.open(mailto_link, 'emailWindow')

            setTimeout(function(){
                if (win && win.open && !win.closed) win.close()
            }, 300)

        }
    },
    addTileListeners: function () {
        // add button event handler
        var btnTiles = document.querySelectorAll('.btntile')
        for (var i = 0, l = btnTiles.length; i < l; i++) {
            btnTiles[i].addEventListener('click', Editor.callbacks.tileListeners)
            btnTiles[i].addEventListener('mouseover', Editor.callbacks.btnTilesMouseOver)
        }
    },
    drawRaster: function () {
        // draw the raster
        var raster = document.querySelector('#raster'),
            col = 800 / 50,
            row = 600 / 50

        for (var i = 0, l = col * row; i < l; i++) {
            var btn = document.createElement('button')
            btn.setAttribute('id', 'tile-' + (i + 1))
            btn.setAttribute('class', 'btntile')
            btn.setAttribute('value', '0')
            raster.appendChild(btn)
        }

    },
    selects: {
        makeThemeSelect: function () {
            // generate select themes
            var themeSelect = document.querySelector('#themes')
            for (var i = 0, l = Themes.length; i < l; i++) {
                var option = document.createElement('option')
                option.setAttribute('value', i)
                option.innerText = Themes[i].name

                themeSelect.appendChild(option)
            }
        },
        makeLevelSelect: function () {
            // generate select levels
            var levelSelect = document.querySelector('#levels')

            for (var i = 0, l = Levels.length; i < l; i++) {
                var option = document.createElement('option')
                option.setAttribute('value', i)
                option.innerText = '' + (i + 1) + '. ' + Levels[i].name

                levelSelect.appendChild(option)
            }
            levelSelect.addEventListener('change', Editor.callbacks.importMap)
        }
    },
    origin: {
        create: function () {
            var raster = document.querySelector('#raster'),
                origin = document.createElement('div')
            origin.setAttribute('class', 'origin')
            origin.setAttribute('title', 'startpoint of player')
            raster.appendChild(origin)
        },
        setOrigin: function (x, y) {
            document.querySelector('.origin').setAttribute('style', 'top:' + (parseInt(y) - 25) + 'px;left:' + (parseInt(x) - 25) + 'px')
        }
    }
}

window.onload = function () {

    Editor.init();

}
