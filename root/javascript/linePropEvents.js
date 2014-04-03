var lineInfo = {};


function initLineProp() {
	lineInfo.lineWidthElement = document.getElementById('lineWidthDisplay');
	lineInfo.lineCapNoneElement = document.getElementById('lineCapNone');
	lineInfo.lineCapButtElement = document.getElementById('lineCapButt');
	lineInfo.lineCapRoundElement = document.getElementById('lineCapRound');
	lineInfo.lineCapsquareElement = document.getElementById('lineCapsquare');
	lineInfo.lineJoinNoneElement = document.getElementById('lineJoinNone');
	lineInfo.lineJoinBevelElement = document.getElementById('lineJoinBevel');
	lineInfo.lineJoinRoundElement = document.getElementById('lineJoinRound');
	lineInfo.lineJoinMiterElement = document.getElementById('lineJoinMiter');

	lineInfo.lineWidthCanvas = lineInfo.lineWidthElement.getContext('2d');
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
	
	var code = getCode();
	var codeLines = parseCode(code);
	var lineWidth = getLineWidth(codeLines);
	drawLineThickness(lineWidth);
	lineInfo.lineWidthInput.value=lineWidth;
	
}

function drawLineThickness(width){
	lineInfo.lineWidthCanvas.clearRect(0, 0, lineInfo.lineWidthElement.width, lineInfo.lineWidthElement.height);
	lineInfo.lineWidthCanvas.beginPath();

	lineInfo.lineWidthCanvas.moveTo(0,25);
	lineInfo.lineWidthCanvas.lineTo(200,25);
	lineInfo.lineWidthCanvas.lineWidth=width;
	lineInfo.lineWidthCanvas.strokeStyle="black";
	lineInfo.lineWidthCanvas.stroke();
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

function changeLineWidth(){
	var width = lineInfo.lineWidthInput.value;
	
	var code = getCode();
	var codeLines = parseCode(code);
	var newCodeLines=updateLineWidth(codeLines,width);

	var newCode = rejoinCode(newCodeLines);

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );
	drawLineThickness(width);
}

function incDecWidth(incDec){
	console.debug(typeof incDec);
	var code = getCode();
	var codeLines = parseCode(code);
	
	var width = parseInt( lineInfo.lineWidthInput.value );
	var newWidth = width + incDec;
	if(newWidth<1){
		newWidth=1;
	}
	lineInfo.lineWidthInput.value = newWidth;

	var newCodeLines=updateLineWidth(codeLines,newWidth);
	var newCode = rejoinCode(newCodeLines);

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );
	drawLineThickness(width);
}

function getLineWidth(codeLines){
	var re = /^(\s*context\.lineWidth\s*=\s*\"?)([a-zA-Z0-9]+)(\"?\s*;\s*)$/;

	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		return arr[2];
	}
}

function updateLineWidth(codeLines,width){
	var re = /^(\s*context\.lineWidth\s*=\s*\"?)([a-zA-Z0-9]+)(\"?\s*;\s*)$/;
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		codeLines[pos] = arr[1]+width+arr[3];
		return codeLines;
	}
		
	var pos = getInitalPosToInsertAt( codeLines );
	codeLines.splice(pos,0,"\tcontext.lineWidth = "+width+";");

	return codeLines;
}



function generalLineStyleCode(type,value){
	var code = getCode();
	var codeLines = parseCode(code);
	
	var newCodeLines=codeLines;
	
	if( type == "cap"){
		newCodeLines = updateLineCap(codeLines,value);
	}
	else if( type == "join"){
		newCodeLines = updateLineJoin(codeLines,value);
	}
	var newCode = rejoinCode(newCodeLines);

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );

}

function clearLineStyleLine(type){
	var code = getCode();
	var codeLines = parseCode(code);
	
	var newCodeLines=codeLines;
	
	if(type == "cap"){
		newCodeLines = clearLineCap( codeLines);
	}
	else if(type="join"){
		newCodeLines = clearLineJoin( codeLines);
	}
	var newCode = rejoinCode(newCodeLines);

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );
	
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
	drawLineThickness(width);
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
function codeSearch( codeLines, re){
	var basePos = getInitalPosToInsertAt( codeLines );

	for( var i=codeLines.length-1; i>=basePos; i-- ){
		if( re.test(codeLines[i])){
			return i;
		}
	}
	return -basePos;
}



