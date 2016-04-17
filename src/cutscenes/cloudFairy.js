var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var FAIRY_ANIMATION = [106, 107, 108, 109, 110, 111];
var BOB_WALK_ANIM   = [252, 253, 254];

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];
var BOSS          = assets.entities.boss;
var BOSS_ANIM    = [BOSS.hack0, BOSS.hack1, BOSS.hack2];

function cloudFairy(gameController) {
	// give Bob new abilities
	gameController.bob.canDive       = true;
	gameController.bob.canDoubleJump = true;
	gameController.bob.hasCloudFairy = true;

	//------------------------------------------------------------
	var cutscene = new CutScene();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('cloudShrine');
	cutscene.addBackgroundChange(6);

	//------------------------------------------------------------
	// bob walk in animation
	var fairy = new AnimatedSprite(FAIRY_ANIMATION, 0.3).setPosition(40, 35);
	var bob   = new AnimatedSprite(BOB_WALK_ANIM, 0.2).setPosition(-30, 40);

	cutscene.addAnimation(function () {
		bob.x += 0.4;

		cls();
		draw(background);
		bob.draw();
		if (bob.x < 18) {
			fairy.draw();
			return false;
		}
		fairy.flipH = true; // flip fairy
		fairy.draw();
		return true;
	});
	
	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.cloudFairy);

	//------------------------------------------------------------
	// add a last fade before next scene
	cutscene.addFade();

	//------------------------------------------------------------
	// enqueue a function: this one clear screen and draw the boss room
	cutscene.enqueue(function () {
		camera(0,0);
		paper(0).cls();
		background = getMap('bossCutScene');
	});

	//------------------------------------------------------------
	// add an animation.
	// an animation is a function that will be called every frame until its returns true
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(-10, 40);
	var bossGuy = new AnimatedSprite(BOSS_ANIM, 0.4).setPosition(20, 16);

	var counter = 0;
	
	cutscene.addAnimation(function () {
		if (++counter % 45 > 20) return false;
		onionGuy.x += 0.33;
		cls();
		draw(background);
		onionGuy.draw();
		bossGuy.draw();
		if (onionGuy.x < 13) return false; // continue the animation
		return true; // ends the animation
	});
	
	cutscene.addDelay(1);
	
	// //------------------------------------------------------------
	// // display a dialog
	cutscene.addDialog(assets.dialogs.bossFirstFairy);

	//------------------------------------------------------------
	// add a last fade before going back to the game
	cutscene.addFade();

	//------------------------------------------------------------
	// return the cutscene	
	return cutscene;
}

module.exports = cloudFairy;
