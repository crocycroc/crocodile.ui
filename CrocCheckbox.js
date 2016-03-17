function CrocCheckbox(root, tr, t, tl, l, r, bl, b, br, bkg, unchecked) {
	CrocBase.call(this, root);

	tr = tr || "theme/CrocCheckbox/topright.png";
	t = t || "theme/CrocCheckbox/top.png";
	tl = tl || "theme/CrocCheckbox/topleft.png";
	l = l || "theme/CrocCheckbox/left.png";
	r = r || "theme/CrocCheckbox/right.png";
	bl = bl || "theme/CrocCheckbox/bottomleft.png";
	b = b || "theme/CrocCheckbox/bottom.png";
	br = br || "theme/CrocCheckbox/bottomright.png";
	bkg = bkg || "theme/CrocCheckbox/center.png";
	
	unchecked = "theme/CrocCheckbox/center-unchecked.png";
	
	this.value = false;
	
	this.border = new CrocPanelBorder(root, tr, t, tl, l, r, bl, b, br, bkg);
	this.uncheckedImage = new CrocImageSimple(root, unchecked);
	
	this.addEventListener('mousemove', function(e){
		this.getRoot().setCursor("pointer");
		
		return false;
	});
	
	this.addEventListener('mouseleave', function(e) {
		
		if(!this.hasFocus()) {
			this.setMode('normal');
		}
		
		this.getRoot().setCursor("");
		
		return false;
	});
	
	this.addEventListener('mousedown', function(e) {
		this.focus();
		
		this.setValue(!this.getValue());
		
		this.event('valuechanged', this.getValue());
		
		this.setMode('focus');
	});
	
	this.addEventListener('mouseup', function(e) {
		this.blur();
		this.setMode('hover');
	});
	
};

//We inherit everything from CrocBase
CrocCheckbox.prototype = Object.create(CrocBase.prototype);
CrocCheckbox.prototype.constructor = CrocCheckbox;

CrocCheckbox.prototype.getValue = function() {
	return this.value;
};

CrocCheckbox.prototype.setMode = function(mode) {
// 	this.mode = mode;
// 	this.getRoot().repaint();
};

CrocCheckbox.prototype.setValue = function(value) {
	this.value = (value == true);
	this.getRoot().repaint();
};

CrocCheckbox.prototype.getWidth = function () {
	return this.border.getWidth();
};

CrocCheckbox.prototype.getHeight = function() {
	return this.border.getHeight();
};

CrocCheckbox.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	context.save();
	
	var currentBorder = this.border;
	
	var tlw = currentBorder.topLeftImage.getWidth();
	var tlh = currentBorder.topLeftImage.getHeight();
	var brw = currentBorder.bottomRightImage.getWidth();
	var brh = currentBorder.bottomLeftImage.getHeight();
	
	currentBorder.paint(context, tlw + brw + this.uncheckedImage.getWidth(),  brh + tlh + this.uncheckedImage.getHeight());
	
	if(!this.getValue()) {
		context.translate(tlw, tlh);
		this.uncheckedImage.paint(context);
	}
	
	context.restore();
	
	return;
}