var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var BOB_WALK_ANIM   = [252, 253, 254];

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];

function intro() {

	var cutscene = new CutScene();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('ground0'); // TODO
	cutscene.addBackgroundChange(0);

	//------------------------------------------------------------
	// bob walk in animation
	var bob = new AnimatedSprite(BOB_WALK_ANIM, 0.2).setPosition(-20, 48);

	cutscene.addAnimation(function () {
		bob.x += 0.4;

		// draw the scene
		cls();
		draw(background);
		bob.draw();
		if (bob.x < 10) {
			return false;
		}
		return true;
	});
	
	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.bobSnack);

	cutscene.addAnimation(function () {
		bob.x += 0.4;

		// draw the scene
		cls();
		draw(background);
		bob.draw();
		if (bob.x < 65) {
			return false;
		}
		return true;
	});

	//------------------------------------------------------------
	// add a last fade before going to next scene
	cutscene.addFade();

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	var bobHouseBg = getMap('cave'); // TODO Bob house
	cutscene.addBackgroundChange(0, bobHouseBg);

	cutscene.enqueue(function () {
		camera(0,0);
		paper(0).cls();
		draw(bobHouseBg);
		bob.setPosition(-20,48);
	});

	cutscene.addAnimation(function () {
		bob.x += 0.4;

		// draw the scene
		cls();
		draw(bobHouseBg);
		bob.draw();
		if (bob.x < 10) {
			return false;
		}
		return true;
	});

	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.bobPackage);

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	cutscene.addAnimation(function () {
		bob.x += 0.4;

		// draw the scene
		cls();
		draw(bobHouseBg);
		bob.draw();
		if (bob.x < 15) {
			return false;
		}
		return true;
	});

	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.bobConfirm);

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	cutscene.addAnimation(function () {
		bob.x += 0.4;

		// draw the scene
		cls();
		draw(bobHouseBg);
		bob.draw();
		if (bob.x < 40) {
			return false;
		}
		return true;
	});

	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.bobApproach);

	//------------------------------------------------------------
	// add a last fade before going to next scene
	cutscene.addFade();

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	var bossBackground = getMap('bossCutScene');
	cutscene.addBackgroundChange(0, bossBackground);

	//------------------------------------------------------------
	// add an animation.
	// an animation is a function that will be called every frame until its returns true
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(-7, 40);
	cutscene.addAnimation(function () {
		onionGuy.x += 0.8;
		cls();
		draw(bossBackground);
		onionGuy.draw();
		// TODO draw the boss
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

module.exports = intro;
