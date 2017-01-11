function frame(){
	if(window.goSamples) goSamples();
	this.$ = go.GraphObject.make;
    this.myDiagram = $(go.Diagram,"Diag",
						{
    					initialContentAlignment : go.Spot.Center,
    					"undoManager.isEnabled" : true
					});
    
    function nodeStyle() {
        return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)];
      }
    
    this.myDiagram.nodeTemplate =
    	$(go.Node,"Spot", nodeStyle(),
    			$(go.Shape,
    					"Circle",
    					{width : 40, height : 40, strokeWidth : 2,stroke : "#000000", fill : "#FFFFFF"}
    			),
    			$(go.TextBlock,
    					{font : "12pt sans-serif", margin :5, isMultiline : true, textAlign: "center"},
    					new go.Binding("text","val")
    			)
    	);
    
    this.myDiagram.groupTemplate =
    	$(go.Group, "Vertical",{layout : $(go.ForceDirectedLayout)},
    		$(go.TextBlock,
    			{alignment : go.Spot.Top, font : "Bold 10pt Sans-Serif"},
    			new go.Binding("text","key")
    		),
    		$(go.Panel, "Auto",
    				$(go.Shape,"RoundedRectangle",
    						{parameter1 : 14, fill : "rgba(128,128,128,0.33)"}
    				),
    				$(go.Placeholder,
    					{padding : 10}	
    				)
    		)
		);
	this.myDiagram.linkTemplate =
		$(go.Link,
			$(go.Shape),
			$(go.Shape, {toArrow : "Standard"}),
			$(go.Panel, "Auto",{segmentOffset : new go.Point((Math.random()-0.5)*20,(Math.random()-0.5)*20)},
			        $(go.Shape, "Rectangle", { fill: "white", stroke: "gray"}),
			        $(go.TextBlock, { margin: 5},
			          new go.Binding("text", "text"))
			)
		);
}

function initMLP(){
	myDiagram.model.nodeDataArray = [];
	myDiagram.model.linkDataArray = [];
	
	var xloc = 0;
	var yloc = 0;
	var keycount = 0;
	var groupkey = [];
	
	myDiagram.model.addNodeData({key : "Input Layer", isGroup : true});
	for(var i=1; i<=mlp.nHidden; i++){
		myDiagram.model.addNodeData({key : i+"th Hidden Layer", isGroup : true});
	}
	myDiagram.model.addNodeData({key : "Output Layer", isGroup : true});

	var group = [];
	for(var i=0; i<mlp.inputLayer.nNode;i++){
		if(i==0)
			myDiagram.model.addNodeData({key : keycount, group : "Input Layer", loc : xloc + " " + yloc, val : "bias"});
		else
			myDiagram.model.addNodeData({key : keycount, group : "Input Layer", loc : xloc + " " + yloc, val : mlp.inputLayer.node[i].toFixed(0)});
		yloc += 60;
		group.push(keycount);
		keycount++;
	}
	groupkey.push(group);
	xloc += 250;
	yloc = 0;
	keycount = (Math.floor(keycount/10)+1)*10;
	for(var i=0; i<mlp.hiddenLayers.length;i++){
		var group = [];
		for(var j=0; j<mlp.hiddenLayers[i].nNode;j++){
			if(j==0)
				myDiagram.model.addNodeData({key : keycount, group : (i+1)+"th Hidden Layer", loc : xloc + " " + yloc, val : "bias"});
			else
				myDiagram.model.addNodeData({key : keycount, group : (i+1)+"th Hidden Layer", loc : xloc + " " + yloc, val : mlp.hiddenLayers[i].node[j].toFixed(2)});
			yloc += 60;
			group.push(keycount);
			keycount++;
		}
		groupkey.push(group);
		xloc += 250;
		yloc = 0;
		keycount = (Math.floor(keycount/10)+1)*10;
	}
	var group = [];
	for(var i=0; i<mlp.outputLayer.nNode;i++){
		if(i==0)
			myDiagram.model.addNodeData({key : keycount, val : "bias", group : "Output Layer", loc : xloc + " " + yloc});
		else
			myDiagram.model.addNodeData({key : keycount, val : Math.round(mlp.outputLayer.node[i])+"\n("+mlp.outputLayer.node[i].toFixed(2)+")", group : "Output Layer", loc : xloc + " " + yloc});
		yloc += 60;
		group.push(keycount);
		keycount++;
	}
	groupkey.push(group);
	for(var i=0; i<groupkey[0].length; i++){
		for(var j=0; j<groupkey[1].length; j++){
			if(j!=0){
				myDiagram.model.addLinkData({from : groupkey[0][i], to : groupkey[1][j], text : mlp.weightList[0][j][i].toFixed(4)});
			}
		}
	}
	for(var k=1; k<groupkey.length-1; k++){
		for(var i=0; i<groupkey[k].length; i++){
			for(var j=0; j<groupkey[k+1].length; j++){
				if(j!=0){
					myDiagram.model.addLinkData({from : groupkey[k][i], to : groupkey[k+1][j], text : mlp.weightList[k][j][i].toFixed(4)});
				}
			}
		}
	}
	for(var i=0; i<groupkey[mlp.nHidden].length; i++){
		for(var j=0; j<groupkey[mlp.nHidden+1].length; j++){
			if(j!=0){
				myDiagram.model.addLinkData({from : groupkey[mlp.nHidden][i], to : groupkey[mlp.nHidden+1][j], text : mlp.weightList[mlp.nHidden][j][i].toFixed(4)});
			}
		}
	}
}

