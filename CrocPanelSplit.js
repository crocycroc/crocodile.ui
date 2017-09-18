function CrocPanelSplit(root, 
	tr, t, tl, l, r, bl, b, br, bkg,
	trH, tH, tlH, lH, rH, blH, bH, brH, bkgH,
	trF, tF, tlF, lF, rF, blF, bF, brF, bkgF) {
	
	var currentPanelSplit = this;

	CrocBase.call(this, root);
	
	tr = tr || root.themer.getValue(arguments.callee, "tr");
	t = t || root.themer.getValue(arguments.callee, "t");
	tl = tl || root.themer.getValue(arguments.callee, "tl");
	l = l || root.themer.getValue(arguments.callee, "l");
	r = r || root.themer.getValue(arguments.callee, "r");
	bl = bl || root.themer.getValue(arguments.callee, "bl");
	b = b || root.themer.getValue(arguments.callee, "b");
	br = br || root.themer.getValue(arguments.callee, "br");
	bkg = bkg || root.themer.getValue(arguments.callee, "bkg");
	
	trH = trH || root.themer.getValue(arguments.callee, "trH");
	tH = tH || root.themer.getValue(arguments.callee, "tH");
	tlH = tlH || root.themer.getValue(arguments.callee, "tlH");
	lH = lH || root.themer.getValue(arguments.callee, "lH");
	rH = rH || root.themer.getValue(arguments.callee, "rH");
	blH = blH || root.themer.getValue(arguments.callee, "blH");
	bH = bH || root.themer.getValue(arguments.callee, "bH");
	brH = brH || root.themer.getValue(arguments.callee, "brH");
	bkgH = bkgH || root.themer.getValue(arguments.callee, "bkgH");
	
	trF = trF || root.themer.getValue(arguments.callee, "trF");
	tF = tF || root.themer.getValue(arguments.callee, "tF");
	tlF = tlF || root.themer.getValue(arguments.callee, "tlF");
	lF = lF || root.themer.getValue(arguments.callee, "lF");
	rF = rF || root.themer.getValue(arguments.callee, "rF");
	blF = blF || root.themer.getValue(arguments.callee, "blF");
	bF = bF || root.themer.getValue(arguments.callee, "bF");
	brF = brF || root.themer.getValue(arguments.callee, "brF");
	bkgF = bkgF || root.themer.getValue(arguments.callee, "bkgF");
	
	this.gripper = new CrocPanelBorder(root, tl, t, tr, l, r, bl, b, br, bkg);
	this.gripperHover = new CrocPanelBorder(root, tlH, tH, trH, lH, rH, blH, bH, brH, bkgH);
	this.gripperFocused = new CrocPanelBorder(root, tlF, tF, trF, lF, rF, blF, bF, brF, bkgF);
	
	this.mode = 'normal';
	this.spacing = '10px';
	this.orientation = 'verticle';
	
	//Options for scaling are percentile, or absolute
	//In the case of percentile the splitSize value is
	//a percentage from 0 to 100 of the total size of the
	//area, in absolute it's a fixed number of pixels.
	this.splitSizeScaling = 'percentile'
	this.splitSize = '50%';
	this.splitMinimumSize = '0%';
	this.splitMaximumSize = '100%';
	this.showGripper = true;
	
	this.addEventListener('pointermove', function(e){
		if(this.hasFocus()) {
			this.globalPointToSplitSize(e.x, e.y);
			this.getRoot().setCursor('move');
			return false;
		}
		
		this.setMode('normal');
		this.getRoot().setCursor('');
		return true;
	});
	
	this.addEventListener('pointerup', function(e){return currentPanelSplit._gripperPointerUp(e);});
	
	this.gripper.addEventListener('pointermove', function(e){console.log('gripper: pointermove'); if(currentPanelSplit.showGripper) return currentPanelSplit._gripperPointerMove(e);});
	this.gripper.addEventListener('pointerleave', function(e){console.log('gripper: pointerleave'); if(currentPanelSplit.showGripper) return currentPanelSplit._gripperPointerLeave(e);});
	this.gripper.addEventListener('pointerdown', function(e){console.log('gripper: pointerdown'); if(currentPanelSplit.showGripper) return currentPanelSplit._gripperPointerDown(e);});
	this.gripper.addEventListener('pointerup', function(e){console.log('gripper: pointerup'); if(currentPanelSplit.showGripper) return currentPanelSplit._gripperPointerUp(e);});
};

CrocPanelSplit.prototype = Object.create(CrocBase.prototype);
CrocPanelSplit.prototype.constructor = CrocPanelSplit;

CrocPanelSplit.prototype._gripperPointerMove = function(e) {
	if(!this.hasFocus()) {
		this.setMode('hover');
		this.getRoot().setCursor('move');
	}
	
	return false;
};

