var mlp;
var count = 0;
var error = 0;

function setup(){
	var temp1 = document.getElementById("nHiddenId");
	var nHidden = temp1.options[temp1.selectedIndex].value;
	if(nHidden == ""){
		alert("Please Select Number of Hidden Layers!");
		return;
	}
	var temp2 = document.getElementById("nHiddenNodeId");
	var nHiddenNode = temp2.options[temp2.selectedIndex].value;
	if(nHiddenNode == ""){
		alert("Please Select Number of Hidden Nodes!");
		return;
	}
	mlp = new MLP(nHidden, nHiddenNode);
	count = 0;
	error = 0;
	initMLP();
	updateInfo();
}

function predict(){
	if(mlp == null){
		alert("Make a model of MLP First!")
		return;
	}
	var input = [];
	var input1 = document.getElementById("input1").value;
	if(input1 == ""){
		alert("Enter the value of Input!")
		return;
	}
	else if((Number(input1) != 0)&&(Number(input1) != 1)){
		alert("Input must be 0 or 1!");
		return;
	}
	var input2 = document.getElementById("input2").value;
	if(input2 == ""){
		alert("Enter the value of Input!")
		return;
	}
	else if((Number(input2) != 0)&&(Number(input2) != 1)){
		alert("Input must be 0 or 1!");
		return;
	}
	input.push(Number(input1));
	input.push(Number(input2));
	mlp.PassNet(input);
	updateNode();
}

function full_train(){
	if(mlp == null){
		alert("Make a model of MLP First!")
		return;
	}
	var inputList = [];
	var counter = count;
	for(var i=count; i<=count+100000; i++){
		var tempList = [Math.round(Math.random()),Math.round(Math.random())];
		inputList.push(tempList);
		counter=i;
	}
	count = counter;
	error = mlp.Train(inputList);
	updateLink();
	initNode();
	updateInfo();
}

function train_once(){
	if(mlp == null){
		alert("Make a model of MLP First!")
		return;
	}
	var input = [];
	var input1 = document.getElementById("input1").value;
	if(input1 == ""){
		alert("Enter the value of Input!")
		return;
	}
	else if((Number(input1) != 0)&&(Number(input1) != 1)){
		alert("Input must be 0 or 1!");
		return;
	}
	var input2 = document.getElementById("input2").value;
	if(input2 == ""){
		alert("Enter the value of Input!")
		return;
	}
	else if((Number(input2) != 0)&&(Number(input2) != 1)){
		alert("Input must be 0 or 1!");
		return;
	}
	input.push(Number(input1));
	input.push(Number(input2));
	var inputList = [];
	inputList.push(input);
	count++;
	error = mlp.Train(inputList);
	updateNode();
	updateLink();
	updateInfo();
}
