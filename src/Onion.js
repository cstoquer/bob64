var Entity = require('./Entity.js');

var a = assets.entities.onion;
var walk   = [a.walk0, a.walk1, a.walk2, a.walk3, a.walk4];
var attack = [a.attack0, a.attack1, a.attack2, a.attack4];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Onion() {
	Entity.call(this);

	// physic
	this.gravity    = 0.12;
	this.maxGravity = 1;

	// onion properties
	this.speed     = 0.2;
	this.direction = 1;

	// rendering & animation
	this.flipH     = false;
	this.frame     = 0;
	this.animSpeed = 0.12;
	this.anim      = walk;

	// state
	this.springCounter = 0;
	this.jumping = false;
}
inherits(Onion, Entity);

module.exports = Onion;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Onion.prototype.move = function (level, bob) {

	// TODO collision with bob here

	// states
	if (this.grounded && this.springCounter++ > 60) {
		this.springCounter = 0;
		this.sy = -2;
		this.grounded = false;
		this.jumping = true;
		this.anim = attack;
		this.frame = 0;
		return true
	}

	// walking
	if (this.grounded) {
		this.sx = this.speed * this.direction;
		// test next front ground
		if (level.getTileAt(this.x + 4 + this.direction * 2, this.y + 10).isEmpty) {
			// turn around
			this.direction *= -1;
			this.flipH = this.direction === -1;
		}
	} else {
		this.fall();
	}
	return true;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Onion.prototype.onGrounds = function () {
	this.jumping = false;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Onion.prototype.collideFront = function () {
	// make entity turn around
	this.sx = 0;
	this.direction *= -1;
	this.flipH = this.direction === -1;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Onion.prototype.animate = function () {
	this.frame += this.animSpeed;
	if (this.anim === attack) {
		if (this.frame >= this.anim.length) {
			this.anim = walk;
			this.frame = 0;
		}
	}
	if (this.frame >= this.anim.length) this.frame = 0;
	var img = this.anim[~~this.frame];
	draw(img, this.x, this.y - 8, this.flipH);
};