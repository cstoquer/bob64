var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');


var ONION         = assets.entities.onion;
var ONION_ANIM    = [ONION.walk0, ONION.walk1, ONION.walk2, ONION.walk3, ONION.walk4];
var BOB_WALK_ANIM = [252, 253, 254];
var BOB_SPEED     = 1;


function intro(gameController) {
	// get the chainsaw !
	gameController.bob.canAttack = true;

	var cutscene = new CutScene();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('introCutScene');
	cutscene.addBackgroundChange(6);

	//------------------------------------------------------------
	// bob walk in animation
	var bob = new AnimatedSprite(BOB_WALK_ANIM, 0.4).setPosition(36, 40);
	bob.flipH = true;

	cutscene.enqueue(function () {
		cls();
		draw(background);
		bob.draw();
	});
	
	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.bobSnack);

	cutscene.addAnimation(function () {
		bob.x += BOB_SPEED;
		bob.flipH = false;

		// draw the scene
		cls();
		draw(background);
		bob.draw();
		return (bob.x >= 65);
	});

	//------------------------------------------------------------
	// add a last fade before going to next scene
	cutscene.addFade();

	cutscene.enqueue(function () {
		paper(6);
		background = getMap('house');
		bob.setPosition(104, 56);
	});

	cutscene.addAnimation(function () {
		bob.x += BOB_SPEED;
		// draw the scene
		camera(bob.x - 28, bob.y - 48);
		cls();
		draw(background);
		bob.draw();
		return (bob.x >= 114);
	});

	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.bobPackage);

	cutscene.addAnimation(function () {
		bob.x += BOB_SPEED;
		// draw the scene
		camera(bob.x - 28, bob.y - 48);
		cls();
		draw(background);
		bob.draw();
		return (bob.x >= 140);
	});

	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.bobConfirm);

	cutscene.addAnimation(function () {
		bob.x += BOB_SPEED;
		// draw the scene
		camera(bob.x - 28, bob.y - 48);
		cls();
		draw(background);
		bob.draw();
		return (bob.x >= 152);
	});

	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.bobApproach);

	//------------------------------------------------------------
	// add a last fade before going to next scene
	cutscene.addFade();

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
		return (onionGuy.x >= 10); // ends the animation
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
