var lineInfo = {};

/////////////////////////
// button stuff

function initLineProp() {
	lineInfo.lineCapNoneElement = document.getElementById('lineCapNone');
	lineInfo.lineCapButtElement = document.getElementById('lineCapButt');
	lineInfo.lineCapRoundElement = document.getElementById('lineCapRound');
	lineInfo.lineCapsquareElement = document.getElementById('lineCapsquare');
	lineInfo.lineJoinNoneElement = document.getElementById('lineJoinNone');
	lineInfo.lineJoinBevelElement = document.getElementById('lineJoinBevel');
	lineInfo.lineJoinRoundElement = document.getElementById('lineJoinRound');
	lineInfo.lineJoinMiterElement = document.getElementById('lineJoinMiter');

	//lineInfo.lineCapNoneCanvas = lineInfo.lineCapNoneElement.getContext('2d');
	lineInfo.lineCapButtCanvas = lineInfo.lineCapButtElement.getContext('2d');
	lineInfo.lineCapRoundCanvas = lineInfo.lineCapRoundElement.getContext('2d');
	lineInfo.lineCapsquareCanvas = lineInfo.lineCapsquareElement.getContext('2d');
	//lineInfo.lineJoinNoneCanvas = lineInfo.lineJoinNoneElementgetContext('2d');
	lineInfo.lineJoinBevelCanvas = lineInfo.lineJoinBevelElement.getContext('2d');
	lineInfo.lineJoinRoundCanvas = lineInfo.lineJoinRoundElement.getContext('2d');
	lineInfo.lineJoinMiterCanvas = lineInfo.lineJoinMiterElement.getContext('2d');
	
	lineInfo.lineWidthInput = document.getElementById('lineWidthInput');
	lineInfo.lineMiterLimit = document.getElementById('miterLimitInput');

	var width = 15; //XXX
	drawLineCap(lineInfo.lineCapButtCanvas,"butt",width);
	drawLineCap(lineInfo.lineCapRoundCanvas,"round",width);
	drawLineCap(lineInfo.lineCapsquareCanvas,"square",width);
	
	drawLineJoin(lineInfo.lineJoinBevelCanvas,"bevel",width);
	drawLineJoin(lineInfo.lineJoinRoundCanvas,"round",width);
	drawLineJoin(lineInfo.lineJoinMiterCanvas,"miter",width);
	
	var lineWidth = getLineWidth();
	lineInfo.lineWidthInput.value=lineWidth;
	
	var miterLimit = getMiterLimit();
	lineInfo.lineMiterLimit.value=miterLimit;
	
}

function drawLineCap(canvas,type,width){
	canvas.beginPath();

	canvas.moveTo(0,25);
	canvas.lineTo(60,25);
	canvas.lineCap=type;
	canvas.lineWidth=width;
	canvas.strokeStyle="black";
	canvas.stroke();

	canvas.beginPath();

	canvas.moveTo(0,25);
	canvas.lineTo(60,25);
	canvas.lineCap=type;
	canvas.lineWidth=1;
	canvas.strokeStyle="red";
	canvas.stroke();
}

function drawLineJoin(canvas,type,width,limit){
	canvas.beginPath();

	canvas.moveTo(0,0);
	canvas.lineTo(60,25);
	canvas.lineTo(0,50);
	canvas.lineJoin=type;
	canvas.lineWidth=width;
	canvas.strokeStyle="black";
	canvas.stroke();

	canvas.beginPath();

	canvas.moveTo(0,0);
	canvas.lineTo(60,25);
	canvas.lineTo(0,50);
	canvas.lineJoin=type;
	canvas.lineWidth=1;
	canvas.strokeStyle="red";
	canvas.stroke();
}



///////////////////////
// line thickness
function changeLineWidth(){
	var width = lineInfo.lineWidthInput.value;

	generalLineStyleCode("lineWidth",width,false);
}

function incDecWidth(incDec){
	var width = parseInt( lineInfo.lineWidthInput.value );
	var newWidth = width + incDec;
	if(newWidth<1){
		newWidth=1;
	}
	lineInfo.lineWidthInput.value = newWidth;

	generalLineStyleCode("lineWidth",newWidth,false);
}

function getLineWidth(){

	var code = getCode();
	var codeTree = acorn.parse( code);

	var position = codeSearch( code, codeTree, "lineWidth");

	var val = 5;

	if( position.start >=0 ){
		val = code.substring(position.start,position.end);
	}
	return val;
}



////////////////
//miter limit
function changeMiterLimit(){
	var width = lineInfo.lineMiterLimit.value;

	generalLineStyleCode("miterLimit",width,false);
}

function incDecMiter(incDec){

	var width = parseInt( lineInfo.lineMiterLimit.value );
	var newWidth = width + incDec;
	if(newWidth<1){
		newWidth=1;
	}
	lineInfo.lineMiterLimit.value = newWidth;

	generalLineStyleCode("miterLimit",newWidth,false);
}

function getMiterLimit(){

	var code = getCode();
	var codeTree = acorn.parse( code);

	var position = codeSearch( code, codeTree,"miterLimit");

	var val = 5;

	if( position.start >=0 ){
		val = code.substring(psition.start,position.end);
	}
	return val;
}


///////////////////////////
//line style
function generalLineStyleCode(type,value,quote){ // type = lineCap, lineJoin, lilneWidth, miterLimit

	var newVal = value.toString();
	if(quote){
		newVal = "\"" + newVal + "\"";
	}
	
	var code = getCode();
	var newCode = code;

	var codeTree = acorn.parse( code);

	var position = codeSearch( code, codeTree, type);

	var newCode = code;
	if( position.start >=0 ){
		newCode = code.substring(0,position.start) + newVal + code.substring(position.end);
	}
	else if(position.lastPathCmd >= 0){
		newCode = code.substring(0,position.lastPathCmd) + "\tcontext." + type + " = " + newVal + ";\n" + code.substring(position.lastPathCmd);
	}

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);

}

