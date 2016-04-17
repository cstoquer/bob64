var Entity         = require('./Entity.js');
var AABBcollision  = require('../AABBcollision.js');
var tiles          = require('../tiles.js');
var ShortAnimation = require('./ShortAnimation.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** an item tied to a tile that should disapear from the whole game once removed
 *  e.g. life container, boss door
 */
function Bloc(level, mapItem, onDestroyCallback) {
	Entity.call(this);

	this.width        = 8;
	this.height       = 8;
	this.isAttackable = true;

	this.level        = level;
	this.mapItem      = mapItem;
	this.onDestroy    = onDestroyCallback;

	this.x = mapItem.x * TILE_WIDTH;
	this.y = mapItem.y * TILE_HEIGHT;

	this.init(mapItem);
}
inherits(Bloc, Entity);
module.exports = Bloc;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bloc.prototype.init = function (mapItem) {
	this.sprite = mapItem.sprite;

	// bob requirements
	this.needCloudFairy = false;
	this.needWaterFairy = false;
	this.needFireFairy  = false;

	switch (mapItem.sprite) {
		case 160: this.needCloudFairy = true; break;
		case 161: this.needWaterFairy = true; break;
		case 162: this.needFireFairy  = true; break;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** return true if entity needs to check collision with level */
Bloc.prototype.move = function (level, bob) {
	return false;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bloc.prototype.hit = function (bob) {
	// check Bob's attibute
	if (this.needCloudFairy && !bob.hasCloudFairy) return;
	if (this.needWaterFairy && !bob.hasWaterFairy) return;
	if (this.needFireFairy  && !bob.hasFireFairy)  return;

	// destroy bloc
	var item = this.mapItem;

	this.level     && this.level.removeTile(item.x, item.y);
	this.onDestroy && this.onDestroy();
	this.explode();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** draw item */
Bloc.prototype.animate = function () {
	sprite(this.sprite, this.x, this.y);
};
