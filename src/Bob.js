var level = require('./Level.js');
var AABBcollision = require('./AABBcollision.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 3;
var WATER_FORCE = -0.1;
var MAX_WATER   = -1.5;

var ATTACK_NONE  = 0;
var ATTACK_SLASH = 1;

var CHAINSAW_SLASH_BBOXES_RIGHT = [
	{ x:  2, y: -11, w: 5, h: 7 },
	{ x: 10, y:  -7, w: 6, h: 6 },
	{ x: 11, y:   3, w: 8, h: 5 },
	{ x: 11, y:   3, w: 8, h: 5 },
	{ x: 10, y:   3, w: 8, h: 5 },
	{ x:  9, y:   3, w: 7, h: 5 }
];

var CHAINSAW_SLASH_BBOXES_LEFT = [
	{ x:   1, y: -11, w: 5, h: 7 },
	{ x:  -8, y:  -7, w: 6, h: 6 },
	{ x: -11, y:   3, w: 8, h: 5 },
	{ x: -11, y:   3, w: 8, h: 5 },
	{ x: -10, y:   3, w: 8, h: 5 },
	{ x:  -8, y:   3, w: 7, h: 5 }
];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Bob() {
	this.x      = 0;
	this.y      = 0;
	this.width  = 8;
	this.height = 8;
	this.sx     = 0;
	this.sy     = 0;

	// animation
	this.frame = 0;
	this.flipH = false;

	// abilities
	this.canAttack     = false;
	this.canDive       = false;
	this.canDoubleJump = false;

	// state
	this.resetState();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.resetState = function () {
	this.isDead   = null;
	this.onTile   = { isEmpty: true }; // TODO
	this.grounded = false;
	this.climbing = false;
	this.inWater  = 0;
	this.jumping  = false;
	this.jumpCounter = 0;
	this.doubleJumpUsed = false;

	this.isLocked  = false; // e.g. when slashing
	this.attacking = ATTACK_NONE;
	this.attackCounter = 0;
	this.hitCounter = 0;
	this.isHit = false;
	this.isAttackable = true;
	this.sx = 0;
	this.sy = 0;
};

Bob.prototype.saveState = function () {
	return {
		x:             this.x,
		y:             this.y,
		canAttack:     this.canAttack,
		canDive:       this.canDive,
		canDoubleJump: this.canDoubleJump
	};
};

Bob.prototype.restoreState = function (state) {
	// reset all flags
	this.resetState();

	// restore state
	this.x             = state.x;
	this.y             = state.y;
	this.canAttack     = state.canAttack;
	this.canDive       = state.canDive;
	this.canDoubleJump = state.canDoubleJump;

};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.setPosition = function (pos) {
	this.x = pos.x || 0;
	this.y = pos.y || 0;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.attack = function () {
	this.isLocked      = true;
	this.attacking     = ATTACK_SLASH;
	this.attackCounter = 0;
};

Bob.prototype.endAttack = function () {
	this.isLocked  = false;
	this.attacking = ATTACK_NONE;
};

Bob.prototype.getattackBB = function () {
	if (this.attacking === ATTACK_SLASH) {
		var chainsawBB = (this.flipH ? CHAINSAW_SLASH_BBOXES_LEFT : CHAINSAW_SLASH_BBOXES_RIGHT)[~~this.attackCounter];
		if (chainsawBB) return {
			x:      chainsawBB.x + this.x,
			y:      chainsawBB.y + this.y,
			width:  chainsawBB.w,
			height: chainsawBB.h,
		};
	}
	return null;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.action = function () {
	var tile = this.onTile;
	if (tile.isDoor) {
		// enter door
		var door = level.doors[tile.doorId];
		this.controller.changeLevel(door.level, door.doorId);
	} else if (this.canAttack) {
		// attack
		this.attack();
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.startJump = function () {
	if (this.climbing) {
		// TODO
		return;
	}
	if (!this.grounded) {
		if (this.canDoubleJump && !this.doubleJumpUsed) this.doubleJumpUsed = true;
		else if (!this.inWater) return; // allow bob to jump from water
	}
	// if there is a ceiling directly on top of Bob's head, cancel jump.
	// if (level.getTileAt(this.x + 1, this.y - 2).isSolid || level.getTileAt(this.x + 6, this.y - 2).isSolid) return;
	this.grounded    = false;
	this.jumping     = true;
	this.jumpCounter = 0;
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
		if (!this.canDive) return;
		// water movement
		this.sy = Math.min(2, this.sy + 0.5);
	} else if (this.climbing) {
		// climbing movement
		this.sy = 1;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype._updateTileState = function () {
	var tile = this.onTile = level.getTileAt(this.x + 4, this.y + 4);
	if (tile.kill) return this.kill({ fromTile: tile });
	this.inWater = tile.isWater; // TODO check enter, exit (for particles, etc)
	this.onVine  = tile.isVine;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype._updateControls = function () {
	if (!this.isLocked) {
		if (btnp.up)  this.startJump();
		if (btnr.up)  this.jumping = false;
		if (btn.up)   this.jump();
		if (btn.down) this.goDown();

		// if (btn.down)  TODO going down from one way platforms
		if ( btn.right && !btn.left) { this.sx = 1;  this.flipH = false; } // going right
		if (!btn.right &&  btn.left) { this.sx = -1; this.flipH = true;  } // going left

		this._updateTileState();

		if (btnp.A) this.action();
	} else {
		if (btn.up) this.jump(); // FIXME: this is to allow jump continuation during attack
		this._updateTileState();
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.update = function () {
	if (this.isDead) return this.controller.killBob(this.isDead);

	// friction
	this.sx *= this.isHit ? 0.99 : 0.8;

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
		this.sx *= 0.5;
		if (!this.onTile.isVine) this.climbing = false;
	} else if (!this.grounded) {
		this.sy += GRAVITY;
		this.sy = Math.min(this.sy, MAX_GRAVITY);
	}

	// hit
	if (this.isHit) {
		this.hitCounter++;
		if (this.hitCounter > 16) {
			this.isLocked = false;
		}
		// keep Bob not attackable for few more frames
		if (this.hitCounter > 50) {
			this.isHit = false;
			this.isAttackable = true;
		}
	}

	// attack collision
	if (this.attacking) {
		var attackBB = this.getattackBB();
		if (attackBB) {
			var entities = this.controller.entities;
			// going in reverse because collision might destroy entity
			for (var i = entities.length - 1; i >= 0; i--) {
				var entity = entities[i];
				if (!entity.isAttackable) continue;
				if (AABBcollision(entity, attackBB)) {
					// collision detected
					entity.hit(this);
				}
			}
		}
	}

	this.levelCollisions();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.levelCollisions = function () {
	// round speed
	this.sx = ~~(this.sx * 100) / 100;
	this.sy = ~~(this.sy * 100) / 100;

	var x = this.x + this.sx;
	var y = this.y + this.sy;

	// check level boundaries
	var maxX = level.width  * TILE_WIDTH  - 4; // TODO don't need to be calculated each frames
	var maxY = level.height * TILE_HEIGHT - 4;
	if (x < -4)   { x = -4;   if (this.controller.goToNeighbourLevel('left'))  return; }
	if (x > maxX) { x = maxX; if (this.controller.goToNeighbourLevel('right')) return; }
	if (y < -6   && this.controller.goToNeighbourLevel('up'))   return;
	if (y > maxY) {
		if (this.controller.goToNeighbourLevel('down')) return;
		// if bob fall off a bottomless level, kill him after falling 2 more tiles
		else if (y > maxY + 16) return this.kill(true); // TODO add death param
	}

	var front       = 8;
	var frontOffset = 0;
	if (this.sx < 0) { front = 0; frontOffset = 8; }

	//---------------------------------------------------------
	// horizontal collisions (check 2 front point)
	if (this.sx !== 0) {
		if (level.getTileAt(x + front, this.y + 1).isSolid || level.getTileAt(x + front, this.y + 7).isSolid) {
			this.sx = 0;
			x = ~~(x / TILE_WIDTH) * TILE_WIDTH + frontOffset;
		}
	}

	//---------------------------------------------------------
	// vertical collisions
	if (this.grounded) {
		// check if there is still floor under Bob's feets
		var tileDL = level.getTileAt(x + 1, y + 9);
		var tileDR = level.getTileAt(x + 6, y + 9);
		if (tileDL.isEmpty && tileDR.isEmpty) this.grounded = false;
	} else if (this.sy > 0) {
		// Bob is falling. Check what is underneath
		var tileDL = level.getTileAt(x + 1, y + 8);
		var tileDR = level.getTileAt(x + 6, y + 8);
		if (tileDL.isSolid || tileDR.isSolid) {
			// collided with solid ground
			this._ground();
			y = ~~(y / TILE_HEIGHT) * TILE_HEIGHT;
		} else if (tileDL.isTopSolid || tileDR.isTopSolid) {
			// collided with one-way thru platform. Check if Bob where over the edge the frame before.
			var targetY = ~~(y / TILE_HEIGHT) * TILE_HEIGHT;
			if (this.y <= targetY) {
				this._ground();
				y = targetY;
			}
		}
	} else if (this.sy < 0) {
		// Bob is moving upward. Check for ceiling collision
		var tileUL = level.getTileAt(x + 1, y);
		var tileUR = level.getTileAt(x + 6, y);
		if (tileUL.isSolid || tileUR.isSolid) {
			this.sy = 0;
			this.jumpCounter += 2;
			y = ~~(y / TILE_HEIGHT) * TILE_HEIGHT + 8;
		}
	}

	// fetch position
	this.x = x;
	this.y = y;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype._ground = function () {
	this.grounded = true;
	this.jumping  = false;
	this.doubleJumpUsed = false;
	this.climbing = false;
	this.sy = 0;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.draw = function () {
	if (this.attacking === ATTACK_SLASH) {
		var animId = 'slash' + ~~this.attackCounter;
		draw(assets.chainsaw[animId], this.x - 16, this.y - 16, this.flipH);
		this.attackCounter += 0.33;
		if (this.attackCounter >= 5) this.endAttack();
	} else {
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
		if (this.isHit && this.hitCounter < 16) {
			s -= (~~(this.hitCounter / 3) % 3) * 16;
		}
		sprite(s, this.x, this.y, this.flipH);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.hit = function (attacker) {
	// from where do hit comes from ?
	this.grounded   = false;
	this.isHit      = true;
	this.hitCounter = 0;
	this.isLocked   = true;
	this.isAttackable = false;

	this.sx = attacker.x < this.x ? 1.6 : -1.6;
	this.sy = attacker.y < this.y ? 2 : -3;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Bob.prototype.kill = function (params) {
	this.isDead = params;
};


module.exports = new Bob();
