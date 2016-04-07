TextDisplay = function () {
	this.textWindow = new Texture(64, 19).pen(10);
	this.textBuffer = '';
	this.textParts  = [];
}

module.exports = TextDisplay;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** return true if there is still some text to be displayed */
TextDisplay.prototype.update = function () {
	camera(0, 0);
	draw(this.textWindow, 0, 0);
	if (this.textBuffer.length) {
		if (btnp.A) {
			// fast forward
			this.textWindow.print(this.textBuffer);
			this.textBuffer = '';
			return true;
		}
		// character by character animation
		var character = this.textBuffer[0];
		this.textWindow.print(character);
		this.textBuffer = this.textBuffer.substr(1);
	} else if (btnp.A) {
		// require next line
		if (this.textParts.length === 0) {
			return false;
		}
		for (var i = 0; i < 3; i++) {
			this.textBuffer += '\n';
			this.textBuffer += this.textParts.shift();
			if (this.textParts.length === 0) break;
		}
	}
	return true;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TextDisplay.prototype.setText = function (text) {
	this.textWindow.cls();
	// split text with end line character
	var textParts = text.split('\n');

	// check each line length and further split if too long
	for (var i = 0; i < textParts.length; i++) {
		textPart = textParts[i];
		if (textPart.length < 16) {
			textParts[i] = [textPart];
			continue;
		}
		var words = textPart.split(' ');
		textPart = [];
		var buffer = '';
		for (var j = 0; j < words.length; j++) {
			var word = words[j];
			if (buffer.length + word.length >= 16) {
				// flush buffer
				textPart.push(buffer);
				buffer = '';
			}
			if (buffer.length) buffer += ' ';
			buffer += word;
		}
		textPart.push(buffer);
		textParts[i] = textPart;
	}

	// merge back lines
	this.textParts = [].concat.apply([], textParts);

	// add the first 3 lines to be printed
	this.textBuffer += this.textParts.shift() + '\n' + this.textParts.shift() + '\n' + this.textParts.shift();
};

