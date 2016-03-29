
function CrocPanelScrollable(root, scrollArrow, scrollEndcap, scrollCenter, tr, t, tl, l, r, bl, b, br, bkg) {
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
	
	this.scrollArrow = new CrocImageSimple(root, scrollArrow);
	this.scrollEndcap = new CrocImageSimple(root, scrollEndcap);
	this.scrollCenter = new CrocImageSimple(root, scrollCenter);
	this.scrollBorder = new CrocPanelBorder(root, tr, t, tl, l, r, bl, b, br, bkg);
	
	//Either can be 'auto', where the scrollable area size will expand automatically
	//Can be 'fixed' where the scrollable area will be exactly the target area height, and width values.
	//or 'none' which turns off all scrolling in that direction.
	this.scrollableAreaHeightMode = 'auto';
	this.scrollableAreaWidthMode = 'auto';
	
	this.scrollableAreaTargetHeight = '1200px';
	this.scrollableAreaTargetWidth = '4000px';
	
	//The current position for the width and height scroll
	this.currentWidthPosition = '0px';
	this.currentHeightPosition = '0px';
	
	this.autoHideWidthScroller = true;
	this.autoHideHeightScroller = true;
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

CrocPanelScrollable.prototype.setAutoHideHeightScroller = function(autoWidth) {
	this.setAutoHideHeightScroller = autoHide === true;
	this.getRoot().repaint();
};

CrocPanelScrollable.prototype.hitTest = function(context, x, y, width, height) {
	
	var hitReturn = [];
	
	var hitObject = CrocBase.prototype.hitTest.call(this, context, x, y, width, height);
	
	if(hitObject !== null) {
		hitReturn.push(hitObject);
	}
	
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
	
	interiorClippingWidth = this.getWidth() - this.scrollBorder.getWidth();
	interiorClippingHeight = this.getHeight() - this.scrollBorder.getHeight();
	
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
	
	var currentTransform = context.getCurrentTransform();
	
	//Draw scollers
	var tlw = this.scrollBorder.topLeftImage.getWidth();
	var tlh = this.scrollBorder.topLeftImage.getHeight();
	var brw = this.scrollBorder.bottomRightImage.getWidth();
	var brh = this.scrollBorder.bottomLeftImage.getHeight();
	
	var scrollWidth = Math.max(this.scrollArrow.getWidth(), this.scrollCenter.getWidth(), this.scrollEndcap.getWidth());
	var scrollCapHeight = this.scrollEndcap.getHeight();
	
	if(drawWidthScroller) {
		context.translate(this.getWidth() - tlw + brw, 0);
		this.scrollBorder.paint(context, tlw + brw, interiorClippingHeight);
		context.setTransform.apply(context, currentTransform);
	}
	
	if(drawHeightScroller) {
		context.translate(0, this.getHeight() - tlh + brh);
		this.scrollBorder.paint(context, interiorClippingWidth, tlh + brh);
		context.setTransform.apply(context, currentTransform);
	}
	
	//Transform to interior area space and clip it
	
	context.setTransform.apply(context, currentTransform);
	
	//Set our clipping space for the interior of the scrollable area
	context.beginPath();
	context.lineTo(interiorClippingWidth, 0);
	context.lineTo(interiorClippingWidth, interiorClippingHeight);
	context.lineTo(0, interiorClippingHeight);
	context.lineTo(0, 0);
	context.clip();
	
	//Now we transform ourselves into the scroll area's space offset by the scrollers position.
	var realCurrentWidthPosition = -1.0 * this.convertToPixels(this.currentWidthPosition, scrollableAreaWidth);
	var realCurrentHeightPosition = -1.0 * this.convertToPixels(this.currentHeightPosition, scrollableAreaHeight);
	
	context.translate(realCurrentWidthPosition, realCurrentHeightPosition);
	
	//CrocPanel is going to change our currnet height and width, to the size of the interior.
	CrocPanel.prototype.paint.call(this, context, scrollableAreaWidth, scrollableAreaHeight);
	
	//We don't want that so we convert back here.
	this.width = this.convertToPixels(this.targetWidth, width);
	this.height = this.convertToPixels(this.targetHeight, height);

	context.restore();
	
	return;
	
};