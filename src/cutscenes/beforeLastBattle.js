var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var BOB_WALK_ANIM   = [252, 253, 254];

var onion = assets.entities.onion;
var ONION_ANIM = [onion.walk0, onion.walk1, onion.walk2, onion.walk3, onion.walk4];

function beforeLastBattle(gameController) {

	var cutscene = new CutScene();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('bossCutScene'); // TODO
	cutscene.addBackgroundChange(0);

	//------------------------------------------------------------
	// bob walk in animation
	var bob = new AnimatedSprite(BOB_WALK_ANIM, 0.2).setPosition(10, 48);
	var onionGuy = new AnimatedSprite(ONION_ANIM, 0.2).setPosition(40, 40);
	onionGuy.flipH = true;

	cutscene.addAnimation(function () {
		// draw the scene
		cls();
		draw(background);
		bob.draw();
		onionGuy.draw();
		//TODO draw boss
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
