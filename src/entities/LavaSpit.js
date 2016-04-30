var Entity        = require('./Entity.js');
var AABBcollision = require('../AABBcollision.js');

var img = assets.entities.lavaSpit.frame0;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function LavaSpit() {
	Entity.call(this);

	// properties
	this.isAttackable = false;

	// physic
	this.gravity    = 0.1;
	this.maxGravity = Infinity;

	// rendering & animation

	// state
	this.jumpCounter = 0;
	this.jumping = true;
}
inherits(LavaSpit, Entity);

module.exports = LavaSpit;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* return true if entity needs to check collision with level */
LavaSpit.prototype.move = function (level, bob) {

	if (bob.isAttackable && AABBcollision(this, bob)) {
		// collision with Bob detected
		bob.hit(this);
	}

	if (this.jumping) {
		this.fall();
		this.y += this.sy;

		if (this.y > level.height * 8) {
			this.jumping = false;
		}

	} else if (this.jumpCounter++ > 40) {
		this.jumpCounter = 0;
		this.jumping = true;
		this.sy = -this.sy - this.gravity;
	}

	return false; // don't need to check collision with level
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
LavaSpit.prototype.animate = function () {
	draw(img, this.x, this.y, false, this.sy > 0);
};