function clearLineStyleLine(type){

	var code = getCode();
	var newCode = code;

	var codeTree = acorn.parse( code);

	var position = codeSearch( code, codeTree, type);

	var newCode = code;
	if( position.lineStart >=0 ){
		// the +1 is to try to handle the folowing semi-collen
		newCode = code.substring(0,position.lineStart) + code.substring(position.lineEnd+1);
	}

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);
}

function changeMiterLimit(){
	var limit = lineInfo.lineMiterLimit.value;
		
	var code = getCode();
	var codeLines = parseCode(code);
	
	var newCodeLines=codeLines;
	
	newCodeLines = updateMiterLimit(codeLines,limit);
	var newCode = rejoinCode(newCodeLines);

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );
	//drawLineJoin(lineInfo.lineJoinMiterCanvas,"miter",10,limit);

}

function incDecMiter(incDec){
	var code = getCode();
	var codeLines = parseCode(code);
	
	var limit = parseInt( lineInfo.lineMiterLimit.value );
	var newlimit = limit + incDec;
	if(newlimit<1){
		newlimit=1;
	}
	lineInfo.lineMiterLimit.value = newlimit;

	var newCodeLines=updateMiterLimit(codeLines,newlimit);
	var newCode = rejoinCode(newCodeLines);

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );
	//drawLineThickness(width);
}

///////////////////////////////////////
//finds the line number of the last 
//line width 
/*function updateLineWidth( codeLines, newVal  ){
	for( var i=codeLines.length-1; i>-1; i-- ){
		var pos = codeLines[i].search( /(context\.lineWidth\s+=\s+")([a-zA-Z]+)("\s*;/ );

		if( pos > -1 ){
			codeLines[i].replace(/(\s*=\s*")([a-zA-Z]+)("\s*;)/, $1+newval+$3 );
			return codeLines;
		}		
	}
	return codeLines;
}*/

///////////////////////////////////////
//finds the line number of the last 
//line cap style 
function updateLineCap( codeLines, newVal ){
	var re = /^(\s*context\.lineCap\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		codeLines[pos] = arr[1]+newVal+arr[3];
		return codeLines;
	}
		
	codeLines.splice(-pos,0,"\tcontext.lineCap = \""+newVal+"\";");

	return codeLines;
}

///////////////////////////////////////
//finds the line number of the last 
//join syle 
function updateLineJoin( codeLines, newVal){
	var re = /^(\s*context\.lineJoin\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		codeLines[pos] = arr[1]+newVal+arr[3];
		return codeLines;
	}

	codeLines.splice(-pos,0,"\tcontext.lineJoin = \""+newVal+"\";");

	return codeLines;
}


///////////////////////////////////////
//finds the line number of the last 
//join syle 
function clearLineCap( codeLines){
	var re = /^(\s*context\.lineCap\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		codeLines.splice(pos,1);
	}
	return codeLines;
}

function clearLineJoin( codeLines){
	var re = /^(\s*context\.lineJoin\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		codeLines.splice(pos,1);
	}
	return codeLines;
}

///////////////////////////////////////
//finds the line number of the last 
//miter limit 
function updateMiterLimit( codeLines, newVal){
	var re = /^(\s*context\.miterLimit\s*=\s*\"?)([0-9]+)(\"?\s*;\s*)$/;
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		codeLines[pos] = arr[1]+newVal+arr[3];
		return codeLines;
	}

	codeLines.splice(-pos,0,"\tcontext.miterLimit = "+newVal+";");

	return codeLines;
}



///////////////////////////////////////
//
function codeSearch( code, codeTree, identifier){
	
	var position = { 
			lastPathCmd:-1, // the end of the last path command
			identifier: identifier, // the identifier we're looking for
			start:-1, // the start and end of the value to be replaced
			end:-1,
			lineStart:-1,  // the start and end of the line for this identifier
			lineEnd:-1     // used when deleating a line
			};

	acorn.walk.simple( codeTree, {
		AssignmentExpression: codeSearchCallback
		},undefined,position);

	if(position.start <0){
		//this is from addPathCommand.js
		position.lastPathCmd=getPosToInsertAt(codeTree);
	}
	return position;
}

// goes through the tree finding either the last identifier
// or the position of the last path comand that it should be inserted after.
function codeSearchCallback(node, position){
	
	var identifier = position.identifier;
	
	if(node.type == "AssignmentExpression" && node.operator== "=" && node.left.type == "MemberExpression" ){
		if( node.left.object.name == "context" && node.left.property.name == identifier){
			if(node.right.type == "Literal"){
				position.start = node.right.start;
				position.end = node.right.end;
				
				position.lineStart = node.start;
				position.lineEnd = node.end;
			}
			else if( node.right.type == "UnaryExpression" && node.right.argument.type == "Literal"){
				position.start = node.right.start;
				position.end = node.right.end;
				
				position.lineStart = node.start;
				position.lineEnd = node.end;
			}
		}
	}
}

function codeExpressionCallback(node, position){
	//find last path command and use that to insert after,
	// unless it's a closePath command, in which case it is inserted before it.
	
	//XXX need to fix this so it handles semicolons and whitespace properly
	if( node.type == "CallExpression"){
		if( node.callee.object.name == "context" && node.callee.property.name != "closePath"){
			position.lastPathCmd = node.end+1;
		}
		
	}
}


