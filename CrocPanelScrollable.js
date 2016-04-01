
function CrocPanelScrollable(root, 
			     scrollArrow, 
			     scrollEndcap, 
			     scrollCenter, 
			     scrollArrowHover, 
			     scrollEndcapHover, 
			     scrollCenterHover, 
			     scrollArrowPressed, 
			     scrollEndcapPressed, 
			     scrollCenterPressed,  
			     tr, t, tl, l, r, bl, b, br, bkg) {
	var currentPanelScrollable = this;
	
	CrocPanel.call(this, root);
	
	scrollArrow = scrollArrow || "theme/CrocPanelScrollable/scroll-arrow.png";
	scrollEndcap = scrollEndcap || "theme/CrocPanelScrollable/scroll-endcap.png";
	scrollCenter = scrollCenter || "theme/CrocPanelScrollable/scroll-center.png";
	
	scrollArrowHover = scrollArrowHover || "theme/CrocPanelScrollable/scroll-arrow.png";
	scrollEndcapHover = scrollEndcapHover || "theme/CrocPanelScrollable/scroll-endcap.png";
	scrollCenterHover = scrollCenterHover || "theme/CrocPanelScrollable/scroll-center.png";
	
	scrollArrowPressed = scrollArrowPressed || "theme/CrocPanelScrollable/scroll-arrow.png";
	scrollEndcapPressed = scrollEndcapPressed || "theme/CrocPanelScrollable/scroll-endcap.png";
	scrollCenterPressed = scrollCenterPressed || "theme/CrocPanelScrollable/scroll-center.png";
	
	tr = tr || "theme/CrocPanelScrollable/topright.png";
	t = t || "theme/CrocPanelScrollable/top.png";
	tl = tl || "theme/CrocPanelScrollable/topleft.png";
	l = l || "theme/CrocPanelScrollable/left.png";
	r = r || "theme/CrocPanelScrollable/right.png";
	bl = bl || "theme/CrocPanelScrollable/bottomleft.png";
	b = b || "theme/CrocPanelScrollable/bottom.png";
	br = br || "theme/CrocPanelScrollable/bottomright.png";
	bkg = bkg || "theme/CrocPanelScrollable/background.png";
	
	//Maybe this would be easier if these were buttons.
	this.scrollArrowUp = new CrocButton(root, scrollArrow, scrollArrow, scrollArrow);
	this.scrollArrowDown = new CrocButton(root, scrollArrow, scrollArrow, scrollArrow);
	this.scrollEndcapUp = new CrocButton(root, scrollEndcap, scrollEndcap, scrollEndcap);
	this.scrollEndcapDown = new CrocButton(root, scrollEndcap, scrollEndcap, scrollEndcap);
	this.scrollCenterUpDown = new CrocButton(root, scrollCenter, scrollCenter, scrollCenter);
	this.scrollCenterUpDown.setScaling("stretch");
	this.scrollBorderUpDown = new CrocPanelBorder(root, tr, t, tl, l, r, bl, b, br, bkg);
	
	this.scrollArrowLeft = new CrocButton(root, scrollArrow, scrollArrow, scrollArrow);
	this.scrollArrowRight = new CrocButton(root, scrollArrow, scrollArrow, scrollArrow);
	this.scrollEndcapLeft = new CrocButton(root, scrollEndcap, scrollEndcap, scrollEndcap);
	this.scrollEndcapRight = new CrocButton(root, scrollEndcap, scrollEndcap, scrollEndcap);
	this.scrollCenterLeftRight = new CrocButton(root, scrollCenter, scrollCenter, scrollCenter);
	this.scrollCenterLeftRight.setScaling("stretch");
	this.scrollBorderLeftRight = new CrocPanelBorder(root, tr, t, tl, l, r, bl, b, br, bkg);
	
	this.addEventListener('scrollverticle', function(e) {
		var realCurrentHeightPosition = this.convertToPixels(this.currentHeightPosition, this.getHeight());
		realCurrentHeightPosition = Math.round(realCurrentHeightPosition - e.delta);
		
		this.setCurrentHeightPosition(realCurrentHeightPosition);
		
		return true;
	});
	
	this.addEventListener('scrollhorizontal', function(e) {
		var realCurrentWidthPosition = this.convertToPixels(this.currentWidthPosition, this.getWidth());
		realCurrentWidthPosition = Math.round(realCurrentWidthPosition - e.delta);
		
		this.setCurrentWidthPosition(realCurrentWidthPosition);
		
		return true;
	});
	
	//Either can be 'auto', where the scrollable area size will expand automatically
	//Can be 'fixed' where the scrollable area will be exactly the target area height, and width values.
	//or 'none' which turns off all scrolling in that direction.
	this.scrollableAreaHeightMode = 'fixed';
	this.scrollableAreaWidthMode = 'fixed';
	
	this.scrollableAreaTargetHeight = '1200px';
	this.scrollableAreaTargetWidth = '4000px';
	
	//The current position for the width and height scroll
	this.currentWidthPosition = '0px';
	this.currentHeightPosition = '0px';
	
	this.autoHideWidthScroller = false;
	this.autoHideHeightScroller = false;
	
	//hover, pressed, and normal are the three states
	this.mode = 'normal';
};

