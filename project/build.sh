#!/bin/bash

path=dist

timestamp() {
  date +"%s"
}

#chmod ugo+x combine.sh

echo "$(timestamp): start building riamond"

#./js/libs/screenfull.min.js \


cat ./js/particle/functions.js \
./js/particle/vector2d.js \
./js/particle/rgbcolor.js \
./js/particle/particle.js \
./js/particle/emitter.js \
./js/common/util.js \
./js/libs/requestAnimFrame.js \
./js/libs/howler.min.js \
./js/libs/joypad.min.js \
./js/libs/Tween.js \
./js/const.js \
./js/audio/audioproxy.js \
./js/globals.js \
./js/core/atlas.js \
./js/core/bitmap.js \
./js/core/bitmapfont.js \
./js/core/sprite.js \
./js/map/tiles/wall.js \
./js/map/tiles/moveable.js \
./js/map/tiles/floor.js \
./js/map/tiles/onestand.js \
./js/map/tiles/door.js \
./js/map/tiles/oneway.js \
./js/map/tiles/cycle.js \
./js/map/tiles/trickycorner.js \
./js/map/tiles/points.js \
./js/map/tiles/diamond.js \
./js/map/levelmap.js \
./js/player/desktop.js \
./js/player/mobile.js \
./js/game/ui/button.js \
./js/game/ui/levelbutton.js \
./js/game/ui/buttongroup.js \
./js/game/ui/diamondcounter.js \
./js/game/levels.js \
./js/game/themes.js \
./js/game/create.js \
./js/game/create/aboutscreen.js \
./js/game/create/emhscreen.js \
./js/game/create/finalscreen.js \
./js/game/create/gamescreen.js \
./js/game/create/levelscreen.js \
./js/game/create/startscreen.js \
./js/game/callbacks.js \
./js/game/callbacks/levelfinished.js \
./js/game/callbacks/restart.js \
./js/game/init.js \
./js/game/functions.js \
./js/game/functions/countdown.js \
./js/game/functions/getentitybyid.js \
./js/game/functions/getentitybyidandinstance.js \
./js/game/functions/loop.js \
./js/game/functions/raiselevelnumberinlocalstorage.js \
./js/game/functions/removediamondbyposition.js \
./js/game/tweens.js \
./js/game/tweens/aboutscreen.js \
./js/game/tweens/emhscreen.js \
./js/game/tweens/finalscreen.js \
./js/game/tweens/levelscreen.js \
./js/game/tweens/startscreen.js \
./js/game/game.js \
./js/main.js > ./$path/riamond.js

echo "$(timestamp): Files merged"


echo "$(timestamp): executing minifyjs"
./node_modules/.bin/esbuild ./$path/riamond.js --bundle --minify --sourcemap --target=chrome58,firefox57,safari11,edge16 --outfile=./$path/riamond.min.js


if command -v TexturePacker &> /dev/null
then
    echo "$(timestamp): generating gfx-ui"
    TexturePacker ./gfx/gfx-ui.tps

    echo "$(timestamp): generating theme-0"
    TexturePacker ./gfx/theme-0/theme.tps

    echo "$(timestamp): generating theme-0"
    TexturePacker ./gfx/theme-1/theme.tps

    echo "$(timestamp): generating theme-0"
    TexturePacker ./gfx/theme-2/theme.tps

    echo "$(timestamp): generating theme-0"
    TexturePacker ./gfx/theme-3/theme.tps

    echo "$(timestamp): generating theme-0"
    TexturePacker ./gfx/theme-4/theme.tps

else
    echo "$(timestamp): TexturePacker missing! Maybe your are working not on macOS?"

fi

echo "$(timestamp): finished building riamond"

