function CrocTextField(root, type, value) {
	CrocDOM.call(this, root);
	
	this.inputObject = document.createElement('input');
	
	this.domObject.appendChild(this.inputObject);
};

//We inherit everything from CrocBase
CrocTextField.prototype = Object.create(CrocDOM.prototype);
