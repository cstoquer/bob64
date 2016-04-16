var ShortAnimation = require('./ShortAnimation.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];

var expl = assets.entities.explosion;
var EXPLOSION_ANIMATION = [expl.frame0, expl.frame1, expl.frame2, expl.frame3, expl.frame4, expl.frame5, expl.frame6, expl.frame7, expl.frame8];


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Entity() {
	this.x          = 0;
	this.y          = 0;
	this.width      = 8;
	this.height     = 8;

	// physic
	this.sx         = 0;
	this.sy         = 0;
	this.grounded   = false;
	this.gravity    = 0.1;
	this.maxGravity = 1;

	// properties
	this.isAttackable = false;

	// flags
	this.hasCollidedLevelFront = false;
	this.hasCollidedLevelDown  = false;
	this.hasCollidedLevelUp    = false;
}

module.exports = Entity;

//█████████████████████████████████████████████████████████████████████████████████
//████████████████████████████████████████▄███████▄░██████████▄░███████▄░██████████
//█▀▄▄▄▄▀█▄░▄██▄░▄█▀▄▄▄▄▀█▄░▀▄▄▄█▄░▀▄▄▄█▄▄░███▀▄▄▄▀░██▀▄▄▄▄▀███░▀▄▄▄▀███░███▀▄▄▄▄▀█
//█░████░███░██░███░▄▄▄▄▄██░██████░███████░███░████░██▀▄▄▄▄░███░████░███░███░▄▄▄▄▄█
//█▄▀▀▀▀▄████░░████▄▀▀▀▀▀█▀░▀▀▀██▀░▀▀▀██▀▀░▀▀█▄▀▀▀▄░▀█▄▀▀▀▄░▀█▀░▄▀▀▀▄█▀▀░▀▀█▄▀▀▀▀▀█
//█████████████████████████████████████████████████████████████████████████████████
Entity.prototype.move = function (level, bob) {
	// OVERIDE THIS
	return false; // return true if entity needs to check collision with level
};

// OVERIDE THESE
Entity.prototype.collideFront = function () {};
Entity.prototype.onGrounds = function () {};
Entity.prototype.animate = function () {};
Entity.prototype.hit = function (attacker) {};

//████████████████████████████████████████████████
//████████████████████████████████████████████████
//█▀▄▄▄▀░█▀▄▄▄▄▀█▄░▀▄▀▀▄▀█▄░▀▄▀▀▄▀█▀▄▄▄▄▀█▄░▀▄▄▀██
//█░██████░████░██░██░██░██░██░██░█░████░██░███░██
//█▄▀▀▀▀▄█▄▀▀▀▀▄█▀░▀█░▀█░█▀░▀█░▀█░█▄▀▀▀▀▄█▀░▀█▀░▀█
//████████████████████████████████████████████████
Entity.prototype.update = function (level, bob) {
	if (this.move(level, bob)) this.levelCollisions(level, bob);
	this.animate();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype.setPosition = function (i ,j) {
	this.x = i * TILE_WIDTH;
	this.y = j * TILE_HEIGHT;
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype.explode = function () {
	this.controller.removeEntity(this);
	this.controller.addAnimation(new ShortAnimation(EXPLOSION_ANIMATION, 0.5).setPosition(this.x - 8, this.y - 8));
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype.fall = function () {
	this.sy += this.gravity;
	this.sy = Math.min(this.sy, this.maxGravity);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Entity.prototype.levelCollisions = function (level, bob) {
	this.hasCollidedLevelFront = false;
	this.hasCollidedLevelDown  = false;
	this.hasCollidedLevelUp    = false;

	var x = this.x + this.sx;
	var y = this.y + this.sy;

	// check level boundaries
	var maxX = level.width * TILE_WIDTH - this.width; // TODO don't need to be calculated each frames
	if (this.sx < 0 && x < 0)    {x = 0;    this.hasCollidedLevelFront = true; this.collideFront(-1); }
	if (this.sx > 0 && x > maxX) {x = maxX; this.hasCollidedLevelFront = true; this.collideFront(1); }

	var front = this.width;
	var frontOffset = 0;
	var collideDirection = 1;
	if (this.sx < 0) { front = 0; frontOffset = this.width; collideDirection = -1; }

	//---------------------------------------------------------
	// horizontal collisions (check 2 front point)
	if (this.sx > 0 && level.getTileAt(x + front, this.y + 1).isSolid || level.getTileAt(x + front, this.y + this.height - 1).isSolid) {
		this.hasCollidedLevelFront = true;
		this.collideFront(collideDirection);
		x = ~~(x / TILE_WIDTH) * TILE_WIDTH + frontOffset;
	}

	//---------------------------------------------------------
	// vertical collisions
	if (this.grounded) {
		// check if there is still floor under Entity's feets
		var tileDL = level.getTileAt(x + 1, y + this.height + 1);
		var tileDR = level.getTileAt(x + 6, y + this.height + 1);
		if (tileDL.isEmpty && tileDR.isEmpty) {
			this.grounded = false;
			this.sx = 0;
		}
	} else if (this.sy > 0) {
		// Entity is falling. Check what is underneath
		var tileDL = level.getTileAt(x + 1, y + this.height);
		var tileDR = level.getTileAt(x + 6, y + this.height);
		if (tileDL.isSolid || tileDR.isSolid) {
			// collided with solid ground
			this.hasCollidedLevelDown = true;
			this.grounded = true;
			this.sy = 0;
			this.onGrounds();
			y = ~~(y / TILE_HEIGHT) * TILE_HEIGHT;
		} else if (tileDL.isTopSolid || tileDR.isTopSolid) {
			// collided with one-way thru platform. Check if Entity where over the edge the frame before.
			var targetY = ~~(y / TILE_HEIGHT) * TILE_HEIGHT;
			if (this.y <= targetY) {
				this.hasCollidedLevelDown = true;
				this.grounded = true;
				this.sy = 0;
				this.onGrounds();
				y = targetY;
			}
		}
	} else if (this.sy < 0) {
		// Entity is moving upward. Check for ceiling collision
		var tileUL = level.getTileAt(x + 1, y);
		var tileUR = level.getTileAt(x + 6, y);
		if (tileUL.isSolid || tileUR.isSolid) {
			this.hasCollidedLevelUp = true;
			this.sy = 0;
			y = ~~(y / TILE_HEIGHT) * TILE_HEIGHT + 8;
		}
	}

	// fetch position
	this.x = x;
	this.y = y;
};
