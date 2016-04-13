var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];

function bossIntro() {

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
	cutscene.addDelay(0.2);

	//------------------------------------------------------------
	// add an animation.
	// an animation is a function that will be called every frame until its returns true
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(-7, 40);
	cutscene.addAnimation(function () {
		// to make the onion guy move forward
		onionGuy.x += 0.5;

		// draw the scene
		cls();
		draw(bossRoom);
		// TODO draw the boss
		onionGuy.draw();
		if (onionGuy.x < 10) return false; // continue the animation

		return true; // ends the animation
	});

	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.bossIntro);

	//------------------------------------------------------------
	// add a last fade before going back to the game
	cutscene.addFade();

	//------------------------------------------------------------
	// return the cutscene	
	return cutscene;
}

module.exports = bossIntro;
