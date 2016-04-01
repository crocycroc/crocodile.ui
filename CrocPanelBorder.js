
//Takes eight image to generate the boarder.
// If you are wondering why there is no center image, that's beacuse you would simply make that be the children of this boarder panel.
function CrocPanelBorder(root, tr, t, tl, l, r, bl, b, br, bkg) {
	CrocPanel.call(this, root);
	
	tr = tr || "theme/CrocPanelBorder/topright.png";
	t = t || "theme/CrocPanelBorder/top.png";
	tl = tl || "theme/CrocPanelBorder/topleft.png";
	l = l || "theme/CrocPanelBorder/left.png";
	r = r || "theme/CrocPanelBorder/right.png";
	bl = bl || "theme/CrocPanelBorder/bottomleft.png";
	b = b || "theme/CrocPanelBorder/bottom.png";
	br = br || "theme/CrocPanelBorder/bottomright.png";
	bkg = bkg || "theme/CrocPanelBorder/background.png";
	
	this.backgroundImage = new CrocImageSimple(root, bkg);
	
	// tl---t----tr
	this.topLeftImage = new CrocImageSimple(root, tl);
	this.topImage = new CrocImageSimple(root, t);
	this.topRightImage = new CrocImageSimple(root, tr);
	
	// |          |
	// |          |
	// l          r
	// |          |
	// |          |
	this.leftImage = new CrocImageSimple(root, l);
	this.rightImage = new CrocImageSimple(root, r);
	
	
	// bl----b----br
	this.bottomLeftImage = new CrocImageSimple(root, bl);
	this.bottomImage = new CrocImageSimple(root, b);
	this.bottomRightImage = new CrocImageSimple(root, br);
	
	this.topLeftImage.setScaling('none');
	this.topImage.setScaling('target');
	this.topRightImage.setScaling('target');
	this.leftImage.setScaling('target');
	this.rightImage.setScaling('target');
	this.bottomLeftImage.setScaling('target');
	this.bottomImage.setScaling('target');
	this.bottomRightImage.setScaling('target');
	this.backgroundImage.setScaling('target');
};

CrocPanelBorder.prototype = Object.create(CrocPanel.prototype);
CrocPanelBorder.prototype.constructor = CrocPanelBorder;

CrocPanelBorder.prototype.hitTest = function(context, x, y, width, height) {
	
	var hitReturn = [];
	
	var hitObject = CrocBase.prototype.hitTest.call(this, context, x, y, width, height);
	
	if(hitObject !== null) {
		hitReturn.push(hitObject);
	}
	
	//When we initialize the context there needs to be a currenTransform value.
	//This is now standard but some browsers, like firefox call it mozCurrentTransform.
	//So we map with context.getCurrentTransform() function;
	
	//Push Matrix
	var parentTransform = context.getCurrentTransform();
	
	interiorWidth = this.width - this.topLeftImage.getWidth() - this.topLeftImage.getWidth();	
	interiorHeight = this.height - this.topLeftImage.getHeight() - this.topLeftImage.getHeight();
	
	for(var i = 0; i < this.children.length; i++) {
		context.translate(this.topLeftImage.getWidth(), this.topLeftImage.getHeight());
		
		var currentChild = this.children[i];
		var currentOrientation = this.childrenOrientations[currentChild.uuid];
		
		context.translate(currentOrientation.x, currentOrientation.y);
		context.rotate(currentOrientation.rotation);
		context.scale(currentOrientation.width, currentOrientation.height);
		
		hitObject = currentChild.hitTest(context, x, y, interiorWidth, interiorHeight);
		
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		//We reset the transformation for the next pass back to the parents.
		//Pop Matrix
		context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
	}
	
	return hitReturn;
};

CrocPanelBorder.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	context.save();
	
	context.beginPath();
	context.lineTo(this.getWidth(), 0);
	context.lineTo(this.getWidth(), this.getHeight());
	context.lineTo(0, this.getHeight());
	context.lineTo(0, 0);
	context.clip();
	
	var parentTransform = context.getCurrentTransform();
	
	var interiorWidth = 0;
	var interiorHeight = 0;
	
	this.topLeftImage.paint(context, width, height);
	
	interiorWidth = this.width - this.topLeftImage.getWidth() - this.bottomRightImage.getWidth();	
	interiorHeight = this.height - this.topLeftImage.getHeight() - this.bottomRightImage.getHeight();
		
	context.translate(this.topLeftImage.getWidth(), 0);
	this.topImage.setTargetHeight(this.topLeftImage.getHeight());
	this.topImage.setTargetWidth(interiorWidth);
	this.topImage.paint(context, width, height);
	
	context.translate(interiorWidth, 0);
	this.topRightImage.setTargetHeight(this.topLeftImage.getHeight());
	this.topRightImage.setTargetWidth(this.topLeftImage.getWidth());
	this.topRightImage.paint(context, width, height);
	
	context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
	context.translate(0, this.topLeftImage.getHeight());
	
	this.leftImage.setTargetWidth(this.topLeftImage.getWidth());
	this.leftImage.setTargetHeight(interiorHeight);
	this.leftImage.paint(context, width, height);
	
	context.translate(this.topLeftImage.getWidth(), 0);
	this.backgroundImage.setTargetWidth(interiorWidth);
	this.backgroundImage.setTargetHeight(interiorHeight);
	this.backgroundImage.paint(context, interiorWidth, interiorHeight);
	
	context.translate(interiorWidth, 0);
	this.rightImage.setTargetWidth(this.topLeftImage.getWidth());
	this.rightImage.setTargetHeight(interiorHeight);
	this.rightImage.paint(context, width, height);
	
	context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
	context.translate(0, this.topLeftImage.getHeight() + interiorHeight);
	
	this.bottomLeftImage.setTargetWidth(this.topLeftImage.getWidth());
	this.bottomLeftImage.setTargetHeight(this.topLeftImage.getHeight());
	this.bottomLeftImage.paint(context, width, height);
	
	context.translate(this.topLeftImage.getWidth(), 0);
	
	this.bottomImage.setTargetWidth(interiorWidth);
	this.bottomImage.setTargetHeight(this.topLeftImage.getHeight());
	this.bottomImage.paint(context, width, height);
	
	context.translate(interiorWidth, 0);
	
	this.bottomRightImage.setTargetWidth(this.topLeftImage.getWidth());
	this.bottomRightImage.setTargetHeight(this.topLeftImage.getHeight());
	this.bottomRightImage.paint(context, width, height);
	
	//Resetting for the next part for painting.
	
	context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
	
	context.translate(this.topLeftImage.getWidth(), this.topLeftImage.getHeight());
	
	//CrocPanel is going to change our currnet height and width, to the size of the interior.
	CrocPanel.prototype.paint.call(this, context, interiorWidth, interiorHeight);
	
	//We don't want that so we convert back here.
	this.width = this.convertToPixels(this.targetWidth, width);
	this.height = this.convertToPixels(this.targetHeight, height);

	context.restore();
	
	return;
	
};