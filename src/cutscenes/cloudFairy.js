var CutScene       = require('../CutScene.js');
var AnimatedSprite = require('../AnimatedSprite.js');

var FAIRY_ANIMATION = [106, 107, 108, 109, 110, 111];
var BOB_WALK_ANIM   = [252, 253, 254];

function cloudFairy() {
	var cutscene = new CutScene();
	cutscene.addFade();

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

		// draw the scene
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

	cutscene.addFade();

	return cutscene;
}

module.exports = cloudFairy;
