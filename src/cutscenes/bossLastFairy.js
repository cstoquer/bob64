var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];

function bossLastFairy() {

	//------------------------------------------------------------
	// create an empty cutscene
	var cutscene = new CutScene();

	//------------------------------------------------------------
	// add a fading transition animation
	// cutscene.addFade();

	//------------------------------------------------------------
	// enqueue a function: this one clear screen and draw the boss room
	var background = getMap('ground3');
	cutscene.enqueue(function () {
		camera(0, 0);   // camera needs to be reset before drawing scene
		paper(0).cls(); // set background color to 0 (black) and clear screen
	});

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	//------------------------------------------------------------
	// add an animation.
	// an animation is a function that will be called every frame until its returns true
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(-7, 40);
	cutscene.addAnimation(function () {
		onionGuy.x += 0.8;
		cls();
		draw(background);
		onionGuy.draw();
		// TODO draw the boss
		if (onionGuy.x < 10) return false; // continue the animation
		return true; // ends the animation
	});
	
	cutscene.addDelay(1);
	
	cutscene.enqueue(function () {
		background = getMap('bossCutScene');
		cls(); // set background color to 0 (black) and clear screen
		draw(background); // draw boss room
		onionGuy.draw();
		// TODO draw the boss
	});
	
	cutscene.addDelay(1);
	
	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.bossLastFairy);

	//------------------------------------------------------------
	// add a last fade before going back to the game
	cutscene.addFade();

	//------------------------------------------------------------
	// return the cutscene	
	return cutscene;
}

module.exports = bossLastFairy;
