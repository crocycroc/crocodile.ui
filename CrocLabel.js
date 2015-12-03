
function CrocLabel(root, text, font, color) {
	CrocBase.call(this, root);
	
	this.setText(text);
	this.setFont(font);
	this.setColor(color);
	this.textFontHeightPadding = null;
	
	//top, hanging, middle, alphabetic, ideographic, bottom
	this.textBaseline = 'alphabetic';
	
	//If targetWidth is not set then it'll be the maximum bounding width provided during draw
	this.targetWidth = null;
	
	//Options for wrapping are 'none', 'forced', 'word', or 'regex'
	//When wrapping is none it will never wrap the text.
	this.wrapping = 'none';
	this.wrappingRegEx = '';
	
	//Options are for start, end, left, right or center
	this.alignmentHorizontal = 'start';
	//Options are start, end, top, bottom or center
	this.alignmentVerticle = 'start';
	
	//We will use the size of bounding box size of the text to test for hit.
	this.hitTestType = 'bounding';
};

//We inherit everything from CrocBase
CrocLabel.prototype = Object.create(CrocBase.prototype);

CrocLabel.prototype.setText = function(text) {
	this.text = text || '';
	
	this.getRoot().repaint();
};

CrocLabel.prototype.setFont = function(font) {
	this.textFont = font || '10px sans-serif';
	
	this.textHeight = determineFontHeight(this.textFont);
	
	this.getRoot().repaint();
	
	return;
};

CrocLabel.prototype.setAlignment = function(horiz, vert) {
	this.alignmentHorizontal = horiz || "start";
	this.alignmentVerticle = vert || "start";
	
	this.getRoot().repaint();
	
	return;
};

CrocLabel.prototype.setWrapping = function(wrapping) {
	this.wrapping = wrapping;
	
	this.getRoot().repaint();
};

CrocLabel.prototype.setColor = function(color) {
	this.textColor = color || 'black';
	
	this.getRoot().repaint();
};

//For a hit test you either return an object that is basec on CrocBase
//null for no hit
CrocLabel.prototype.hitTest = function(context, x, y, width, height) {
	
	return null;
// 	return [this];
};

CrocLabel.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	//Thought shalt preserve and return the state of everything that you change before you are done paiting!
	var origFont = context.getContext().font;
	var origTextAlign = context.getContext().textAlign;
	var origTextBaseline = context.getContext().textBaseline;
	var origFillColor = context.getContext().fillStyle;
	
	var splittedText = [];
	var deviderText = [];
	
	switch(this.wrapping) {
		case 'none':
			splittedText.push(this.text);
			break;
		
		//This will be horrifically ineffiecent...
		case 'forced':
			splittedText = this.text.split("");
			break;
			
		case 'word':
			splittedText = this.text.split(/\s+/g);
			deviderText = this.text.match(/\s+/g);
			break;
			
		default:
			splittedText.push(this.text);
			break;
	}
	
	context.getContext().font = this.textFont;
	context.getContext().textBaseline = this.textBaseline;
	context.getContext().textAlign = this.alignmentHorizontal;
	context.getContext().fillStyle = this.textColor;
	
	var currentLine = '';
	var currentLineNumber = 0;
	var currentFontHeightPadding = this.textFontHeightPadding;
	var maxWidth = 0;
	
	if(currentFontHeightPadding === null) {
		currentFontHeightPadding = this.textHeight - 2;
	}
	
	for(var i = 0; i < splittedText.length; i++) {
		var currentDeviderText = '';
		
		if(deviderText[i] !== undefined) {
			currentDeviderText = deviderText[i];
		}
		
		var testLine = currentLine + splittedText[i] + currentDeviderText;
		var testMetrics = context.measureText(testLine);
		
		if(testMetrics.width > maxWidth) {
			maxWidth = testMetrics.width;
		}
		
		if(testMetrics.width > width && i > 0) {
			var y = currentLineNumber * (this.textHeight + currentFontHeightPadding);
			var x = 0;
			
			switch(this.alignmentHorizontal) {
				case 'center':
					x = width / 2;
					break;
					
				case 'end':
					x = width;
			}
			
			context.fillText(currentLine, x, y + this.textHeight);
			currentLine = splittedText[i] + currentDeviderText;
			currentLineNumber++;
		}
		
		else {
			currentLine = testLine;
		}
	}
	
	var y = currentLineNumber * (this.textHeight + currentFontHeightPadding);
	var x = 0;
	
	var testMetrics = context.measureText(currentLine);
		
	if(testMetrics.width > maxWidth) {
		maxWidth = testMetrics.width;
	}
	
	switch(this.alignmentHorizontal) {
		case 'center':
			x = width / 2;
			break;
			
		case 'end':
			x = width;
	}
	
	this.width = maxWidth;
	this.height = y + this.textHeight;
	
	context.fillText(currentLine, x, y + this.textHeight);

	context.getContext().font = origFont;
	context.getContext().textBaseline = origTextAlign;
	context.getContext().textAlign = origTextBaseline;
	context.getContext().fillStyle = origFillColor;
	
	return;
};