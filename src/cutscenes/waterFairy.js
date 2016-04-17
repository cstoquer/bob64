var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var FAIRY_ANIMATION = [122, 123, 124, 125, 126, 127];
var BOB_WALK_ANIM   = [252, 253, 254];

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];

function waterFairy(gameController) {
	// give Bob new abilities
	gameController.bob.hasWaterFairy = true;

	//------------------------------------------------------------
	var cutscene = new CutScene();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('waterShrine');
	cutscene.addBackgroundChange(0);

	//------------------------------------------------------------
	// bob walk in animation
	var fairy = new AnimatedSprite(FAIRY_ANIMATION, 0.3).setPosition(40, 35);
	var bob   = new AnimatedSprite(BOB_WALK_ANIM, 0.2).setPosition(-30, 40);

	cutscene.addAnimation(function () {
		bob.x += 0.4;

		cls();
		draw(background);
		bob.draw();
		if (bob.x < 10) {
			fairy.draw();
			return false;
		}
		fairy.flipH = true; // flip fairy
		fairy.draw();
		return true;
	});
	
	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.waterFairy);

	//------------------------------------------------------------
	// add a last fade before going to next scene
	cutscene.addFade();

	cutscene.addBackgroundChange(0);

	//------------------------------------------------------------
	cutscene.enqueue(function () {
		background = getMap('bossCutScene');
	});

	//------------------------------------------------------------
	// add an animation.
	// an animation is a function that will be called every frame until its returns true
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(-7, 40);

	cutscene.addAnimation(function () {
		onionGuy.x += 0.8;
		cls();
		// TODO draw the boss
		onionGuy.draw();
		if (onionGuy.x < 10) return false; // continue the animation
		return true; // ends the animation
	});
	
	//------------------------------------------------------------
	cutscene.enqueue(function () {
		// turn the light on
		cls();
		draw(background);
		onionGuy.draw();
		// TODO draw the boss
	});
	
	cutscene.addDelay(1);
	
	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.bossSecondFairy);

	//------------------------------------------------------------
	// add a last fade before going back to the game
	cutscene.addFade();

	//------------------------------------------------------------
	// return the cutscene	
	return cutscene;
}

module.exports = waterFairy;
