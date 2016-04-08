var level = require('./Level.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 3;
var WATER_FORCE = -0.3;
var MAX_WATER   = -1.5;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Bob() {
	this.x  = 0;
	this.y  = 0;
	this.sx = 0;
	this.sy = 0;

	// animation
	this.frame = 0;
	this.flipH = false;

	// state
	this.onTile   = null;
	this.grounded = false;
	this.climbing = false;
	this.inWater  = 0;
	this.jumping  = false;
	this.jumpCounter = 0;
}

module.exports = new Bob();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.setPosition = function (doorId) {
	// TODO
	this.x = level.bobPos.x || 0;
	this.y = level.bobPos.y || 0;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.action = function (tile) {
	if (tile.isDoor) {
		var door = level.doors[tile.doorId];
		this.controller.changeLevel(door.level, door.doorId);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.startJump = function () {
	if (this.climbing) {
		// TODO
		return;
	}
	if (!this.grounded && !this.inWater) return;
	// TODO: ceiling test
	this.jumping = true;
	this.jumpCounter = 0;
	this.grounded = false;
};

Bob.prototype.jump = function () {
	if (this.climbing) {
		this.sy = -1;
		return;
	}
	if (this.onTile.isVine) {
		this.climbing = true;
		return;
	}
	if (!this.jumping) return;
	if (this.jumpCounter++ > 12) this.jumping = false;
	this.sy = -3 + this.jumpCounter * 0.08;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.goDown = function () {
	if (this.inWater && !this.grounded) {
		// water movement
		this.sy = Math.min(2, this.sy + 0.5);
	} else if (this.climbing) {
		// vine movement
		this.sy = 1;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype._updateControls = function () {
	if (btnp.up)  this.startJump();
	if (btnr.up)  this.jumping = false;
	if (btn.up)   this.jump();
	if (btn.down) this.goDown();

	// if (btn.down)  TODO going down from one way platforms
	if ( btn.right && !btn.left) { this.sx = 1;  this.flipH = false; } // going right
	if (!btn.right &&  btn.left) { this.sx = -1; this.flipH = true;  } // going left

	var tile = this.onTile = level.getTileAt(this.x + 4, this.y + 4);
	this.inWater = tile.isWater; // TODO check enter, exit (for particles, etc)
	this.onVine  = tile.isVine;

	if (btnp.A) this.action(tile);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.update = function () {
	// friction
	this.sx *= 0.8;

	this._updateControls();

	if (this.inWater === 1) {
		this.sy += WATER_FORCE;
		this.sy = Math.max(this.sy, MAX_WATER);
	} else if (this.inWater === 2) {
		this.sy -= 0.1;
		this.sy = Math.max(this.sy, MAX_WATER);
		this.sy *= 0.9;
	} else if (this.climbing) {
		this.sy *= 0.8;
		this.sx *= 0.7;
		if (!this.onTile.isVine) this.climbing = false;
	} else if (!this.grounded) {
		this.sy += GRAVITY;
		this.sy = Math.min(this.sy, MAX_GRAVITY);
	}

	// round speed
	this.sx = ~~(this.sx * 100) / 100;
	this.sy = ~~(this.sy * 100) / 100;

	var x = this.x + this.sx;
	var y = this.y + this.sy;

	// check level boundaries
	var maxX = level.width  * TILE_WIDTH  - 2; // TODO don't need to be calculated each frames
	var maxY = level.height * TILE_HEIGHT - 4;
	if (x < -7)   { x = -7;   if (this.controller.goToNeighbourLevel('left'))  return; }
	if (x > maxX) { x = maxX; if (this.controller.goToNeighbourLevel('right')) return; }
	if (y < -6   && this.controller.goToNeighbourLevel('up'))   return;
	if (y > maxY && this.controller.goToNeighbourLevel('down')) return; // TODO: else should bob dies?


	var front       = 8;
	var frontOffset = 0;
	if (this.sx < 0) { front = 0; frontOffset = 8; }

	// front collision
	if (this.sx !== 0) {
		if (level.getTileAt(x + front, this.y + 1).isSolid || level.getTileAt(x + front, this.y + 7).isSolid) {
			this.sx = 0;
			x = ~~(x / TILE_WIDTH) * TILE_WIDTH + frontOffset;
		}
	}

	if (this.grounded) {
		// down
		var tileDL = level.getTileAt(x + 1, y + 9);
		var tileDR = level.getTileAt(x + 6, y + 9);
		if (tileDL.isEmpty && tileDR.isEmpty) this.grounded = false;
	} else if (this.sy > 0) {
		// air down
		var tileDL = level.getTileAt(x + 1, y + 8);
		var tileDR = level.getTileAt(x + 6, y + 8);
		if (tileDL.isSolid || tileDR.isSolid) {
			this.grounded = true;
			this.jumping  = false;
			this.climbing = false;
			this.sy = 0;
			y = ~~(y / TILE_HEIGHT) * TILE_HEIGHT;
		} else if (tileDL.isTopSolid || tileDR.isTopSolid) {
			var targetY = ~~(y / TILE_HEIGHT) * TILE_HEIGHT;
			if (this.y <= targetY) {
				this.grounded = true;
				this.jumping  = false;
				this.climbing = false;
				this.sy = 0;
				y = targetY;
			}
		}
	} else if (this.sy < 0) {
		// air up (ceiling)
		var tileUL = level.getTileAt(x + 1, y);
		var tileUR = level.getTileAt(x + 6, y);
		if (tileUL.isSolid || tileUR.isSolid) {
			this.sy = 0;
			// this.jumpCounter = 99;
			this.jumpCounter += 2;
			y = ~~(y / TILE_HEIGHT) * TILE_HEIGHT + 8;
		}
	}

	this.x = x;
	this.y = y;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.draw = function () {
	var s = 255;
	if (this.climbing) {
		if (this.sy > 0.2 || this.sy < -0.2) {
			this.frame += 0.1;
			if (this.frame >= 4) this.frame = 0;
		}
		s = 248 + ~~this.frame;
	} else if (this.sx > 0.4 || this.sx < -0.4) {
		this.frame += 0.3;
		if (this.frame >= 3) this.frame = 0;
		s = 252 + ~~this.frame;
	}
	sprite(s, this.x, this.y, this.flipH);
};