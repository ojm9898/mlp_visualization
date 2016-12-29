function Layer(nHiddenNode) {
	this.nNode = Number(nHiddenNode) + 1;
	this.node = [];
	this.node[0] = 1.0;
	for(var i=1; i<this.nNode; i++)
		this.node[i] = 0;
}

Layer.prototype.SetNodebyIndex = function(value, index) {
	this.node[index] = value;
}

Layer.prototype.SetNodebyArray = function(value) {
	for (var i = 1; i < this.nNode; i++)
		this.node[i] = value[i - 1];
}

function MLP(nHidden, nHiddenNode) {
	this.nInput = 2, this.nOutput = 1, this.learningrate = 0.6;
	this.nHidden = Number(nHidden);
	this.nHiddenNode = Number(nHiddenNode);
	
	this.truecount = 0;
	this.falsecount = 0;
	
	this.inputLayer = new Layer(this.nInput);
	this.hiddenLayers = [];
	for(var i=0; i<this.nHidden; i++)
		this.hiddenLayers[i] = new Layer(this.nHiddenNode);
	this.outputLayer = new Layer(this.nOutput);1
	
	this.weightList = [];
	var temp = [];
	for(var i=0; i<=this.nHiddenNode; i++){
		temp[i] = [];
		for(var j=0; j<=this.nInput; j++)
			temp[i][j] = Math.random()-0.5; 
	}
	this.weightList.push(temp);
	for(var c=1; c<this.nHidden;c++){
		var temp2 = [];
		for(var i=0; i<=this.nHiddenNode; i++){
			temp2[i] = [];
			for(var j=0; j<=this.nHiddenNode; j++)
				temp2[i][j] = Math.random()-0.5;
		}
		this.weightList.push(temp2);
	}
	var temp3 =[];
	for(var i=0; i<=this.nOutput; i++){
		temp3[i] = [];
		for(var j=0; j<=this.nHiddenNode; j++)
			temp3[i][j] = Math.random()-0.5;
	}
	this.weightList.push(temp3);
}

MLP.prototype.Sigmoid = function(t){return 1.0/(1.0 + Math.exp(-t));}
MLP.prototype.Derivative = function(t){return t*(1.0-t);}
MLP.prototype.PassNet = function(input){
	this.inputLayer.SetNodebyArray(input);
	var result = [];
	
	for(var i=1; i<=this.nHiddenNode; i++){
		this.hiddenLayers[0].node[i] = 0.0;
		for(var j=0; j<=this.nInput; j++)
			this.hiddenLayers[0].node[i] += this.weightList[0][i][j] * this.inputLayer.node[j];
		this.hiddenLayers[0].node[i] = this.Sigmoid(this.hiddenLayers[0].node[i]);
	}
	
	for(var i=1; i<this.nHidden; i++){
		for(var j=1; j<=this.nHiddenNode; j++){
			this.hiddenLayers[i].node[j] = 0.0;
			for(var k=0; k<=this.nHiddenNode; k++)
				this.hiddenLayers[i].node[j] += this.weightList[i][j][k] * this.hiddenLayers[i-1].node[k];
			this.hiddenLayers[i].node[j] = this.Sigmoid(this.hiddenLayers[i].node[j]);
		}
	}
	
	for(var i=1; i<=this.nOutput; i++){
		this.outputLayer.node[i] = 0.0;
		for(var j=0; j<=this.nHiddenNode; j++)
			this.outputLayer.node[i] += this.weightList[this.nHidden][i][j] * this.hiddenLayers[this.nHidden-1].node[j];
		this.outputLayer.node[i] = this.Sigmoid(this.outputLayer.node[i]);
		result[i-1] = this.outputLayer.node[i];
	}
	
	return result;
}
MLP.prototype.BackProp = function(rOutput){
	var errorOutput = new Layer(this.nOutput);
	var errorHiddens = [];
	for(var i=0; i<this.nHidden; i++)
		errorHiddens[i] = new Layer(this.nHiddenNode);
	var errorSum = 0.0;
	
	for(var i=1; i<=this.nOutput; i++)
		errorOutput.node[i] = this.Derivative(this.outputLayer.node[i]) * (rOutput[i-1]-this.outputLayer.node[i]);
	
	for(var i=0; i<=this.nHiddenNode; i++){
		for(var j=1; j<=this.nOutput; j++)
			errorSum += this.weightList[this.nHidden][j][i] * errorOutput.node[j];
		errorHiddens[this.nHidden-1].node[i] = this.Derivative(this.hiddenLayers[this.nHidden-1].node[i]) * errorSum;
		errorSum = 0.0;
	}
	
	for(var i=this.nHidden-2; i>=0; i--){
		for(var j=0; j<=this.nHiddenNode; j++){
			for(var k=1; k<=this.nHiddenNode; k++)
				errorSum += this.weightList[i+1][k][j] * errorHiddens[i+1].node[k];
			errorHiddens[i].node[j] = this.Derivative(this.hiddenLayers[i].node[j]) * errorSum;
			errorSum = 0.0;
		}
	}
	
	for(var i=1; i<=this.nOutput; i++){
		for(var j=0; j<=this.nHiddenNode; j++)
			this.weightList[this.nHidden][i][j] += this.learningrate * errorOutput.node[i] * this.hiddenLayers[this.nHidden-1].node[j];
	}
	
	for(var i=this.nHidden-1; i>0; i--)
		for(var j=1; j<=this.nHiddenNode; j++)
			for(var k=0; k<=this.nHiddenNode; k++)
				this.weightList[i][j][k] += this.learningrate * errorHiddens[i].node[j] * this.hiddenLayers[i-1].node[k];
	
	for(var i=1; i<=this.nHiddenNode; i++)
		for(var j=0; j<=this.nInput; j++)
			this.weightList[0][i][j] += this.learningrate * errorHiddens[0].node[i] * this.inputLayer.node[j];

}
MLP.prototype.Train = function(_inputList){
	var inputList = _inputList;
	var tempOutput = [];
	for (var i=0; i<inputList.length; i++){
		if((inputList[i][0] != inputList[i][1]) && ((inputList[i][0] == 1)||(inputList[i][1]==1)))
			tempOutput[0] = 1;
		else
			tempOutput[0] = 0;

		var predict = [];
		predict.push(Math.round(this.PassNet(inputList[i])));
		if(arraysIdentical(predict,tempOutput)){
			this.truecount ++;
		}
		else{
			this.falsecount ++;
		}
		this.BackProp(tempOutput);
	}
	var errorRate = Math.round((this.falsecount/(this.truecount+this.falsecount))*1000)/10.0;
	return errorRate;
}
function arraysIdentical(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}