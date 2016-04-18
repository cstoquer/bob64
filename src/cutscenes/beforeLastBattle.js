var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var BOB_WALK_ANIM   = [252, 253, 254];

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];
var BOSS          = assets.entities.boss;
var BOSS_ANIM    = [BOSS.hack0, BOSS.hack1, BOSS.hack2];

function beforeLastBattle(gameController) {

	// HACK: remove door from the level
	window.setTimeout(function () {
		var level = gameController.level
		var door = level.map.find(4)[0];
		level.removeTile(door.x, door.y);
	}, 500);

	//------------------------------------------------------------
	var cutscene = new CutScene();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('bossCutScene'); // TODO
	cutscene.addBackgroundChange(0);

	//------------------------------------------------------------
	// bob walk in animation
	var bob = new AnimatedSprite(BOB_WALK_ANIM, 0.2).setPosition(5, 48);
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(15, 40);
	var bossGuy = new AnimatedSprite(BOSS_ANIM, 0.4).setPosition(20, 16);

	bossGuy.flipH = true;

	cutscene.addAnimation(function () {
		// draw the scene
		cls();
		draw(background);
		bob.draw();
		onionGuy.draw();
		bossGuy.draw();
		return true;
	});

	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.beforeLastBattle);

	//------------------------------------------------------------
	// add a last fade before going back to the game
	cutscene.addFade();

	//------------------------------------------------------------
	// return the cutscene	
	return cutscene;
}

module.exports = beforeLastBattle;
