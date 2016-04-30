var Entity        = require('./Entity.js');
var Particle      = require('./Particle.js');
var AABBcollision = require('../AABBcollision.js');

var fld  = assets.entities.lavaSpit;
var ANIM = [fld.frame0, fld.frame1, fld.frame2];
var PARTICLE_EFFECT = {
	gravity:   0.01,
	animation: [fld.particle0, fld.particle1, fld.particle2],
	animSpeed: 0.1,
	lifetime:  null // default to animation end
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function LavaSpit() {
	Entity.call(this);

	// properties
	this.isAttackable = false;

	// physic
	this.gravity    = 0.1;
	this.maxGravity = Infinity;

	// rendering & animation
	this.frame = 0;

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

		// add particle effect
		if (random(4) === 1) {
			var particle = new Particle(PARTICLE_EFFECT);
			var py = this.sy > 0 ? 1 : 7;
			particle.sy = Math.min(0, this.sy / 10);
			particle.setPosition(this.x + random(5), this.y + py + random(3));
			this.controller.addAnimation(particle);
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
	this.frame += 0.3;
	if (this.frame >= ANIM.length) this.frame = 0;
	draw(ANIM[~~this.frame], this.x, this.y, false, this.sy > 0);
};
