var DEBUG = true;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// PREPARE LEVELS

function createDefaultLevel(id, error) {
	// TODO check map existance
	var geometryId = id + "_geo";
	var background = id;
	var bgcolor = 0;
	if (!getMap(geometryId)) return console.error('No geometry found for level', id);
	if (!getMap(background)) { background = geometryId; bgcolor = 10; }
	// if only geo exist, create a default for rendering
	var level = { "name": "", "background": background, "geometry": geometryId, "bgcolor": bgcolor, "doors": ["", "", ""] };
	assets.levels[id] = level;
	if (error) console.error();
	return true;
}

var levels = assets.levels;
var doors  = assets.doors;

for (var id in levels) {
	var level = levels[id];
	if (!level.background) level.background = id;
	if (!level.geometry)   level.geometry   = id + '_geo';
	level.doors = ['', '', ''];
}

for (var i = 0; i < doors.length; i++) {
	var door = doors[i];

	var doorA = door[0];
	var doorB = door[1];

	var doorAsplit = doorA.split(':');
	var doorBsplit = doorB.split(':');

	var levelA = doorAsplit[0];
	var levelB = doorBsplit[0];

	var doorIdA = doorAsplit[1] - 1;
	var doorIdB = doorBsplit[1] - 1;

	if (!levels[levelA] && createDefaultLevel(levelA, 'Level does not exist for this door: ' + door)) continue;
	if (!levels[levelB] && createDefaultLevel(levelB, 'Level does not exist for this door: ' + door)) continue;

	levels[levelA].doors[doorIdA] = levelB + ':' + doorIdB;
	levels[levelB].doors[doorIdB] = levelA + ':' + doorIdA;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// PREPARE CUTSCENES

var CUTSCENES_ANIMATIONS = {
	bossIntro:       require('./cutscenes/bossIntro.js'),
	cloudFairy:      require('./cutscenes/cloudFairy.js'),
	bossFirstFairy:  require('./cutscenes/bossFirstFairy.js'),
	waterFairy:      require('./cutscenes/waterFairy.js'),
	bossSecondFairy: require('./cutscenes/bossSecondFairy.js'),
	fireFairy:       require('./cutscenes/fireFairy.js'),
	bossLastFairy:   require('./cutscenes/bossLastFairy.js')
};

var cutscenes = assets.cutscenes;

for (var i = 0; i < cutscenes.length; i++) {
	var cutscene   = cutscenes[i];
	var levelId    = cutscene.level;
	var cutsceneId = cutscene.cutsceneId;
	if (!CUTSCENES_ANIMATIONS[cutsceneId]) {
		console.error('Cut scene is not included in build:' + cutsceneId, cutscene);
		continue;
	}
	var level = levels[levelId];
	if (!level && createDefaultLevel(levelId, 'Level does not exist for this cutscene: ' + cutsceneId)) continue;
	level.cutscene = CUTSCENES_ANIMATIONS[cutsceneId];
}


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var gameController = require('./GameController.js');

gameController.loadLevel('ground0');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// DEBUGGING FUNCTIONS 

if (DEBUG) {
	window.controller = gameController;
	window.bob        = gameController.bob;
	window.level      = gameController.level;
	// load level from console
	window.loadLevel = function (id) {
		// let's try to create the level if it does't exist
		if (!assets.levels[id]) createDefaultLevel(id);
		gameController.loadLevel(id);
		gameController.saveState();
	}

	// hack Bob abilities
	var bob = require('./Bob.js');
	bob.canDive       = true;
	bob.canDoubleJump = true;
	bob.canAttack     = true;
}


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	gameController.update();
};