CrocPanelSplit.prototype._gripperPointerLeave = function(e) {
	if(!this.hasFocus()) {
		this.setMode('normal');
		this.getRoot().setCursor('');
	}
	
	return false;
};

CrocPanelSplit.prototype._gripperPointerDown = function(e) {
	this.focus();
		
	this.globalPointToSplitSize(e.x, e.y);
	
	this.event('grippermoved', null);
	
	this.getRoot().setGlobalPaintWarning(true);
	this.setMode('focus');
};

CrocPanelSplit.prototype._gripperPointerUp = function(e) {
	if(!this.hasFocus()) {
		return true;
	}
	
	this.blur();
	
	this.getRoot().setGlobalPaintWarning(false);
	this.setMode('normal');
	this.getRoot().setCursor('');
	this.resizing = false;
	
	return false;
};

CrocPanelSplit.prototype.setSpacing = function(spacing) {
	if(spacing === undefined) {
		spacing = '10px';
	}
	
	this.spacing = spacing;
	
	this.getRoot().repaint();
};

CrocPanelSplit.prototype.setShowGripper = function(show) {
	
	this.showGripper = (show === true);
	
	this.getRoot().repaint();
};

CrocPanelSplit.prototype.setSplitMinimumSize = function(min) {
	this.splitMinimumSize = min;
	this.setSplitSize(this.splitSize);
};

CrocPanelSplit.prototype.setSplitMaximumSize = function(max) {
	this.splitMaximumSize = max;
	this.setSplitSize(this.splitSize);
};

CrocPanelSplit.prototype.setSplitSize = function(size) {
	
	var realSize = 0;
	var realMin = 0;
	var realMax = 0;
	
	if(this.orientation === 'verticle') {
		realMin = this.convertToPixels(this.splitMinimumSize, this.getHeight());
		realMax = this.convertToPixels(this.splitMaximumSize, this.getHeight());
		realSize = this.convertToPixels(size, this.getHeight());
	}
	
	else {
		realMin = this.convertToPixels(this.splitMinimumSize, this.getWidth());
		realMax = this.convertToPixels(this.splitMaximumSize, this.getWidth());
		realSize = this.convertToPixels(size, this.getWidth());
	}
	
	if(realSize > realMax) {
		size = realMax;
	}
	
	if(realSize < realMin) {
		size = realMin;
	}
	
	this.splitSize = size;
	this.getRoot().repaint();
};

CrocPanelSplit.prototype.globalPointToSplitSize = function(x, y) {
	var t = this.inverseTransform(this.lastTransform);
	
	var c = this.transformPoint(t, x, y);
	
	if(this.orientation === 'verticle') {
		if(this.splitSizeScaling === 'absolute') {
			this.setSplitSize(c.y);
		}
		
		else {
			this.setSplitSize(this.convertToPercentile(c.y, this.getHeight()));
		}
	}
	
	else {
		if(this.splitSizeScaling === 'absolute') {
			this.setSplitSize(c.x);
		}
		
		else {
			this.setSplitSize(this.convertToPercentile(c.x, this.getWidth()));
		}
	}
	
	this.getRoot().repaint();
};

CrocPanelSplit.prototype.setMode = function(mode) {
	this.mode = mode;
	this.getRoot().repaint();
};

CrocPanelSplit.prototype.setOrientation = function(orientation) {
	this.orientation = orientation || 'verticle';
	
	this.getRoot().repaint();
};

CrocPanelSplit.prototype.addChild = function(uiObject) {
	if(CrocBase.prototype.addChild.call(this, uiObject) === false) {
		return false;
	}
	
	this.getRoot().repaint();
	
	return true;
};

CrocPanelSplit.prototype.removeChild = function(uiObject) {
	if(CrocBase.prototype.removeChild.call(this, uiObject) === false) {
		return false;
	}

	this.getRoot().repaint();
	
	return true;
	
};

CrocPanelSplit.prototype.removeAllChildren = function() {
	CrocBase.prototype.removeAllChildren.call(this);
	
	this.getRoot().repaint();
};

