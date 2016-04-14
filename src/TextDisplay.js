TextDisplay = function () {
	this.textWindow = new Texture(64, 19);
	this.textBuffer = '';
	this.textParts  = [];
	this.dialog     = [];
	this.onFinishCallback = null;
}

module.exports = TextDisplay;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
TextDisplay.prototype.start = function (dialog, cb) {
	this.onFinishCallback = cb;
	// make a copy of dialog
	this.dialog = JSON.parse(JSON.stringify(dialog));
	this._setDialog();
	return this;
};

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
			if (this.dialog.length) {
				this._setDialog();
				return true;
			}
			this.onFinishCallback && this.onFinishCallback();
			this.onFinishCallback = null;
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
TextDisplay.prototype._setDialog = function () {
	this.textWindow.cls();

	var currentDialog = this.dialog.shift();

	var who  = currentDialog.who;
	var text = currentDialog.text;

	switch (who) {
		case 'bob':        this.textWindow.pen(10); break;
		case 'boss':       this.textWindow.pen(4);  break;
		case 'stump':      this.textWindow.pen(3);  break;
		case 'cloudFairy': this.textWindow.pen(7);  break;
		case 'waterFairy': this.textWindow.pen(6);  break;
		case 'fireFairy':  this.textWindow.pen(15); break;
		default:           this.textWindow.pen(1);
	}

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
	this.textBuffer += this.textParts.shift() + '\n' + (this.textParts.shift() || '') + '\n' + (this.textParts.shift() || '');
};
