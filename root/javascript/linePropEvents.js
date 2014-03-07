var lineInfo = {};


function initLineProp() {
	//lineWidthElement = document.getElementById('lineWidthDisplay');
	lineInfo.lineCapNoneElement = document.getElementById('lineCapNone');
	lineInfo.lineCapButtElement = document.getElementById('lineCapButt');
	lineInfo.lineCapRoundElement = document.getElementById('lineCapRound');
	lineInfo.lineCapsquareElement = document.getElementById('lineCapsquare');
	lineInfo.lineJoinNoneElement = document.getElementById('lineJoinNone');
	lineInfo.lineJoinBevelElement = document.getElementById('lineJoinBevel');
	lineInfo.lineJoinRoundElement = document.getElementById('lineJoinRound');
	lineInfo.lineJoinMiterElement = document.getElementById('lineJoinMiter');

	//lineInfo.lineWidthCanvas = lineInfo.lineWidthElement.getContext('2d');
	//lineInfo.lineCapNoneCanvas = lineInfo.lineCapNoneElement.getContext('2d');
	lineInfo.lineCapButtCanvas = lineInfo.lineCapButtElement.getContext('2d');
	lineInfo.lineCapRoundCanvas = lineInfo.lineCapRoundElement.getContext('2d');
	lineInfo.lineCapsquareCanvas = lineInfo.lineCapsquareElement.getContext('2d');
	//lineInfo.lineJoinNoneCanvas = lineInfo.lineJoinNoneElementgetContext('2d');
	lineInfo.lineJoinBevelCanvas = lineInfo.lineJoinBevelElement.getContext('2d');
	lineInfo.lineJoinRoundCanvas = lineInfo.lineJoinRoundElement.getContext('2d');
	lineInfo.lineJoinMiterCanvas = lineInfo.lineJoinMiterElement.getContext('2d');
	
	//lineinfo.lineWidthInput = document.getElementById('lineWidthInput');
	lineInfo.lineMiterLimit = document.getElementById('miterLimitInput');



	drawLineCap(lineInfo.lineCapButtCanvas,"butt",10);
	drawLineCap(lineInfo.lineCapRoundCanvas,"round",10);
	drawLineCap(lineInfo.lineCapsquareCanvas,"square",10);
	
	drawLineJoin(lineInfo.lineJoinBevelCanvas,"bevel",10);
	drawLineJoin(lineInfo.lineJoinRoundCanvas,"round",10);
	drawLineJoin(lineInfo.lineJoinMiterCanvas,"miter",10);
}

function drawLineThickness(width){
	lineInfo.lineWidthCanvas.beginPath();

	lineInfo.lineWidthCanvas.moveTo(0,25);
	lineInfo.lineWidthCanvas.LineTo(200,25);
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
	
	drawLineJoin(lineInfo.lineJoinMiterCanvas,"miter",10,limit);

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
	
	for( var i=codeLines.length-1; i>-1; i-- ){
		if( re.test(codeLines[i])){
			arr = re.exec(codeLines[i]);
			codeLines[i] = arr[1]+newVal+arr[3];
			return codeLines;
			
		}
	}

	var pos = getInitalPosToInsertAt( codeLines );
	codeLines.splice(pos,0,"\tcontext.lineCap = \""+newVal+"\";");

	return codeLines;
}

///////////////////////////////////////
//finds the line number of the last 
//join syle 
function updateLineJoin( codeLines, newVal){
	var re = /^(\s*context\.lineJoin\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	for( var i=codeLines.length-1; i>-1; i-- ){
		if( re.test(codeLines[i])){
			arr = re.exec(codeLines[i]);
			codeLines[i] = arr[1]+newVal+arr[3];
			return codeLines;
			
		}
	}

	var pos = getInitalPosToInsertAt( codeLines );
	codeLines.splice(pos,0,"\tcontext.lineJoin = \""+newVal+"\";");

	return codeLines;
}


///////////////////////////////////////
//finds the line number of the last 
//join syle 
function clearLineCap( codeLines){
	var re = /^(\s*context\.lineCap\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	for( var i=codeLines.length-1; i>-1; i-- ){
		if( re.test(codeLines[i])){
			codeLines.splice(i,1);
			break;
		}
	}
	return codeLines;
}

function clearLineJoin( codeLines){
	var re = /^(\s*context\.lineJoin\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	for( var i=codeLines.length-1; i>-1; i-- ){
		if( re.test(codeLines[i])){
			codeLines.splice(i,1);
			break;
		}
	}
	return codeLines;
}

///////////////////////////////////////
//finds the line number of the last 
//miter limit 
function updateMiterLimit( codeLines, newVal){
	var re = /^(\s*context\.miterLimit\s*=\s*\"?)([0-9]+)(\"?\s*;\s*)$/;
	
	for( var i=codeLines.length-1; i>-1; i-- ){
		if( re.test(codeLines[i])){
			arr = re.exec(codeLines[i]);
			codeLines[i] = arr[1]+newVal+arr[3];
			return codeLines;
			
		}
	}

	var pos = getInitalPosToInsertAt( codeLines );
	codeLines.splice(pos,0,"\tcontext.miterLimit = "+newVal+";");

	return codeLines;
}


///////////////////////////////////////
//finds the first beginPath command to
//add new commands after. Used if no 
//path commands are found.
//
//function getInitalPosToInsertAt( codeLines ){


