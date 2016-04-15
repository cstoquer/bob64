var Entity        = require('./Entity.js');
var AABBcollision = require('../AABBcollision.js');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Spit() {
	Entity.call(this);

	this.width  = 3;
	this.height = 2;

	// spit properties
	this.speed  = 1.5;
	this.hasCollided = false;
	this.frame = 0;
}
inherits(Spit, Entity);

module.exports = Spit;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* return true if entity needs to check collision with level */
Spit.prototype.move = function (level, bob) {
	if (this.hasCollided) return false;
	if (bob.isAttackable && AABBcollision(this, bob)) {
		// collision with Bob detected
		bob.hit(this);
		bob.climbing = false;
	}
	this.x += this.sx;
	// level collision (don't use Entity's collision detection)
	if (this.x < -8 || this.x > level.width * 8 + 8) this.remove();
	else if (level.getTileAt(this.x + 1, this.y + 1).isSolid) this.hasCollided = true;
	return false;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Spit.prototype.remove = function () {
	this.controller.removeEntity(this);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Spit.prototype.animate = function () {
	if (this.hasCollided) {
		this.frame += 0.2;
		if (this.frame >= 4) return this.remove();
		sprite(90 + ~~this.frame, this.x - 3, this.y - 3);
		return;
	}
	sprite(105, this.x - 3, this.y - 3);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Spit.prototype.setDirection = function (direction) {
	this.sx = direction * this.speed;
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Spit.prototype.setPosition = function (x ,y) {
	this.x = x;
	this.y = y;
	return this;
};