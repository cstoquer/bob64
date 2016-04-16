var Onion         = require('./entities/Onion.js');
var Stump         = require('./entities/Stump.js');
var SingletonItem = require('./entities/SingletonItem.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];

var EMPTY   = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0 };
var SOLID   = { isEmpty: false, isSolid: true,  isTopSolid: true,  isWater: 0 };
var ONE_WAY = { isEmpty: false, isSolid: false, isTopSolid: true,  isWater: 0, canJumpThru: true };
var VINE    = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isVine: true };
var VINETOP = { isEmpty: false, isSolid: false, isTopSolid: true,  isWater: 0, isVine: true, canJumpThru: true };
var DOOR_0  = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isDoor: true, doorId: 0 };
var DOOR_1  = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isDoor: true, doorId: 1 };
var DOOR_2  = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isDoor: true, doorId: 2 };
var WATER   = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 1 };
var WATER_S = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 2 };
var KILL    = { isEmpty: true,  isSolid: false, isTopSolid: false, kill: true };
var ENLIMIT = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isEntityLimit: true };


function getTileFromMapItem(mapItem) {
	if (!mapItem) return EMPTY;
	switch (mapItem.sprite) {
		case 0:  return SOLID;
		case 1:  return ONE_WAY;
		case 2:  return VINE;
		case 3:  return VINETOP;
		case 4:  return DOOR_0;
		case 5:  return DOOR_1;
		case 6:  return DOOR_2;
		case 7:  return WATER;
		case 8:  return WATER_S;
		case 9:  return KILL;
		case 32: return ENLIMIT;
		default: return EMPTY;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var ON_LIFE_CONTAINER_PICKUP = function (item, bob) {
	bob.maxLifePoints += 1;
	bob.lifePoints = bob.maxLifePoints;
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Level() {
	this.id     = null;
	this.map    = null;
	this.bobPos = { x: 0, y: 0 };
	this.grid   = [[]];
	this.width  = 0;
	this.height = 0;
	this.doors  = [null, null, null];

	this.background  = new Texture();
	this.animatedBackgrounds = [];
	this.isAnimated = false;
	this.frame = 0;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype.load = function (id) {
	this.id = id;

	var def = assets.levels[id];
	if (!def) return console.error('Level definition does not exist for level ' + id);
	paper(def.bgcolor);

	var map = getMap(def.geometry);
	if (!map) return console.error('Level does not exist: ' + id);
	var bobPosition = map.find(255)[0];

	if (bobPosition) {
		this.bobPos.x = bobPosition.x * TILE_WIDTH;
		this.bobPos.y = bobPosition.y * TILE_HEIGHT;
	}

	this.map    = map;
	this.grid   = map.copy().items;
	this.width  = map.width;
	this.height = map.height;
	this.right  = def.right;
	this.left   = def.left;
	this.up     = def.up;
	this.down   = def.down;

	this._initDoors(map, def.doors);

	for (var x = 0; x < map.width;  x++) {
	for (var y = 0; y < map.height; y++) {
		var item = map.items[x][y];
		this.grid[x][y] = getTileFromMapItem(item);
		this._addEntityFromMapItem(item);
	}}

	this._initBackground(def);

	if (def.cutscene) {
		this.controller.startCutScene(def.cutscene());
		def.cutscene = null; // make sure to play cutscene only once
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype._addEntity = function (entityClass, item) {
	var entity = new entityClass().setPosition(item.x, item.y);
	if (item.flipH) entity.setDirection(-1); 
	this.controller.addEntity(entity);
};

Level.prototype._addEntityFromMapItem = function (item) {
	if (!item || item.sprite < 128) return;
	switch (item.sprite) {
		case 128: this._addEntity(Onion, item); break;
		case 129: this._addEntity(Stump, item); break;
		case 192:
			// life container
			var entity = new SingletonItem(194, this.map, item, ON_LIFE_CONTAINER_PICKUP);
			entity.setPosition(item.x * TILE_WIDTH, item.y * TILE_HEIGHT);
			this.controller.addEntity(entity);
			break;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype._initBackground = function (def) {
	this.isAnimated = false;
	this.animatedBackgrounds = [];
	var texture = this.background;
	var mapId = def.background;
	var map = getMap(mapId);
	texture.resize(map.width * TILE_WIDTH, map.height * TILE_HEIGHT);
	texture.draw(map);

	var layerId = 1;
	var layer = getMap(mapId + '_L' + layerId);
	while (layer) {
		texture.draw(layer);
		layerId++;
		layer = getMap(mapId + '_L' + layerId);
	}

	var animatedlayer = getMap(mapId + '_A');
	if (animatedlayer) {
		this.isAnimated = true;
		// copy 16 times the background texture and add animations
		for (var i = 0; i < 16; i++) {
			var animTexture = new Texture(map.width * TILE_WIDTH, map.height * TILE_HEIGHT);
			this.animatedBackgrounds.push(animTexture);
			animTexture.draw(texture);
			animTexture.setSpritesheet(assets.terrain.ANIMATED);
			for (var x = 0; x < animatedlayer.width;  x++) {
			for (var y = 0; y < animatedlayer.height; y++) {
				var item = animatedlayer.items[x][y];
				if (!item) continue;
				var s = item.sprite;
				s = ~~(s / 16) * 16 + (s + i) % 16;
				animTexture.sprite(s, x * TILE_WIDTH, y * TILE_HEIGHT, item.flipH, item.flipV, item.flipR);
			}}
		}
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype._initDoors = function (map, doors) {
	for (var i = 0; i < this.doors.length; i++) {
		var position = map.find(4 + i)[0];
		var door = doors[i] || '';
		door = door.split(':');
		var destinationLevel = door[0];
		var doorId = door[1];

		this.doors[i] = {
			position: position,
			level:    destinationLevel,
			doorId:   doorId
		};
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype.setBobPositionOnDoor = function (doorId) {
	var door = this.doors[doorId];
	if (!door || !door.position) return console.error('level does not contain door id', doorId);

	this.bobPos.x = door.position.x * TILE_WIDTH;
	this.bobPos.y = door.position.y * TILE_HEIGHT;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype.setBobPositionOnSide = function (bob, direction) {
	if (direction === 'right' || direction === 'left') {
		// horizontal translation
		this.bobPos.y = bob.y;
		this.bobPos.x = direction === 'right' ? -4 : this.width * TILE_WIDTH - 4;
	} else {
		// vertical translation
		this.bobPos.x = bob.x;
		this.bobPos.y = direction === 'down' ? -1 : this.height * TILE_WIDTH - 7;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype.getTileAt = function (x, y) {
	x = ~~(x / TILE_WIDTH);
	y = ~~(y / TILE_HEIGHT);
	// clamp position in level bondaries
	if (x < 0) x = 0; else if (x >= this.width)  x = this.width  - 1;
	if (y < 0) y = 0; else if (y >= this.height) y = this.height - 1;
	// if (x < 0 || y < 0 || x >= this.width || y >= this.height) return EMPTY;
	return this.grid[x][y];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype.draw = function () {
	// TODO background animations
	if (this.isAnimated) {
		this.frame += 0.25;
		if (this.frame >= 16) this.frame = 0;
		draw(this.animatedBackgrounds[~~this.frame]);
		return;
	}
	draw(this.background);
}

module.exports = new Level();