function updateNode(){
	for(var i=0; i<mlp.inputLayer.nNode;i++){
		if(myDiagram.model.nodeDataArray[i+mlp.nHidden+2].val != "bias")
			myDiagram.model.setDataProperty(myDiagram.model.nodeDataArray[i+mlp.nHidden+2],"val",mlp.inputLayer.node[i].toFixed(0));
	}
	
	for(var i=0; i<mlp.hiddenLayers.length;i++){
		for(var j=0; j<mlp.hiddenLayers[i].nNode;j++){
			if(myDiagram.model.nodeDataArray[j+mlp.nHidden+2+mlp.inputLayer.nNode+i*mlp.hiddenLayers[i].nNode].val != "bias")
				myDiagram.model.setDataProperty(myDiagram.model.nodeDataArray[j+mlp.nHidden+2+mlp.inputLayer.nNode+i*mlp.hiddenLayers[i].nNode],"val",mlp.hiddenLayers[i].node[j].toFixed(2));
		}
	}
	for(var i=0; i<mlp.outputLayer.nNode;i++){
		if(myDiagram.model.nodeDataArray[i+myDiagram.model.nodeDataArray.length-mlp.outputLayer.nNode].val != "bias")
			myDiagram.model.setDataProperty(myDiagram.model.nodeDataArray[i+myDiagram.model.nodeDataArray.length-mlp.outputLayer.nNode],"val",Math.round(mlp.outputLayer.node[i])+"\n("+mlp.outputLayer.node[i].toFixed(2)+")");
	}
}

function updateLink(){
	for(var index = 0; index < myDiagram.model.linkDataArray.length; index++){
		var temp = myDiagram.model.linkDataArray[index];
		var k = Math.floor(temp.from/10);
		var i = temp.from%10;
		var j = temp.to%10;
		myDiagram.model.setDataProperty(myDiagram.model.linkDataArray[index],"text",mlp.weightList[k][j][i].toFixed(4))
	}
}

function initNode(){
	for(var i = 0; i < myDiagram.model.nodeDataArray.length; i++){
		if('isGroup' in myDiagram.model.nodeDataArray[i]) continue;
		else if(myDiagram.model.nodeDataArray[i].val == "bias") continue;
		else if(myDiagram.model.nodeDataArray[i].group.toString().indexOf("Input") != -1)
			myDiagram.model.setDataProperty(myDiagram.model.nodeDataArray[i],"val","0");
		else if(myDiagram.model.nodeDataArray[i].group.toString().indexOf("Hidden") != -1)
			myDiagram.model.setDataProperty(myDiagram.model.nodeDataArray[i],"val","0.00");
		else if(myDiagram.model.nodeDataArray[i].group.toString().indexOf("Output") != -1)
			myDiagram.model.setDataProperty(myDiagram.model.nodeDataArray[i],"val","0\n(0.00)");
	}
}

function updateInfo(){
	try{
		myDiagram.remove(infoPanel);
	}catch(err){
	}
	infoPanel = $(go.Part, "Auto",
			{position : new go.Point(1600,400), selectable :false},
			$(go.Shape, "RoundedRectangle", { fill: "rgba(128,128,128,0.33)" }),
		    $(go.TextBlock, "Number of Training Data: " + count + "\nErrorRate: " + error + "%", { margin: 5})
			);
	myDiagram.add(infoPanel);
}