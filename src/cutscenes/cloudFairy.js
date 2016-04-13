var CutScene = require('../CutScene.js');

function cloudFairy() {
	var cutscene = new CutScene();
	cutscene.addFade();

	//------------------------------------------------------------
	// clear screen and draw background
	var background = getMap('bossCutScene'); // TODO
	cutscene.addBackgroundChange(0);

	//------------------------------------------------------------
	// bob walk in animation
	var bobX = -12;
	var bobFrame = 0;
	cutscene.addAnimation(function () {
		bobX += 0.5;
		bobFrame += 0.2;
		if (bobFrame > 3) bobFrame = 0;
		var bobImage = assets.entities.bob['walk' + ~~bobFrame];
		var fairyImage = assets.entities.onion['walk0']; // TODO: fairy assets

		// draw the scene
		cls();
		draw(background);
		draw(bobImage, bobX, 50);
		if (bobX < 10) {
			draw(fairyImage, 40, 30);
			return false;
		}
		
		draw(fairyImage, 40, 30, true); // flip fairy
		return true;
	});
	
	//------------------------------------------------------------
	// dialog
	cutscene.addDialog(assets.dialogs.cloudFairy);

	cutscene.addFade();

	return cutscene;
}

module.exports = cloudFairy;
