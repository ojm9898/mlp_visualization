var mlp;
var count = 0;
var error = 0;

function setup(){
	var temp1 = document.getElementById("nHiddenId");
	var nHidden = temp1.options[temp1.selectedIndex].value;
	var temp2 = document.getElementById("nHiddenNodeId");
	var nHiddenNode = temp2.options[temp2.selectedIndex].value;
	mlp = new MLP(nHidden, nHiddenNode);
	goMLP();
}

function predict(){
	var input = [];
	var input1 = document.getElementById("input1").value;
	var input2 = document.getElementById("input2").value;
	input.push(Number(input1));
	input.push(Number(input2));
	mlp.PassNet(input);
	goMLP();
}

function full_train(){
	var inputList = [];
	var counter = count;
	for(var i=count; i<count+100000; i++){
		var tempList = [Math.round(Math.random()),Math.round(Math.random())];
		inputList.push(tempList);
		counter=i;
	}
	count = counter;
	error = mlp.Train(inputList);
	goMLP();
}

function train_once(){
	var input = [];
	var input1 = document.getElementById("input1").value;
	var input2 = document.getElementById("input2").value;
	input.push(Number(input1));
	input.push(Number(input2));
	var inputList = [];
	inputList.push(input);
	count++;
	error = mlp.Train(inputList);
	goMLP();
}
