var DEFAULT_ANIMATION = [0];

function Particle(params) {
	params = params || {};

	this.x  = 0;
	this.y  = 0;
	this.sx = 0;
	this.sy = 0;

	this.frame = 0;
	this.life  = 0;
	this.flipH = false;
	this.flipV = false;

	this.animSpeed = params.animSpeed || 0.2;
	this.animation = params.animation || DEFAULT_ANIMATION;
	this.lifetime  = params.lifetime  || this.animation.length / this.animSpeed;
	this.gravity   = params.gravity   || 0;

	// TODO gravity settings
}

module.exports = Particle;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Particle.prototype.update = function () {
	this.life += 1;
	if (this.life >= this.lifetime) {
		this.controller.removeAnimation(this);
		return;
	}

	// TODO movement & gravity
	this.sy += this.gravity;
	this.x  += this.sx;
	this.y  += this.sy;

	this.frame += this.animSpeed;
	if (this.frame >= this.animation.length) this.frame = 0;

	var current = this.animation[~~this.frame];
	if (typeof current === 'number') {
		sprite(current, this.x, this.y, this.flipH, this.flipV);
	} else {
		draw(current, this.x, this.y, this.flipH, this.flipV);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Particle.prototype.setAnimation = function (animation, animSpeed) {
	this.animation = animation;
	this.animSpeed = animSpeed || this.animSpeed || 0.2;
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Particle.prototype.setPosition = function (x, y) {
	this.x = x;
	this.y = y;
	return this;
};