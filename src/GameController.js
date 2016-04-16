var level          = require('./Level.js');
var bob            = require('./Bob.js');
var TextDisplay    = require('./TextDisplay.js');
var Entity         = require('./entities/Entity.js');
var ShortAnimation = require('./entities/ShortAnimation.js');
var FadeTransition = require('./FadeTransition.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 2;

var nextLevel, nextDoor, nextSide;

// lock game when fade transition, text display, cutscene.
var isLocked    = null;
var fader       = new FadeTransition();
var textDisplay = new TextDisplay();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function GameController() {
	this.level       = level;
	this.bob         = bob;
	this.entities    = [];
	this.animations  = [];

	level.controller = this;
	bob.controller   = this;
	Entity.prototype.controller = this;
	ShortAnimation.prototype.controller = this;

	this.checkpoint = {
		levelId: 'ground0',
		bob: null // TODO
	};
}

module.exports = new GameController();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.saveState = function () {
	this.checkpoint = {
		levelId: this.level.id,
		bob: bob.saveState()
	};
};

GameController.prototype.restoreState = function () {
	if (!this.checkpoint) return;
	this.loadLevel(this.checkpoint.levelId);
	bob.restoreState(this.checkpoint.bob);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.addEntity = function (entity) {
	this.entities.push(entity);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.removeEntity = function (entity) {
	var index = this.entities.indexOf(entity);
	if (index === -1) return console.warn('entity does not exist');
	this.entities.splice(index, 1);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.addAnimation = function (animation) {
	this.animations.push(animation);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.removeAnimation = function (animation) {
	var index = this.animations.indexOf(animation);
	if (index === -1) return console.warn('entity does not exist');
	this.animations.splice(index, 1);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.loadLevel = function (id, doorId, side) {
	this.entities = []; // remove all entities
	level.load(id);
	if (doorId !== undefined) level.setBobPositionOnDoor(doorId);
	if (side) level.setBobPositionOnSide(bob, side);
	bob.setPosition(level.bobPos);
	if (doorId || doorId === 0) this.saveState();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.startFade = function () {
	isLocked = fader;
	var self = this;
	fader.start(null, function () {
		isLocked = null;
		self.loadLevel(nextLevel, nextDoor, nextSide);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.changeLevel = function (id, doorId) {
	this.startFade();
	nextLevel = id;
	nextDoor  = doorId;
	nextSide  = undefined;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.goToNeighbourLevel = function (direction) {
	if (!level[direction]) return false;
	this.startFade();
	nextLevel = level[direction];
	nextDoor  = undefined;
	nextSide  = direction;
	return true;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.displayDialog = function (dialog) {
	isLocked = textDisplay;
	textDisplay.start(dialog, function () {
		isLocked = null;
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.startCutScene = function (cutscene) {
	isLocked = cutscene;
	cutscene.start(function () {
		isLocked = null;
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.killBob = function (params) {
	var self = this;
	isLocked = fader;
	fader.start({ img: assets.ditherFonduRed }, function () {
		isLocked = null;
		self.restoreState();
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.update = function () {
	if (isLocked) return isLocked.update();

	bob.update();

	var scrollX = clip(bob.x - 28, 0, level.width  * TILE_WIDTH  - 64);
	var scrollY = clip(bob.y - 28, 0, level.height * TILE_HEIGHT - 64);

	cls();
	camera(scrollX, scrollY);
	level.draw();
	for (var i = this.entities.length - 1; i >= 0; i--) {
		this.entities[i].update(level, bob); // update and draw
	}
	for (var i = this.animations.length - 1; i >= 0; i--) {
		this.animations[i].update(); // update and draw
	}
	bob.draw();
};
