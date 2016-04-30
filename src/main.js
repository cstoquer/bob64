var DEBUG = false;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// PREPARE LEVELS

function createDefaultLevel(id, error) {
	error = error || '';
	// TODO check map existance
	var geometryId = id + "_geo";
	var background = id;
	var bgcolor = 0;
	if (!getMap(geometryId)) return console.error(error + ': No geometry found for level ' + id);
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
	intro:             require('./cutscenes/intro.js'),
	cloudFairy:        require('./cutscenes/cloudFairy.js'),
	waterFairy:        require('./cutscenes/waterFairy.js'),
	fireFairy:         require('./cutscenes/fireFairy.js'),
	beforeLastBattle:  require('./cutscenes/beforeLastBattle.js'),
	afterLastBattle:   require('./cutscenes/afterLastBattle.js')
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


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// DEBUGGING FUNCTIONS 

if (DEBUG) {
	var domUtils     = require('domUtils');
	var createDom    = domUtils.createDom;
	var createDiv    = domUtils.createDiv;
	var makeButton   = domUtils.makeButton;
	var makeDragable = domUtils.makeDragable;

	window.controller = gameController;
	window.bob        = gameController.bob;
	window.level      = gameController.level;

	// load cutscene from console
	window.cutscene = function (id) {
		var cutscene = CUTSCENES_ANIMATIONS[id];
		if (!cutscene) return console.error('cutscene does not exist: ' + id);
		gameController.startCutScene(cutscene(gameController));
	}

	// load level from console
	function loadLevel(id) {
		// let's try to create the level if it does't exist
		if (!assets.levels[id]) createDefaultLevel(id);
		gameController.loadLevel(id);
		gameController.saveState();
	};

	window.loadLevel = loadLevel;

	// level loader panel
	var levelLoader = createDiv('panel');
	makeDragable(createDiv('panelHandle', levelLoader), levelLoader).innerText = 'LEVELS';

	for (var id in levels) {
		var btn = createDiv('button', levelLoader);
		btn.innerText = id;
		btn.levelId = id;
		makeButton(btn, function (e, btn) {
			loadLevel(btn.levelId);
		});
	}

	// hack Bob abilities
	var bob = require('./Bob.js');
	bob.canAttack     = true;
	bob.canDive       = true;
	bob.canDoubleJump = true;

	var bobAbilities = createDiv('panel');
	makeDragable(createDiv('panelHandle', bobAbilities), bobAbilities).innerText = 'BOB';

	var abilities = ['canAttack', 'canDive', 'canDoubleJump', 'hasCloudFairy', 'hasWaterFairy', 'hasFireFairy'];

	for (var i = 0; i < abilities.length; i++) {
		var ability = abilities[i];
		var btn = createDiv('button', bobAbilities);
		btn.ability   = ability;
		btn.checkbox  = createDiv('checkbox', btn);
		createDom('span', '', btn).innerText = ability;
		btn.checkbox.innerText = bob[btn.ability] ? 'X' : '.';
		makeButton(btn, function (e, btn) {
			bob[btn.ability] = !bob[btn.ability];
			btn.checkbox.innerText = bob[btn.ability] ? 'X' : '.';
		});
	}

	createDiv('separator', bobAbilities)

	// restore life
	makeButton(createDiv('button', bobAbilities), function (e, btn) {
		bob.lifePoints = bob.maxLifePoints;
	}).innerText = 'restore life';

	// skip
	makeButton(createDiv('button', bobAbilities), function (e, btn) {
		gameController.unlock();
	}).innerText = 'skip cutscene';
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// START GAME
gameController.loadLevel('inside');
gameController.saveState();

// start intro
gameController.startCutScene(CUTSCENES_ANIMATIONS.intro(gameController));

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	gameController.update();
};
