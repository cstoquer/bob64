var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var FAIRY_ANIMATION = [106, 107, 108, 109, 110, 111];
var BOB_WALK_ANIM   = [252, 253, 254];

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];

function cloudFairy() {
	var cutscene = new CutScene();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('bossCutScene'); // TODO
	cutscene.addBackgroundChange(0);

	//------------------------------------------------------------
	// bob walk in animation
	var fairy = new AnimatedSprite(FAIRY_ANIMATION, 0.3).setPosition(40, 30);
	var bob   = new AnimatedSprite(BOB_WALK_ANIM, 0.2).setPosition(-20, 48);

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
	cutscene.addDialog(assets.dialogs.cloudFairy);

	//------------------------------------------------------------
	// add a last fade before next scene
	cutscene.addFade();

	//------------------------------------------------------------
	// enqueue a function: this one clear screen and draw the boss room
	cutscene.enqueue(function () {
		camera(0,0);
		paper(0).cls();
		draw(background);
	});

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(1);

	//------------------------------------------------------------
	// add an animation.
	// an animation is a function that will be called every frame until its returns true
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(-6, 40);
	var counter = 0;
	
	cutscene.addAnimation(function () {
		if (++counter % 60 > 20) return false;
		onionGuy.x += 0.25;
		cls();
		draw(background);
		onionGuy.draw();
	// TODO draw the boss
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
