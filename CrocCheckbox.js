function CrocCheckbox(root, tr, t, tl, l, r, bl, b, br, bkg, unchecked) {
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
	
	unchecked = unchecked || root.themer.getValue(arguments.callee, "unchecked");
	
	this.value = false;
	
	this.border = new CrocPanelBorder(root, tl, t, tr, l, r, bl, b, br, bkg);
	this.uncheckedImage = new CrocImageSimple(root, unchecked);
	
	this.addEventListener('pointermove', function(e){
		this.getRoot().setCursor("pointer");
		
		return false;
	});
	
	this.addEventListener('pointerleave', function(e) {
		
		if(!this.hasFocus()) {
			this.setMode('normal');
		}
		
		this.getRoot().setCursor("");
		
		return false;
	});
	
	this.addEventListener('pointerdown', function(e) {
		this.focus();
		
		this.setValue(!this.getValue());
		
		this.event('valuechanged', this.getValue());
		
		this.setMode('focus');
	});
	
	this.addEventListener('pointerup', function(e) {
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
