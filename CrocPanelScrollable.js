
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
	this.scrollCenter.setScaling("stretch");
	this.scrollBorder = new CrocPanelBorder(root, tr, t, tl, l, r, bl, b, br, bkg);
	
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
	this.currentState = 'normal';
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
	
	var tlw = this.scrollBorder.topLeftImage.getWidth();
	var tlh = this.scrollBorder.topLeftImage.getHeight();
	var brw = this.scrollBorder.bottomRightImage.getWidth();
	var brh = this.scrollBorder.bottomLeftImage.getHeight();
	
	var scrollWidth = Math.max(this.scrollArrow.getImageWidth(), this.scrollCenter.getImageWidth(), this.scrollEndcap.getImageWidth());
	var scrollCapHeight = this.scrollEndcap.getHeight();
	var scrollArrowHeight = this.scrollArrow.getHeight();
	
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
	var currentScrollArrow = this.scrollArrow;
	var currentScrollEndcap = this.scrollEndcap;
	var currentScrollCenter = this.scrollCenter;
	
	switch(this.currentState) {
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
	var realCurrentWidthPosition = -1.0 * this.convertToPixels(this.currentWidthPosition, scrollableAreaWidth);
	var realCurrentHeightPosition = -1.0 * this.convertToPixels(this.currentHeightPosition, scrollableAreaHeight);
	
	
	if(drawHeightScroller) {

		var scrollSpanStart = (-realCurrentHeightPosition/scrollableAreaHeight) * (interiorClippingHeight - (scrollArrowHeight * 2) - tlh - brh);
		var scrollSpanEnd = Math.min(scrollSpanStart + (interiorClippingHeight/scrollableAreaHeight) * (interiorClippingHeight - (scrollArrowHeight * 2) - tlh - brh), (interiorClippingHeight - (scrollArrowHeight * 2) - tlh - brh)); 
		
		context.save();
		
		context.translate(interiorClippingWidth, 0);
		this.scrollBorder.paint(context, tlw + brw + scrollWidth, interiorClippingHeight);
		
		var currentTransform = context.getCurrentTransform();
		
		context.translate(tlw, tlh + scrollArrowHeight);
		context.scale(1.0, -1.0);
		currentScrollArrow.paint(context, scrollWidth, interiorClippingHeight - tlh - brh);
		context.scale(1.0, -1.0);
		
		context.translate(0, scrollSpanStart);
		context.scale(1.0, -1.0);
		context.translate(0, -currentScrollEndcap.getImageHeight());
		currentScrollEndcap.paint(context, scrollWidth, currentScrollEndcap.getImageHeight());
		context.translate(0, currentScrollEndcap.getImageHeight());
		context.scale(1.0, -1.0);
		
		context.translate(0, currentScrollEndcap.getImageHeight());
		currentScrollCenter.paint(context, scrollWidth, scrollSpanEnd - scrollSpanStart - (currentScrollEndcap.getImageHeight() * 2));
		
		context.translate(0, scrollSpanEnd - scrollSpanStart - currentScrollEndcap.getImageHeight() * 2);
		currentScrollEndcap.paint(context, scrollWidth, currentScrollEndcap.getImageHeight());

		context.setTransform.apply(context, currentTransform);
		context.translate(tlw, interiorClippingHeight - scrollArrowHeight - brh);
		currentScrollArrow.paint(context, scrollWidth, scrollArrowHeight);
		
		context.restore();
	}
	
	if(drawWidthScroller) {
		
		var scrollSpanStart = (-realCurrentWidthPosition/scrollableAreaWidth) * (interiorClippingWidth - (scrollArrowHeight * 2) - tlh - brh);
		var scrollSpanEnd = Math.min(scrollSpanStart + (interiorClippingWidth/scrollableAreaWidth) * (interiorClippingWidth - (scrollArrowHeight * 2) - tlh - brh), (interiorClippingWidth - (scrollArrowHeight * 2) - tlh - brh)); 
		
		context.save();
		
		context.translate(0, interiorClippingHeight + tlh + brh + scrollWidth);
		context.rotate((3 * Math.PI)/2);
		var currentTransform = context.getCurrentTransform();

		this.scrollBorder.paint(context, tlw + brw + scrollWidth, interiorClippingWidth);
		
		context.translate(tlw, tlh + scrollArrowHeight);
		context.scale(1.0, -1.0);
		currentScrollArrow.paint(context, scrollWidth, interiorClippingWidth - tlh - brh);
		context.scale(1.0, -1.0);
		
		context.translate(0, scrollSpanStart);
		context.scale(1.0, -1.0);
		context.translate(0, -currentScrollEndcap.getImageHeight());
		currentScrollEndcap.paint(context, scrollWidth, currentScrollEndcap.getImageHeight());
		context.translate(0, currentScrollEndcap.getImageHeight());
		context.scale(1.0, -1.0);
		
		context.translate(0, currentScrollEndcap.getImageHeight());
		currentScrollCenter.paint(context, scrollWidth, scrollSpanEnd - scrollSpanStart - (currentScrollEndcap.getImageHeight() * 2));
		
		context.translate(0, scrollSpanEnd - scrollSpanStart - currentScrollEndcap.getImageHeight() * 2);
		currentScrollEndcap.paint(context, scrollWidth, currentScrollEndcap.getImageHeight());
		
		context.setTransform.apply(context, currentTransform);
		context.translate(tlw, interiorClippingWidth - scrollArrowHeight - brh);
		currentScrollArrow.paint(context, scrollWidth, scrollArrowHeight);
		
		context.restore();
	}
	
	
	context.translate(realCurrentWidthPosition, realCurrentHeightPosition);
	
	context.beginPath();
	context.lineTo(interiorClippingWidth, 0);
	context.lineTo(interiorClippingWidth, interiorClippingHeight);
	context.lineTo(0, height);
	context.lineTo(0, 0);
	context.clip();
	
	//CrocPanel is going to change our currnet height and width, to the size of the interior.
	CrocPanel.prototype.paint.call(this, context, scrollableAreaWidth, scrollableAreaHeight);
	
	//We don't want that so we convert back here.
	this.width = this.convertToPixels(this.targetWidth, width);
	this.height = this.convertToPixels(this.targetHeight, height);

	context.restore();
	
	return;
	
};