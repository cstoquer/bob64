var Entity        = require('./Entity.js');
var AABBcollision = require('../AABBcollision.js');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** an item tied to a tile that should disapear from the whole game once removed
 *  e.g. life container, boss door
 */
function SingletonItem(sprite, map, mapItem, onBobCollide) {
	Entity.call(this);

	this.width        = 8;
	this.height       = 8;

	this.isAttackable = false;

	this.sprite       = sprite;
	this.map          = map;
	this.mapItem      = mapItem;
	this.onBobCollide = onBobCollide;
}
inherits(SingletonItem, Entity);

module.exports = SingletonItem;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* return true if entity needs to check collision with level */
SingletonItem.prototype.move = function (level, bob) {
	if (!bob.locked && AABBcollision(this, bob)) {
		// collision with bob
		this.onBobCollide && this.onBobCollide(this, bob);
		this.map.remove(this.mapItem.x, this.mapItem.y);
		this.controller.removeEntity(this);
	}
	return false;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SingletonItem.prototype.animate = function () {
	// draw item
	sprite(this.sprite, this.x, this.y);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SingletonItem.prototype.setPosition = function (x ,y) {
	this.x = x;
	this.y = y;
	return this;
};