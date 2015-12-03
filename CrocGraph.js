
function CrocGraph(root) {
	CrocBase.call(this, root);
	
	this.dataSets = {};
	this.unitTypes = {};
	this.majorXStep = 10;
	this.minorXStep = 1;
};

CrocGraph.prototype = Object.create(CrocBase.prototype);

CrocGraph.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
};