CrocPanelSplit.prototype.hitTest = function(context, x, y, width, height) {
	context.save();
	
	var hitReturn = [];
	var hitObject = CrocBase.prototype.hitTest.call(this, context, x, y, width, height);
	
	if(hitObject !== null) {
		hitReturn.push(hitObject);
	}
	
	var currentGripper = this.gripper;
	
	var gripperVisible = currentGripper.getVisible();
	currentGripper.setVisible(this.showGripper);
	
	if(this.orientation === 'verticle') {
		var realSpacing = this.convertToPixels(this.spacing, this.height);
		var tlh = currentGripper.topLeftImage.getHeight();
		var topHeight = this.convertToPixels(this.splitSize, this.height);
		
		//Paint the first child on top
		if(this.children.length > 0) {
			var topChild = this.children[0];
			hitObject = topChild.hitTest(context, x, y, this.width, topHeight - realSpacing);
			
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
		}

		if(this.showGripper) {
			//Paint the currentGripper in the middle of the spacing area
			context.translate(0, topHeight + (realSpacing/2) - (tlh * 2));
		
			hitObject = currentGripper.hitTest(context, x, y, this.width, tlh * 2);
		
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
		
			context.translate(0, (realSpacing/2) + (tlh * 2));
		}
		
		else {
			context.translate(0, topHeight + realSpacing);
		}
		
		if(this.children.length > 1) {
			var bottomChild = this.children[1];
			hitObject = bottomChild.hitTest(context, x, y, this.width, this.height - topHeight - realSpacing);
			
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
		}
	}
	
	else {
		var realSpacing = this.convertToPixels(this.spacing, this.width);
		
		var tlw = currentGripper.topLeftImage.getWidth();
		var leftWidth = this.convertToPixels(this.splitSize, this.width);
		
		//Paint the first child on the left
		if(this.children.length > 0) {
			var leftChild = this.children[0];
			hitObject = leftChild.hitTest(context, x, y, leftWidth - realSpacing, this.height);
			
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
		}

		if(this.showGripper) {
			//Paint the currentGripper in the middle of the spacing area
			context.translate(leftWidth + (realSpacing/2) - (tlw * 2), 0);
			
			hitObject = currentGripper.hitTest(context, x, y, tlw * 2, this.height);
			
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
			
			context.translate((realSpacing/2) + (tlw * 2), 0);
		}
		
		else {
			context.translate(leftWidth + realSpacing, 0);
		}
		
		if(this.children.length > 1) {
			var rightChild = this.children[1];
			hitObject = rightChild.hitTest(context, x, y, this.width - leftWidth - realSpacing, this.height);
		
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
		}
	}
	
	currentGripper.setVisible(gripperVisible);
	
	context.restore();
	
	return hitReturn;
};

CrocPanelSplit.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	context.save();
	
	context.beginPath();
	context.lineTo(width, 0);
	context.lineTo(width, height);
	context.lineTo(0, height);
	context.lineTo(0, 0);
	context.clip();
	
	var currentGripper = this.gripper;
	
	switch(this.mode) {
		case 'normal':
			currentGripper = this.gripper;
			break;
			
		case 'hover':
			currentGripper = this.gripperHover;
			break;
			
		case 'focus':
			currentGripper = this.gripperFocused;
			break;
			
		default:
			break;
	}
	
	
	
	if(this.orientation === 'verticle') {
		var realSpacing = this.convertToPixels(this.spacing, this.height);
		var tlh = currentGripper.topLeftImage.getHeight();
		var topHeight = this.convertToPixels(this.splitSize, this.height);
		
		//Paint the first child on top
		if(this.children.length > 0) {
			var topChild = this.children[0];
			topChild.paint(context, this.width, topHeight - realSpacing);
		}

		if(this.showGripper) {
			//Paint the currentGripper in the middle of the spacing area
			context.translate(0, topHeight + (realSpacing/2) - (tlh * 2));
			
			currentGripper.paint(context, this.width, tlh * 2);
			
			context.translate(0, (realSpacing/2) + (tlh * 2));
		}
		
		else {
			context.translate(0, topHeight + realSpacing);
		}
		
		if(this.children.length > 1) {
			var bottomChild = this.children[1];
			bottomChild.paint(context, this.width, this.height - topHeight - realSpacing);
		}
	}
	
	else {
		var realSpacing = this.convertToPixels(this.spacing, this.width);
		
		var tlw = currentGripper.topLeftImage.getWidth();
		var leftWidth = this.convertToPixels(this.splitSize, this.width);
		
		//Paint the first child on the left
		if(this.children.length > 0) {
			var leftChild = this.children[0];
			leftChild.paint(context, leftWidth - realSpacing, this.height);
		}

		if(this.showGripper) {
			//Paint the currentGripper in the middle of the spacing area
			context.translate(leftWidth + (realSpacing/2) - (tlw * 2), 0);
			
			currentGripper.paint(context, tlw * 2, this.height);
			
			context.translate((realSpacing/2) + (tlw * 2), 0);
		}
		
		else {
			context.translate(leftWidth + realSpacing, 0);
		}
		
		if(this.children.length > 1) {
			var rightChild = this.children[1];
			rightChild.paint(context, this.width - leftWidth - realSpacing, this.height);
		}
	}
	
	context.restore();
};
