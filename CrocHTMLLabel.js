
function CrocHTMLLabel(root, contents) {
	CrocDOM.call(this, root, contents);
};

//We inherit everything from CrocBase
CrocHTMLLabel.prototype = Object.create(CrocDOM.prototype);