CrocPanelScrollable.prototype = Object.create(CrocPanel.prototype);
CrocPanelScrollable.prototype.constructor = CrocPanelScrollable;

CrocPanelScrollable.prototype.setScrollableAreaHeightMode = function(mode) {
	this.scrollableAreaHeightMode = mode;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.setScrollableAreaWidthMode = function(mode) {
	this.setScrollableAreaWidthMode = mode;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.setScrollableAreaTargetWidth = function(targetWidth) {
	this.setScrollableAreaTargetWidth = targetWidth;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.setScrollableAreaTargetHeight = function(targetHeight) {
	this.setScrollableAreaTargetHeight = targetHeight;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.setCurrentWidthPosition = function(targetWidthPosition) {
	this.currentWidthPosition = targetWidthPosition;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.setCurrentHeightPosition = function(targetHeightPosition) {
	this.currentHeightPosition = targetHeightPosition;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.setAutoHideWidthScroller = function(autoHide) {
	this.autoHideWidthScroller = autoHide === true;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.setAutoHideHeightScroller = function(autoHide) {
	this.setAutoHideHeightScroller = autoHide === true;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.hitTest = function(context, x, y, width, height) {
	
	var hitReturn = [];
	
	var hitObject = CrocBase.prototype.hitTest.call(this, context, x, y, width, height);
	
	if(hitObject !== null) {
		hitReturn.push(hitObject);
	}
	
	var interiorClippingWidth = 0;
	var interiorClippingHeight = 0;
	var scrollableAreaWidth = 0;
	var scrollableAreaHeight = 0;
	var maxWidth = 0; //Used to calculate the auto scrolling size
	var maxHeight = 0;
	var drawWidthScroller = !this.autoHideWidthScroller;
	var drawHeightScroller = !this.autoHideHeightScroller;
	
	var tlw = this.scrollBorderUpDown.topLeftImage.getWidth();
	var tlh = this.scrollBorderUpDown.topLeftImage.getHeight();
	var brw = this.scrollBorderUpDown.bottomRightImage.getWidth();
	var brh = this.scrollBorderUpDown.bottomLeftImage.getHeight();
	
	var scrollWidth = Math.max(this.scrollArrowUp.normal.getImageWidth(), this.scrollCenterUpDown.normal.getImageWidth(), this.scrollEndcapUp.normal.getImageWidth());
	var scrollCapHeight = this.scrollEndcapUp.getHeight();
	var scrollArrowUpHeight = this.scrollArrowUp.getHeight();
	
	interiorClippingWidth = this.getWidth() - (tlw + brw + scrollWidth);
	interiorClippingHeight = this.getHeight() - (tlw + brw + scrollWidth);
	
	if(this.scrollableAreaWidthMode === 'auto' || this.scrollableAreaHeightMode === 'auto') {
		//TODO: We need to get a good calculation on how much space the interior scoll area panel would take,
		// if you can imagine that we gave it an infinite plane to draw on.
	}
	
	switch(this.scrollableAreaWidthMode) {
		case 'auto':
			scrollableAreaWidth = maxWidth;
			
			if(this.autoHideWidthScroller && scrollableAreaWidth <= this.getWidth()) {
				interiorClippingWidth = this.getWidth();
				drawWidthScroller = false;
			}
			
			break;
			
		case 'fixed':
			scrollableAreaWidth = this.convertToPixels(this.scrollableAreaTargetWidth, this.getWidth());
			
			if(this.autoHideWidthScroller && scrollableAreaWidth <= this.getWidth()) {
				interiorClippingWidth = this.getWidth();
				drawWidthScroller = false;
			}
				
			break;
			
		default:
			if(this.autoHideWidthScroller) {
				interiorClippingWidth = this.getWidth();
				drawWidthScroller = false;
			}
			
			scrollableAreaWidth = interiorClippingWidth;
			break;
	}
	
	switch(this.scrollableAreaHeightMode) {
		case 'auto':
			scrollableAreaHeight = maxHeight;
			
			if(this.autoHideHeightScroller && scrollableAreaHeight <= this.getHeight()) {
				interiorClippingHeight = this.getHeight();
				drawHeightScroller = false;
			}
			
			break;
			
		case 'fixed':
			scrollableAreaHeight = this.convertToPixels(this.scrollableAreaTargetHeight, this.getHeight());
			
			if(this.autoHideHeightScroller && scrollableAreaHeight <= this.getHeight()) {
				interiorClippingHeight = this.getHeight();
				drawHeightScroller = false;
			}
				
			break;
			
		default:
			if(this.autoHideHeightScroller) {
				interiorClippingHeight = this.getHeight();
				drawHeightScroller = false;
			}
			
			scrollableAreaHeight = interiorClippingHeight;
			break;
	}

	context.save();
	
	//Draw scollers
	var currentScrollArrowUp = this.scrollArrowUp;
	var currentScrollArrowDown = this.scrollArrowDown;
	var currentScrollEndcapUp = this.scrollEndcapUp;
	var currentScrollEndcapDown = this.scrollEndcapDown;
	var currentScrollCenterUpDown = this.scrollCenterUpDown;
	
	var currentScrollArrowLeft = this.scrollArrowLeft;
	var currentScrollArrowRight = this.scrollArrowRight;
	var currentScrollEndcapLeft = this.scrollEndcapLeft;
	var currentScrollEndcapRight = this.scrollEndcapRight;
	var currentScrollCenterLeftRight = this.scrollCenterLeftRight;
	
	switch(this.mode) {
		case 'normal':
			break;
			
		case 'hover':
			break;
			
		case 'pressed':
			break;
			
		default:
			break;
	}
	
	//Now we transform ourselves into the scroll area's space offset by the scrollers position.
	var realCurrentWidthPosition = this.convertToPixels(this.currentWidthPosition, scrollableAreaWidth);
	var realCurrentHeightPosition = this.convertToPixels(this.currentHeightPosition, scrollableAreaHeight);
	
	if(realCurrentWidthPosition < 0) {
		this.currentWidthPosition = 0;
		realCurrentWidthPosition = 0;
	}
	
	else if(realCurrentWidthPosition > scrollableAreaWidth - interiorClippingWidth) {
		this.currentWidthPosition = scrollableAreaWidth - interiorClippingWidth;
		realCurrentWidthPosition = scrollableAreaWidth - interiorClippingWidth;
	}
	
	if(realCurrentHeightPosition < 0) {
		this.currentHeightPosition = 0;
		realCurrentHeightPosition = 0;
	}
	
	else if(realCurrentHeightPosition > scrollableAreaHeight - interiorClippingHeight) {
		this.currentHeightPosition = scrollableAreaHeight - interiorClippingHeight;
		realCurrentHeightPosition = scrollableAreaHeight - interiorClippingHeight;
	}
	
	var scrollSpanStartLeftRight = (realCurrentWidthPosition/scrollableAreaWidth) * (interiorClippingWidth - (scrollArrowUpHeight * 2) - tlh - brh);
	var scrollSpanEndLeftRight = Math.min(scrollSpanStartLeftRight + (interiorClippingWidth/scrollableAreaWidth) * (interiorClippingWidth - (scrollArrowUpHeight * 2) - tlh - brh), (interiorClippingWidth - (scrollArrowUpHeight * 2) - tlh - brh)); 
		
	var scrollSpanStartUpDown = (realCurrentHeightPosition/scrollableAreaHeight) * (interiorClippingHeight - (scrollArrowUpHeight * 2) - tlh - brh);
	var scrollSpanEndUpDown = Math.min(scrollSpanStartUpDown + (interiorClippingHeight/scrollableAreaHeight) * (interiorClippingHeight - (scrollArrowUpHeight * 2) - tlh - brh), (interiorClippingHeight - (scrollArrowUpHeight * 2) - tlh - brh)); 
	
	
	
	
	if(drawHeightScroller) {
		context.save();
		
		context.translate(interiorClippingWidth, 0);
		var hitObject = this.scrollBorderUpDown.hitTest(context, x, y, tlw + brw + scrollWidth, interiorClippingHeight);
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		var currentTransform = context.getCurrentTransform();
		
		context.translate(tlw, tlh + scrollArrowUpHeight);
		context.scale(1.0, -1.0);
		var hitObject = currentScrollArrowUp.hitTest(context, x, y, scrollWidth, interiorClippingHeight - tlh - brh);
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		context.scale(1.0, -1.0);
		
		context.translate(0, scrollSpanStartUpDown);
		context.scale(1.0, -1.0);
		context.translate(0, -currentScrollEndcapUp.normal.getImageHeight());
		var hitObject = currentScrollEndcapUp.hitTest(context, x, y, scrollWidth, currentScrollEndcapUp.normal.getImageHeight());
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.translate(0, currentScrollEndcapUp.normal.getImageHeight());
		context.scale(1.0, -1.0);
		
		context.translate(0, currentScrollEndcapUp.normal.getImageHeight());
		var hitObject = currentScrollCenterUpDown.hitTest(context, x, y, scrollWidth, scrollSpanEndUpDown - scrollSpanStartUpDown - (currentScrollEndcapUp.normal.getImageHeight() * 2));
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.translate(0, scrollSpanEndUpDown - scrollSpanStartUpDown - currentScrollEndcapDown.normal.getImageHeight() * 2);
		var hitObject = currentScrollEndcapDown.hitTest(context, x, y, scrollWidth, currentScrollEndcapDown.normal.getImageHeight());
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}

		context.setTransform.apply(context, currentTransform);
		context.translate(tlw, interiorClippingHeight - scrollArrowUpHeight - brh);
		var hitObject = currentScrollArrowDown.hitTest(context, x, y, scrollWidth, scrollArrowUpHeight);
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.restore();
	}
	
	if(drawWidthScroller) {
		
		context.save();
		
		context.translate(0, interiorClippingHeight + tlh + brh + scrollWidth);
		context.rotate((3 * Math.PI)/2);
		var currentTransform = context.getCurrentTransform();

		var hitObject = this.scrollBorderLeftRight.hitTest(context, x, y, tlw + brw + scrollWidth, interiorClippingWidth);
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.translate(tlw, tlh + scrollArrowUpHeight);
		context.scale(1.0, -1.0);
		var hitObject = currentScrollArrowLeft.hitTest(context, x, y, scrollWidth, interiorClippingWidth - tlh - brh);
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.scale(1.0, -1.0);
		
		context.translate(0, scrollSpanStartLeftRight);
		context.scale(1.0, -1.0);
		context.translate(0, -currentScrollEndcapLeft.normal.getImageHeight());
		var hitObject = currentScrollEndcapLeft.hitTest(context, x, y, scrollWidth, currentScrollEndcapLeft.normal.getImageHeight());
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.translate(0, currentScrollEndcapLeft.normal.getImageHeight());
		context.scale(1.0, -1.0);
		
		context.translate(0, currentScrollEndcapLeft.normal.getImageHeight());
		var hitObject = currentScrollCenterLeftRight.hitTest(context, x, y, scrollWidth, scrollSpanEndLeftRight - scrollSpanStartLeftRight - (currentScrollEndcapLeft.normal.getImageHeight() * 2));
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.translate(0, scrollSpanEndLeftRight - scrollSpanStartLeftRight - currentScrollEndcapRight.normal.getImageHeight() * 2);
		var hitObject = currentScrollEndcapRight.hitTest(context, x, y, scrollWidth, currentScrollEndcapRight.normal.getImageHeight());
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.setTransform.apply(context, currentTransform);
		context.translate(tlw, interiorClippingWidth - scrollArrowUpHeight - brh);
		var hitObject = currentScrollArrowRight.hitTest(context, x, y, scrollWidth, scrollArrowUpHeight);
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.restore();
	}
	
	
	context.translate(-1.0 * realCurrentWidthPosition, -1.0 * realCurrentHeightPosition);
	
	context.beginPath();
	context.lineTo(interiorClippingWidth, 0);
	context.lineTo(interiorClippingWidth, interiorClippingHeight);
	context.lineTo(0, height);
	context.lineTo(0, 0);
	context.clip();
	
	//CrocPanel is going to change our currnet height and width, to the size of the interior.
	var hitObject = CrocPanel.prototype.hitTest.call(this, context, x, y, context, scrollableAreaWidth, scrollableAreaHeight);
	
	if(hitObject !== null) {
		hitReturn.push(hitObject);
	}
	
	//We don't want that so we convert back here.
	this.width = this.convertToPixels(this.targetWidth, width);
	this.height = this.convertToPixels(this.targetHeight, height);

	context.restore();
	
	return hitReturn;
};

CrocPanelScrollable.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	var interiorClippingWidth = 0;
	var interiorClippingHeight = 0;
	var scrollableAreaWidth = 0;
	var scrollableAreaHeight = 0;
	var maxWidth = 0; //Used to calculate the auto scrolling size
	var maxHeight = 0;
	var drawWidthScroller = !this.autoHideWidthScroller;
	var drawHeightScroller = !this.autoHideHeightScroller;
	
	var tlw = this.scrollBorderUpDown.topLeftImage.getWidth();
	var tlh = this.scrollBorderUpDown.topLeftImage.getHeight();
	var brw = this.scrollBorderUpDown.bottomRightImage.getWidth();
	var brh = this.scrollBorderUpDown.bottomLeftImage.getHeight();
	
	var scrollWidth = Math.max(this.scrollArrowUp.normal.getImageWidth(), this.scrollCenterUpDown.normal.getImageWidth(), this.scrollEndcapUp.normal.getImageWidth());
	var scrollCapHeight = this.scrollEndcapUp.getHeight();
	var scrollArrowUpHeight = this.scrollArrowUp.getHeight();
	
	interiorClippingWidth = this.getWidth() - (tlw + brw + scrollWidth);
	interiorClippingHeight = this.getHeight() - (tlw + brw + scrollWidth);
	
	if(this.scrollableAreaWidthMode === 'auto' || this.scrollableAreaHeightMode === 'auto') {
		//TODO: We need to get a good calculation on how much space the interior scoll area panel would take,
		// if you can imagine that we gave it an infinite plane to draw on.
	}
	
	switch(this.scrollableAreaWidthMode) {
		case 'auto':
			scrollableAreaWidth = maxWidth;
			
			if(this.autoHideWidthScroller && scrollableAreaWidth <= this.getWidth()) {
				interiorClippingWidth = this.getWidth();
				drawWidthScroller = false;
			}
			
			break;
			
		case 'fixed':
			scrollableAreaWidth = this.convertToPixels(this.scrollableAreaTargetWidth, this.getWidth());
			
			if(this.autoHideWidthScroller && scrollableAreaWidth <= this.getWidth()) {
				interiorClippingWidth = this.getWidth();
				drawWidthScroller = false;
			}
				
			break;
			
		default:
			if(this.autoHideWidthScroller) {
				interiorClippingWidth = this.getWidth();
				drawWidthScroller = false;
			}
			
			scrollableAreaWidth = interiorClippingWidth;
			break;
	}
	
	switch(this.scrollableAreaHeightMode) {
		case 'auto':
			scrollableAreaHeight = maxHeight;
			
			if(this.autoHideHeightScroller && scrollableAreaHeight <= this.getHeight()) {
				interiorClippingHeight = this.getHeight();
				drawHeightScroller = false;
			}
			
			break;
			
		case 'fixed':
			scrollableAreaHeight = this.convertToPixels(this.scrollableAreaTargetHeight, this.getHeight());
			
			if(this.autoHideHeightScroller && scrollableAreaHeight <= this.getHeight()) {
				interiorClippingHeight = this.getHeight();
				drawHeightScroller = false;
			}
				
			break;
			
		default:
			if(this.autoHideHeightScroller) {
				interiorClippingHeight = this.getHeight();
				drawHeightScroller = false;
			}
			
			scrollableAreaHeight = interiorClippingHeight;
			break;
	}

	context.save();
	
	//Draw scollers
	var currentScrollArrowUp = this.scrollArrowUp;
	var currentScrollArrowDown = this.scrollArrowDown;
	var currentScrollEndcapUp = this.scrollEndcapUp;
	var currentScrollEndcapDown = this.scrollEndcapDown;
	var currentScrollCenterUpDown = this.scrollCenterUpDown;
	
	var currentScrollArrowLeft = this.scrollArrowLeft;
	var currentScrollArrowRight = this.scrollArrowRight;
	var currentScrollEndcapLeft = this.scrollEndcapLeft;
	var currentScrollEndcapRight = this.scrollEndcapRight;
	var currentScrollCenterLeftRight = this.scrollCenterLeftRight;
	
	switch(this.mode) {
		case 'normal':
			break;
			
		case 'hover':
			break;
			
		case 'pressed':
			break;
			
		default:
			break;
	}
	
	//Now we transform ourselves into the scroll area's space offset by the scrollers position.
	var realCurrentWidthPosition = this.convertToPixels(this.currentWidthPosition, scrollableAreaWidth);
	var realCurrentHeightPosition = this.convertToPixels(this.currentHeightPosition, scrollableAreaHeight);
	
	if(realCurrentWidthPosition < 0) {
		this.currentWidthPosition = 0;
		realCurrentWidthPosition = 0;
	}
	
	else if(realCurrentWidthPosition > scrollableAreaWidth - interiorClippingWidth) {
		this.currentWidthPosition = scrollableAreaWidth - interiorClippingWidth;
		realCurrentWidthPosition = scrollableAreaWidth - interiorClippingWidth;
	}
	
	if(realCurrentHeightPosition < 0) {
		this.currentHeightPosition = 0;
		realCurrentHeightPosition = 0;
	}
	
	else if(realCurrentHeightPosition > scrollableAreaHeight - interiorClippingHeight) {
		this.currentHeightPosition = scrollableAreaHeight - interiorClippingHeight;
		realCurrentHeightPosition = scrollableAreaHeight - interiorClippingHeight;
	}
	
	var scrollSpanStartLeftRight = (realCurrentWidthPosition/scrollableAreaWidth) * (interiorClippingWidth - (scrollArrowUpHeight * 2) - tlh - brh);
	var scrollSpanEndLeftRight = Math.min(scrollSpanStartLeftRight + (interiorClippingWidth/scrollableAreaWidth) * (interiorClippingWidth - (scrollArrowUpHeight * 2) - tlh - brh), (interiorClippingWidth - (scrollArrowUpHeight * 2) - tlh - brh)); 
		
	var scrollSpanStartUpDown = (realCurrentHeightPosition/scrollableAreaHeight) * (interiorClippingHeight - (scrollArrowUpHeight * 2) - tlh - brh);
	var scrollSpanEndUpDown = Math.min(scrollSpanStartUpDown + (interiorClippingHeight/scrollableAreaHeight) * (interiorClippingHeight - (scrollArrowUpHeight * 2) - tlh - brh), (interiorClippingHeight - (scrollArrowUpHeight * 2) - tlh - brh)); 
	
	context.save();
	
	context.translate(-1.0 * realCurrentWidthPosition, -1.0 * realCurrentHeightPosition);
	
	context.beginPath();
	context.lineTo(interiorClippingWidth, 0);
	context.lineTo(interiorClippingWidth, interiorClippingHeight);
	context.lineTo(0, height);
	context.lineTo(0, 0);
	context.clip();
	
	//CrocPanel is going to change our currnet height and width, to the size of the interior.
	CrocPanel.prototype.paint.call(this, context, scrollableAreaWidth, scrollableAreaHeight);
	
	context.restore();
	
	//We don't want that so we convert back here.
	this.width = this.convertToPixels(this.targetWidth, width);
	this.height = this.convertToPixels(this.targetHeight, height);
	
	if(drawHeightScroller) {
		context.save();
		
		context.translate(interiorClippingWidth, 0);
		this.scrollBorderUpDown.paint(context, tlw + brw + scrollWidth, interiorClippingHeight);
		
		var currentTransform = context.getCurrentTransform();
		
		context.translate(tlw, tlh + scrollArrowUpHeight);
		context.scale(1.0, -1.0);
		currentScrollArrowUp.paint(context, scrollWidth, interiorClippingHeight - tlh - brh);
		context.scale(1.0, -1.0);
		
		context.translate(0, scrollSpanStartUpDown);
		context.scale(1.0, -1.0);
		context.translate(0, -currentScrollEndcapUp.normal.getImageHeight());
		currentScrollEndcapUp.paint(context, scrollWidth, currentScrollEndcapUp.normal.getImageHeight());
		context.translate(0, currentScrollEndcapUp.normal.getImageHeight());
		context.scale(1.0, -1.0);
		
		context.translate(0, currentScrollEndcapUp.normal.getImageHeight());
		currentScrollCenterUpDown.paint(context, scrollWidth, scrollSpanEndUpDown - scrollSpanStartUpDown - (currentScrollEndcapUp.normal.getImageHeight() * 2));
		
		context.translate(0, scrollSpanEndUpDown - scrollSpanStartUpDown - currentScrollEndcapDown.normal.getImageHeight() * 2);
		currentScrollEndcapDown.paint(context, scrollWidth, currentScrollEndcapDown.normal.getImageHeight());

		context.setTransform.apply(context, currentTransform);
		context.translate(tlw, interiorClippingHeight - scrollArrowUpHeight - brh);
		currentScrollArrowDown.paint(context, scrollWidth, scrollArrowUpHeight);
		
		context.restore();
	}
	
	if(drawWidthScroller) {
		
		context.save();
		
		context.translate(0, interiorClippingHeight + tlh + brh + scrollWidth);
		context.rotate((3 * Math.PI)/2);
		var currentTransform = context.getCurrentTransform();

		this.scrollBorderLeftRight.paint(context, tlw + brw + scrollWidth, interiorClippingWidth);
		
		context.translate(tlw, tlh + scrollArrowUpHeight);
		context.scale(1.0, -1.0);
		currentScrollArrowLeft.paint(context, scrollWidth, interiorClippingWidth - tlh - brh);
		context.scale(1.0, -1.0);
		
		context.translate(0, scrollSpanStartLeftRight);
		context.scale(1.0, -1.0);
		context.translate(0, -currentScrollEndcapLeft.normal.getImageHeight());
		currentScrollEndcapLeft.paint(context, scrollWidth, currentScrollEndcapLeft.normal.getImageHeight());
		context.translate(0, currentScrollEndcapLeft.normal.getImageHeight());
		context.scale(1.0, -1.0);
		
		context.translate(0, currentScrollEndcapLeft.normal.getImageHeight());
		currentScrollCenterLeftRight.paint(context, scrollWidth, scrollSpanEndLeftRight - scrollSpanStartLeftRight - (currentScrollEndcapLeft.normal.getImageHeight() * 2));
		
		context.translate(0, scrollSpanEndLeftRight - scrollSpanStartLeftRight - currentScrollEndcapRight.normal.getImageHeight() * 2);
		currentScrollEndcapRight.paint(context, scrollWidth, currentScrollEndcapRight.normal.getImageHeight());
		
		context.setTransform.apply(context, currentTransform);
		context.translate(tlw, interiorClippingWidth - scrollArrowUpHeight - brh);
		currentScrollArrowRight.paint(context, scrollWidth, scrollArrowUpHeight);
		
		context.restore();
	}

	context.restore();
	
	return;
	
};