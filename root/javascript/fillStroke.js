var fillStrokeInfo={};

function initFillStrokeProp() {

	fillStrokeInfo.strokeInput = document.getElementById('addStroke');
	fillStrokeInfo.fillInput = document.getElementById('addFill');

	var code = getCode();
	var codeTree = acorn.parse( code);
	var position = getPosFillStroke( codeTree );
	
	if(position.fillStart>=0){
		fillStrokeInfo.fillInput.checked=true;
	}
	else {
		fillStrokeInfo.fillInput.checked=false;
	}
	if(position.strokeStart){
		fillStrokeInfo.strokeInput.checked=true;
	}
	else {
		fillStrokeInfo.strokeInput.checked=false;
	}
	
}
	
function addBeginPath(){
	
}

function onClickFill(){
	var code = getCode();
	var codeTree = acorn.parse( code);

	var newCode = code;
	var position = getPosFillStroke( codeTree );
	
	if(fillStrokeInfo.fillInput.checked){
		if(position.fillStart<0){
			//add
			newCode = code.substring(0,position.lastPathCmd) + "\tcontext.fill();\n" + code.substring(position.lastPathCmd);
		}
	}
	else {
		if(position.fillStart>=0){
			//delete
			// the +1 is to try to handle the folowing semi-collen
			newCode = code.substring(0,position.fillStart) + code.substring(position.fillEnd+2);
		}
	}
	
	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);

}

function onClickStroke(){
	var code = getCode();
	var codeTree = acorn.parse( code);

	var newCode = code;
	var position = getPosFillStroke( codeTree );

	if(fillStrokeInfo.strokeInput.checked){
		if(position.strokeStart<0){
			//add
			newCode = code.substring(0,position.lastPathCmd) + "\tcontext.stroke();\n" + code.substring(position.lastPathCmd);
		}
	}
	else {
		if(position.strokeStart>=0){
			//delete
			newCode = code.substring(0,position.strokeStart) + code.substring(position.strokeEnd+2);
		}
	}
	
	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);

}



///////////////////////////////////////
//finds the line number of the last 
//path command 
function getPosFillStroke( codeTree ){
	
	var position = { 
			lastPathCmd:-1,
			strokeStart:-1,
			strokeEnd:-1,
			fillStart:-1,
			fillEnd:-1
			};

	acorn.walk.simple( codeTree, {
		Expression: getPosFillStrokeCallback,
		AssignmentExpression: getPosFillStrokeAssCallback
		},undefined,position);

	return position;
}

function getPosFillStrokeCallback(node, position){
		
	//find last path command and use that to insert after,
	// unless it's a closePath command, in which case it is inserted before it.
	
	//XXX need to fix this so it handles semicolons and whitespace properly
	if( node.type == "CallExpression"){
		if( node.callee.object.name == "context" ){
			position.lastPathCmd = node.end+2;
		}
		if( node.callee.property.name == "stroke"){
			position.strokeStart = node.start;
			position.strokeEnd = node.end;
		}
		else if( node.callee.property.name == "fill"){
			position.fillStart = node.start;
			position.fillEnd = node.end;
		}
	}
}

function getPosFillStrokeAssCallback(node, position){
	
	if(node.type == "AssignmentExpression" && node.operator== "=" && node.left.type == "MemberExpression" ){
		if( node.left.object.name == "context"){
			position.lastPathCmd = node.end+2;
		}
	}
}