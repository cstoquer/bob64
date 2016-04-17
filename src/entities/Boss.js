var Entity         = require('./Entity.js');
var Bloc           = require('./Bloc.js');
var AABBcollision  = require('../AABBcollision.js');
var tiles          = require('../tiles.js');
var ShortAnimation = require('./ShortAnimation.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];


var expl = assets.entities.explosion;
var EXPLOSION_ANIMATION = [expl.frame0, expl.frame1, expl.frame2, expl.frame3, expl.frame4, expl.frame5, expl.frame6, expl.frame7, expl.frame8];

var BOSS_IDLE_IMG = assets.entities.boss.boss; // TODO

var BLOC_POSITIONS = [
	{ x:  4, y: 10, sprite: 163 },
	{ x:  8, y: 10, sprite: 163 },
	{ x: 12, y: 10, sprite: 163 }
];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** an item tied to a tile that should disapear from the whole game once removed
 *  e.g. life container, boss door
 */
function Boss() {
	Entity.call(this);
	this.width  = TILE_WIDTH  * 2;
	this.height = TILE_HEIGHT * 5;
	this.flipH = false;

	this.lifePoints = 3;
	this.phase = 0;
	this.blocCount = 0;

	this.isAttackable = false;

	this.createPlots();
}
inherits(Boss, Entity);
module.exports = Boss;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** return true if entity needs to check collision with level */
Boss.prototype.move = function (level, bob) {
	return false;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Boss.prototype.createPlots = function () {
	var boss = this;
	this.blocCount = BLOC_POSITIONS.length;

	function onPlotDestruct() {
		boss.blocCount -= 1;
		if (boss.blocCount <= 0) {
			boss.isAttackable = true;
			boss.flipH = true;
			// TODO anim boss
		}
	}

	for (var i = 0; i < BLOC_POSITIONS.length; i++) {
		var def  = BLOC_POSITIONS[i];
		var bloc = new Bloc(null, def, onPlotDestruct);
		this.controller.addEntity(bloc);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Boss.prototype.hit = function (bob) {
	// destroy bloc
	
	// TODO

	// animations
	this.controller.addAnimation(new ShortAnimation(EXPLOSION_ANIMATION, 0.5).setPosition(this.x - 8, this.y - 8));

	this.isAttackable = false;
	this.lifePoints -= 1;
	this.phase += 1;

	if (this.lifePoints > 0) {
		this.createPlots();
		this.flipH = false;
	} else {
		console.log('boss defeated')
		// TODO
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** draw item */
Boss.prototype.animate = function () {
	draw(BOSS_IDLE_IMG, this.x - 12, this.y, this.flipH);
};
