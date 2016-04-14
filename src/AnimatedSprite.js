//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/**
 * @param {number[] | Image[] | mixed[]} animation - an array of something drawable. 
 *                                                   a number will use spritesheet
 */
function AnimatedSprite(animation, animSpeed) {
	this.x = 0;
	this.y = 0;
	this.frame = 0;
	this.flipH = false;
	this.flipV = false;
	this.animSpeed = animSpeed || 0.2;
	this.animation = animation;
}

module.exports = AnimatedSprite;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AnimatedSprite.prototype.draw = function () {
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
AnimatedSprite.prototype.setAnimation = function (animation, animSpeed) {
	this.animation = animation;
	this.animSpeed = animSpeed || this.animSpeed || 0.2;
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AnimatedSprite.prototype.setPosition = function (x, y) {
	this.x = x;
	this.y = y;
	return this;
};
