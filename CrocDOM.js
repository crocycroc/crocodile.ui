
function CrocDOM(root, contents) {
	CrocBase.call(this, root);
	
	this.domObject = null;
	this.contents = contents || '<div></div>'
	
	this.domObject = document.createElement('div');
	this.domObject.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
	this.domObject.style.zIndex = "-99";
	this.domObject.style.visibility = "hidden";
	
	this.drawnOuterHTML = '';
	this.domObject.innerHTML = this.contents;
	
	document.body.appendChild(this.domObject);
	
	this.drawDOM = true;
	this.updateContents();
	
	this.addEventListener('paintWarning', function(object){
		this.setDrawDOM(false);
		return false;
	});
};

//We inherit everything from CrocBase
CrocDOM.prototype = Object.create(CrocBase.prototype);
CrocDOM.prototype.constructor = CrocDOM;

CrocDOM.prototype.updateContents = function() {
	var currentCrocDOM = this;
	
	this.drawnInnerHTML = this.domObject.innerHTML;
	
	var tempDomClone = this.domObject.cloneNode(true);
	tempDomClone.style.zIndex = 100;
	tempDomClone.style.visibility = "visible";
	tempDomClone.style.top = "0px";
	tempDomClone.style.left = "0px";
	
	var data = 
		'data:image/svg+xml,' +
		'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + this.getWidth().toString() + 'px" height="' + this.getHeight().toString() + 'px">' +
		'<g>' + 
		'<foreignObject x="0" y="0" width="100%" height="100%">' +
		'<body xmlns="http://www.w3.org/1999/xhtml" style="margin: 0px; height: 100%;">' +
		tempDomClone.outerHTML +
		'</body>' +
		'</foreignObject>' +
		'</g>' + 
		'</svg>';

	this.drawReady = false;
	
	this.drawImage = new Image();
	
	this.drawImage.onload = function () {
		currentCrocDOM.drawReady = true;
		currentCrocDOM.getRoot().repaint();
	}
	
	this.drawImage.onerror = function() {
		console.log("DOM Render failed!");
		
		currentCrocDOM.drawReady = false;
	}
	
	this.drawImage.src = data;
};

CrocDOM.prototype.setDrawDOM = function(drawDOM) {
	this.drawDOM = drawDOM;
	
	this.getRoot().repaint();
};

CrocDOM.prototype.addPaintWarning = function(context) {
	this.getRoot().addPaintWarning(this, context.getCurrentTransform(), this.getWidth(), this.getHeight());
};

CrocDOM.prototype.paint = function(context, width, height) {
	var oldWidth = this.getWidth();
	var oldHeight = this.getHeight();
	
	CrocBase.prototype.paint.call(this, context, width, height);

	if(!this.visible) {
		this.domObject.style.visibility = "hidden";
		this.domObject.style.zIndex = "-99";
		return;
	}

	this.addPaintWarning(context);
	
	var position = this.transformPoint(context.getCurrentTransform(), 0, 0);
	this.domObject.style.position = "absolute";
	this.domObject.style.top = position.y.toString() + "px";
	this.domObject.style.left = position.x.toString() + "px";
	this.domObject.style.width = this.getWidth().toString() + "px";
	this.domObject.style.height = this.getHeight().toString() + "px";
	this.domObject.style.overflow = "hidden";
	
	if(oldWidth !== this.getWidth() || oldHeight !== this.getHeight()) {
		this.updateContents();
	}
	
	else if(this.drawnInnerHTML !== this.domObject.innerHTML) {
		this.updateContents();
	}
	
	//We should draw the real DOM element z-indexed above our root canvas.
	if(this.drawDOM) {
		this.domObject.style.visibility = "visible";
		this.domObject.style.zIndex = 100;
	}
	
	//Draw the dummy image because we don't need to be real right now.
	else {
		this.domObject.style.visibility = "hidden";
		this.domObject.style.zIndex = "-99";
		
		if(this.drawReady && this.drawImage.width > 0 && this.drawImage.height > 0) {
			context.drawImage(this.drawImage, 0, 0);
		}
		
		this.drawDOM = true;
 	}
	
	return;
};