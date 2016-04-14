var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];

function bossFirstFairy() {

	//------------------------------------------------------------
	// create an empty cutscene
	var cutscene = new CutScene();

	//------------------------------------------------------------
	// add a fading transition animation
	cutscene.addFade();

	//------------------------------------------------------------
	// enqueue a function: this one clear screen and draw the boss room
	var bossRoom = getMap('bossCutScene');
	cutscene.enqueue(function () {
		camera(0, 0);   // camera needs to be reset before drawing scene
		paper(0).cls(); // set background color to 0 (black) and clear screen
		draw(bossRoom); // draw boss room
		// TODO draw the boss
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
		// draw the scene
		cls();
		draw(bossRoom);
		onionGuy.draw();
		// TODO draw the boss
		if (onionGuy.x < 13) return false; // continue the animation
		return true; // ends the animation
	});
	
	cutscene.addDelay(1);
	
	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.bossFirstFairy);

	//------------------------------------------------------------
	// add a last fade before going back to the game
	cutscene.addFade();

	//------------------------------------------------------------
	// return the cutscene	
	return cutscene;
}

module.exports = bossFirstFairy;
