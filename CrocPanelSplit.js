function CrocPanelSplit(root, 
	tr, t, tl, l, r, bl, b, br, bkg,
	trH, tH, tlH, lH, rH, blH, bH, brH, bkgH,
	trF, tF, tlF, lF, rF, blF, bF, brF, bkgF) {
	
	var currentPanelSplit = this;

	CrocBase.call(this, root);
	
	tr = tr || "theme/CrocPanelSplit/groove-topright.png";
	t = t || "theme/CrocPanelSplit/groove-top.png";
	tl = tl || "theme/CrocPanelSplit/groove-topleft.png";
	l = l || "theme/CrocPanelSplit/groove-left.png";
	r = r || "theme/CrocPanelSplit/groove-right.png";
	bl = bl || "theme/CrocPanelSplit/groove-bottomleft.png";
	b = b || "theme/CrocPanelSplit/groove-bottom.png";
	br = br || "theme/CrocPanelSplit/groove-bottomright.png";
	bkg = bkg || "theme/CrocPanelSplit/groove-center.png";
	
	trH = trH || "theme/CrocPanelSplit/groove-highlight-topright.png";
	tH = tH || "theme/CrocPanelSplit/groove-highlight-top.png";
	tlH = tlH || "theme/CrocPanelSplit/groove-highlight-topleft.png";
	lH = lH || "theme/CrocPanelSplit/groove-highlight-left.png";
	rH = rH || "theme/CrocPanelSplit/groove-highlight-right.png";
	blH = blH || "theme/CrocPanelSplit/groove-highlight-bottomleft.png";
	bH = bH || "theme/CrocPanelSplit/groove-highlight-bottom.png";
	brH = brH || "theme/CrocPanelSplit/groove-highlight-bottomright.png";
	bkgH = bkgH || "theme/CrocPanelSplit/groove-highlight-center.png";
	
	trF = trF || "theme/CrocPanelSplit/groove-highlight-topright.png";
	tF = tF || "theme/CrocPanelSplit/groove-highlight-top.png";
	tlF = tlF || "theme/CrocPanelSplit/groove-highlight-topleft.png";
	lF = lF || "theme/CrocPanelSplit/groove-highlight-left.png";
	rF = rF || "theme/CrocPanelSplit/groove-highlight-right.png";
	blF = blF || "theme/CrocPanelSplit/groove-highlight-bottomleft.png";
	bF = bF || "theme/CrocPanelSplit/groove-highlight-bottom.png";
	brF = brF || "theme/CrocPanelSplit/groove-highlight-bottomright.png";
	bkgF = bkgF || "theme/CrocPanelSplit/groove-highlight-center.png";
	
	this.gripper = new CrocPanelBorder(root, tr, t, tl, l, r, bl, b, br, bkg);
	this.gripperHover = new CrocPanelBorder(root, trH, tH, tlH, lH, rH, blH, bH, brH, bkgH);
	this.gripperFocused = new CrocPanelBorder(root, trF, tF, tlF, lF, rF, blF, bF, brF, bkgF);
	
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
			return false;
		}
		
		return true;
	});
	
	this.addEventListener('pointerup', function(e) {
		this.blur();
		
		return true;
	});
	
	this.gripper.addEventListener('pointermove', function(e){if(currentPanelSplit.mode === 'normal' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseMove(e);});
	this.gripper.addEventListener('pointerleave', function(e){if(currentPanelSplit.mode === 'normal' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseLeave(e);});
	this.gripper.addEventListener('pointerdown', function(e){if(currentPanelSplit.mode === 'normal' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseDown(e);});
	this.gripper.addEventListener('pointerup', function(e){if(currentPanelSplit.mode === 'normal' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseUp(e);});
	
	this.gripperHover.addEventListener('pointermove', function(e){if(currentPanelSplit.mode === 'hover' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseMove(e);});
	this.gripperHover.addEventListener('pointerleave', function(e){if(currentPanelSplit.mode === 'hover' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseLeave(e);});
	this.gripperHover.addEventListener('pointerdown', function(e){if(currentPanelSplit.mode === 'hover' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseDown(e);});
	this.gripperHover.addEventListener('pointerup', function(e){if(currentPanelSplit.mode === 'hover' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseUp(e);});
	
	this.gripperFocused.addEventListener('pointermove', function(e){if(currentPanelSplit.mode === 'focus' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseMove(e);});
	this.gripperFocused.addEventListener('pointerleave', function(e){if(currentPanelSplit.mode === 'focus' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseLeave(e);});
	this.gripperFocused.addEventListener('pointerdown', function(e){if(currentPanelSplit.mode === 'focus' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseDown(e);});
	this.gripperFocused.addEventListener('pointerup', function(e){if(currentPanelSplit.mode === 'focus' && currentPanelSplit.showGripper) currentPanelSplit._gripperMouseUp(e);});
};

CrocPanelSplit.prototype = Object.create(CrocBase.prototype);
CrocPanelSplit.prototype.constructor = CrocPanelSplit;

CrocPanelSplit.prototype._gripperMouseMove = function(e) {
	if(!this.hasFocus()) {
		this.setMode('hover');
		this.getRoot().setCursor("move");
	}
	
	else {
		this.getRoot().setCursor("move");
	}
	
	return false;
};

CrocPanelSplit.prototype._gripperMouseLeave = function(e) {
	if(!this.hasFocus()) {
		this.setMode('normal');
	}
	
	this.getRoot().setCursor("");
	
	return false;
};

CrocPanelSplit.prototype._gripperMouseDown = function(e) {
	this.focus();
		
	this.globalPointToSplitSize(e.x, e.y);
	
	this.event('grippermoved', null);
	
	this.getRoot().setGlobalPaintWarning(true);
	this.setMode('focus');
};

CrocPanelSplit.prototype._gripperMouseUp = function(e) {
	this.blur();
	
	this.getRoot().setGlobalPaintWarning(false);
	this.setMode('normal');
	this.getRoot().setCursor("");
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