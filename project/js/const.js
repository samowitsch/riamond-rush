// gamepad detection in Chrome
//var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

var EMPTY = 0,
    WALL = 1,
    DIAMOND = 2,
    DOOR = 3,
    ONEWAY_UP = 4,
    ONEWAY_RIGHT = 5,
    ONEWAY_DOWN = 6,
    ONEWAY_LEFT = 7,
    CYCLE_VER = 8,
    CYCLE_HOR = 9,
    CORNER_UP = 10,
    CORNER_RIGHT = 11,
    CORNER_DOWN = 12,
    CORNER_LEFT = 13,
    ONE_STAND = 14,
    MOVABLE = 15,


    WALK_UP = 0,
    WALK_RIGHT = 90,
    WALK_DOWN = 180,
    WALK_LEFT = 270,

    KEY_ESC = 27,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    KEY_R = 82,
    KEY_D = 68,
    KEY_SPACE = 32,

    GAMESTATE_CURRENT,
    GAMESTATE_STARTSCREEN = 1,
    GAMESTATE_LEVELSCREEN = 2,
    GAMESTATE_GAMESCREEN = 3,
    GAMESTATE_FINALSCREEN = 4,
    GAMESTATE_ABOUTSCREEN = 5,
    GAMESTATE_EMHSCREEN = 6;
