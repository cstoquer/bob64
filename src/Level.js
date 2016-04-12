var Onion = require('./Onion.js');

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
		case 32: return ENLIMIT;
		default: return EMPTY;
	}
}

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
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype.init = function (id, def) {
	var map = getMap(def.geometry);
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
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype._addEntityFromMapItem = function (item) {
	if (!item || item.sprite < 128) return;
	switch (item.sprite) {
		case 128: // onion
			var onion = new Onion().setPosition(item.x, item.y);
			if (item.flipH) onion.setDirection(-1); 
			this.controller.addEntity(onion);
			break;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Level.prototype._initBackground = function (def) {
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
	if (x < 0 || y < 0 || x >= this.width || y >= this.height) return EMPTY;
	return this.grid[x][y];
};

module.exports = new Level();