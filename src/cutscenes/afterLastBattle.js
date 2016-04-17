var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');
var ShortAnimation = require('../entities/ShortAnimation.js');

var BOB_WALK_ANIM   = [252, 253, 254];

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk2];

var stump = assets.entities.stump;
var STUMP_ANIM = [stump.walk0];

var expl = assets.entities.explosion;
var EXPLOSION_ANIMATION = [expl.frame0, expl.frame1, expl.frame2, expl.frame3, expl.frame4, expl.frame5, expl.frame6, expl.frame7, expl.frame8];

function afterLastBattle(gameController) {

	var cutscene = new CutScene();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('bossCutScene'); // TODO
	cutscene.addBackgroundChange(0);

	//------------------------------------------------------------
	// bob walk in animation
	var bob = new AnimatedSprite(BOB_WALK_ANIM, 0.2).setPosition(10, 48);
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(5, 40);
	var stumpGuy = new AnimatedSprite(STUMP_ANIM, 0.2).setPosition(15, 40);
	var explodey = new AnimatedSprite(EXPLOSION_ANIMATION, 0.5).setPosition(15, 40);

	cutscene.addAnimation(function () {
		// draw the scene
		cls();
		draw(background);
		bob.draw();
		onionGuy.draw();
		stumpGuy.draw();
		//TODO draw boss
		return true;
	});

	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.afterLastBattle);

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	cutscene.addAnimation(function () {
		bob.x += 0.4;

		// draw the scene
		cls();
		draw(background);
		onionGuy.draw();
		stumpGuy.draw();
		bob.draw();
		if (bob.x < 30) {
			return false;
		}
		//TODO draw boss
		return true;
	});

	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.afterLastBattleCont);

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	cutscene.addAnimation(function(){
		cls();
		draw(background);
		onionGuy.draw();
		bob.draw();

		if(explodey.frame < 8){
			explodey.draw();
			return false;
		}
		
		return true;

	});
	
	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.afterLastBattleFinal);

	//------------------------------------------------------------
	// add a last fade before going back to the game
	cutscene.addFade();

	//------------------------------------------------------------
	// return the cutscene	
	return cutscene;
}

module.exports = afterLastBattle;
