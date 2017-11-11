#!/bin/bash

path=js

timestamp() {
  date +"%s"
}

#chmod ugo+x combine.sh 

echo "$(timestamp): start building riamond"

#./js/libs/screenfull.min.js \


cat ./js/CocoonJSExtensions/cocoon.js \
./js/CocoonJSExtensions/CocoonJS.js \
./js/CocoonJSExtensions/CocoonJS_App.js \
./js/CocoonJSExtensions/CocoonJS_Ad.js \
./js/particle/functions.js \
./js/particle/vector2d.js \
./js/particle/rgbcolor.js \
./js/particle/particle.js \
./js/particle/emitter.js \
./js/common/util.js \
./js/libs/requestAnimFrame.js \
./js/libs/Tween.js \
./js/const.js \
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
./js/map/map.js \
./js/player/desktop.js \
./js/player/mobile.js \
./js/game/ui/button.js \
./js/game/ui/levelbutton.js \
./js/game/ui/buttongroup.js \
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
./js/game/callbacks/onbannerhidden.js \
./js/game/callbacks/onbannerready.js \
./js/game/callbacks/onbannershow.js \
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


#running yuicompressor
java -jar ./tools/yuicompressor-2.4.8.jar ./$path/riamond.js -o ./$path/riamond.yui.min.js --charset utf-8
echo "$(timestamp): Minified standard version (yuicompressor)"


#running closure compiler (ECMASCRIPT5, ECMASCRIPT5_STRICT)
java -jar ./tools/compiler.jar --js=./$path/riamond.js --js_output_file ./$path/riamond.closure.min.js --language_in ECMASCRIPT5 --source_map_format V3 --create_source_map ./$path/riamond.closure.min.js.map
echo "$(timestamp): Minified standard version (closure compiler)"

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

# delete zip archive
echo "$(timestamp): delete old zip file"
rm riamond-rush.zip

#zipping needed files for cocoonjs
zip -rq riamond-rush.zip index.html gfx/ css/ js/ sfx/ font/ effects/
echo "$(timestamp): zipped file for cocoonjs"


echo "$(timestamp): finished building riamond"

