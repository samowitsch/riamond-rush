var can, bctx, emitter, emitters = []

var PE = {
    clicked: false,
    imageData: '',
    emitterData: {},
    emitterDataJson: '',
    init: function () {
        // form changes
        document.forms.particleeditor.addEventListener('change', function (evt) {
            PE.process()
        })

        // change on demo select
        document.querySelector('#demos').addEventListener('change', function (evt) {
            if (evt.target.value !== '') {
                PE.loadPresets(evt.target.value)
            }
        })

        // click on canvas
        document.querySelector('canvas').addEventListener('mousedown', function (evt) {
            var rect = can.getBoundingClientRect();
            PE.clicked = true
            PE.setPosition(evt.layerX - rect.left, evt.layerY - rect.top)
        })
        document.querySelector('canvas').addEventListener('mouseup', function (evt) {
            PE.clicked = false
        })

        document.querySelector('canvas').addEventListener('mousemove', function (evt) {
            if (PE.clicked) {
                var rect = can.getBoundingClientRect();
                PE.setPosition(evt.layerX - rect.left, evt.layerY - rect.top)
            }
        })

        PE.initFileAPI()
    },
    initFileAPI: function () {
        var holder = document.getElementById('holder'),
            state = document.getElementById('status')

        if (typeof window.FileReader === 'undefined') {
            holder.className = 'fail'
            state.className = 'fail'
            state.innerHTML = '<b>NO</b> File API & FileReader available'
        } else {
            holder.className = 'success'
            state.className = 'success'
            state.innerHTML = 'File API & FileReader available'
        }

        holder.ondragover = function () {
            this.className = 'hover'
            return false;
        };
        holder.ondragend = function () {
            this.className = ''
            return false;
        };
        holder.ondrop = function (e) {
            this.className = ''
            e.preventDefault()

            var file = e.dataTransfer.files[0],
                reader = new FileReader()
            reader.onload = function (event) {
                console.log(event.target)
                PE.imageData = event.target.result;
                holder.style.background = 'url(' + event.target.result + ') no-repeat'

                PE.process()
            }

            reader.readAsDataURL(file)

            return false;
        }
    },
    process: function () {
        emitters = []
        PE.getFormValues()
        document.querySelector('textarea').value = PE.emitterDataJson
        emitters.push(
            emitter = new ParticleEmitter({
                jsonData: PE.emitterData
            })
        )
    },
    loadPresets: function (name) {
        emitters = []

        emitter = new ParticleEmitter({
            jsonFile: 'js/editors/particle/effects/' + name
        })

        emitters.push(emitter)

        PE.setFormValues(emitter.settings)
    },
    setPosition: function (x, y) {
        document.forms.particleeditor.positionX.value = x
        document.forms.particleeditor.positionX_V.value = x
        document.forms.particleeditor.positionY.value = y
        document.forms.particleeditor.positionY_V.value = y
        emitter.position = {x: x, y: y}
    },
    setFormValues: function (settings) {
        for (prop in settings) {
            if (prop === 'color' || prop === 'colorVariance' || prop === 'endColor' || prop === 'endColorVariance' || prop === '') {
                continue
            } else if (prop === 'type') {
                document.forms.particleeditor[prop].value = emitter.settings[prop]
            } else if (prop === 'oneShot' || prop === 'additiveBlend' || prop === 'scaleUniform') {
                if (emitter.settings[prop]) {
                    document.forms.particleeditor[prop].checked = true
                } else {
                    document.forms.particleeditor[prop].checked = false
                }
            } else if (prop === 'imageData') {
                PE.imageData = emitter.settings[prop]
                holder.style.background = 'url(' + emitter.settings[prop] + ') no-repeat'
            } else {
                try {
                    document.forms.particleeditor[prop].value = emitter.settings[prop]
                    document.forms.particleeditor[prop + '_V'].value = emitter.settings[prop]
                } catch (e) {
                    console.log('ERROR: ', prop)
                }
            }
        }
    },
    getFormValues: function () {
        var form = document.forms.particleeditor,
            opt = {}
        for (var i = 0, l = form.length; i < l; i++) {
            var element = form[i],
                key = element.name,
                value = element.value

            if (element.type === 'checkbox') {
                opt[key] = (element.checked === true) ? 1 : 0
            } else if (element.type === 'select-one') {
                opt[key] = value
            } else {
                if (key.indexOf('_') == -1) {
                    opt[key] = parseFloat(value)
                }
            }
        }
        opt.color = {
            r: parseFloat(form.colorR.value),
            g: parseFloat(form.colorG.value),
            b: parseFloat(form.colorB.value),
            a: parseFloat(form.colorA.value)
        }

        opt.colorVariance = {
            r: parseFloat(form.colorVarianceR.value),
            g: parseFloat(form.colorVarianceG.value),
            b: parseFloat(form.colorVarianceB.value),
            a: parseFloat(form.colorVarianceA.value)
        }

        opt.endColor = {
            r: parseFloat(form.endColorR.value),
            g: parseFloat(form.endColorG.value),
            b: parseFloat(form.endColorB.value),
            a: parseFloat(form.endColorA.value)
        }

        opt.endColorVariance = {
            r: parseFloat(form.endColorVarianceR.value),
            g: parseFloat(form.endColorVarianceG.value),
            b: parseFloat(form.endColorVarianceB.value),
            a: parseFloat(form.endColorVarianceA.value)
        }


        opt.imageData = PE.imageData
        PE.emitterData = opt
        PE.emitterDataJson = JSON.stringify(opt)
    }
}


window.onload = function () {

    // add canvas
    can = document.createElement('canvas')
    can.width = 800
    can.height = 600
    document.querySelector('.can').appendChild(can)

    // add textarea
    out = document.createElement('textarea')
    document.querySelector('.can').appendChild(out)

    bctx = can.getContext('2d')
    bctx.fillStyle = '#aa0000'


    emitter = new ParticleEmitter({
        jsonFile: 'js/editors/particle/effects/riamond-rush-fire.json'
    })
    emitters.push(emitter)

    PE.setFormValues(emitter.settings)

    // start loop
    setInterval(function () {
        bctx.clearRect(0, 0, can.width, can.height)
        // if there is an object we will render it ;-)
        for (var i = 0, l = emitters.length; i < l; i++) {
            emitters[i].update()
            emitters[i].draw()
        }
        bctx.fillText('Particles: ' + emitters[0].particles.length, 5, 10)
    }, 1000 / 60)

    PE.init()
}









