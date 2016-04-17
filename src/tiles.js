
var EMPTY   = exports.EMPTY   = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0 };
var SOLID   = exports.SOLID   = { isEmpty: false, isSolid: true,  isTopSolid: true,  isWater: 0 };
var ONE_WAY = exports.ONE_WAY = { isEmpty: false, isSolid: false, isTopSolid: true,  isWater: 0, canJumpThru: true };
var VINE    = exports.VINE    = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isVine: true };
var VINETOP = exports.VINETOP = { isEmpty: false, isSolid: false, isTopSolid: true,  isWater: 0, isVine: true, canJumpThru: true };
var DOOR_0  = exports.DOOR_0  = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isDoor: true, doorId: 0 };
var DOOR_1  = exports.DOOR_1  = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isDoor: true, doorId: 1 };
var DOOR_2  = exports.DOOR_2  = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isDoor: true, doorId: 2 };
var WATER   = exports.WATER   = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 1 };
var WATER_S = exports.WATER_S = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 2 };
var KILL    = exports.KILL    = { isEmpty: true,  isSolid: false, isTopSolid: false, kill: true };
var ENLIMIT = exports.ENLIMIT = { isEmpty: true,  isSolid: false, isTopSolid: false, isWater: 0, isEntityLimit: true };


exports.getTileFromMapItem = function (mapItem) {
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
};
