var DEBUG = true;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// PREPARE LEVELS
var levels = assets.levels;
var doors  = assets.doors;

for (var id in levels) {
	var level = levels[id];
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

	var doorIdA = doorAsplit[1];
	var doorIdB = doorBsplit[1];

	if (!levels[levelA] || !levels[levelB]) {
		console.error('Level does not exist for this door', door);
		continue;
	}

	levels[levelA].doors[doorIdA] = doorB;
	levels[levelB].doors[doorIdB] = doorA;
}


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var gameController = require('./GameController.js');

gameController.loadLevel("start");

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// DEBUGGING FUNCTIONS 

if (DEBUG) {
	// load level from console
	window.loadLevel = function (id) {
		if (!assets.levels[id]) {
			// let's try to create the level
			var level = { "name": "", "background": id, "geometry": id + "_geo", "bgcolor": 6, "doors": ["", "", ""] };
			assets.levels[id] = level;
		}
		gameController.loadLevel(id);
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
