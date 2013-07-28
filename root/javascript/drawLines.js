/********************************************
 * functions to add path code lines
 *******************************************/

// mouse callbacks

function onClickMoveTo(){
	global.command = "moveTo";
}
function onClickLineTo(){
	global.command="lineTo";
}

function onClickBezierCurveTo(){
	global.command="bezierCurveTo";
}

function onClickQuadraticCurveTo(){
	global.command="quadraticCurveTo";
}

function onClickClosePath(){
	global.command="closePath";
}

/***********************************
 * geometric stuff
 */

// given two points x1,y1 and x2,y2
// it finds the point to make a line 
// at a right angle to the line

function getRightAngle(x1,y1,x2,y2) {
	//cheap right angle vector
	var scale=.1;
	return [ -scale*(y2-y1), scale*(x2-x1)];
}

/***********************************
 * construct code lines
 * all take two points. The first pair 
 * are where the last end point (which are 
 * ignored in some of these). The second 
 * pair are the new end point.
 */

// moveTo code line
function codeStringMoveTo(x1,y1,x2,y2){
	return "\tcontext.moveTo( " + x2 + ", " + y2 + " );";
}

// lineTo code line
function codeStringLineTo(x1,y1,x2,y2){
	return "\tcontext.lineTo( " + x2 + ", " + y2 + " );";
}


// bezierCurveTo code line
// adds control points at a right angle
// from a line between the two end points
function codeStringBezierCurveTo(x1,y1,x2,y2){
	var rightAngle = getRightAngle(x1,y1,x2,y2);
	
	var args = [
	            x1+rightAngle[0],
	            y1+rightAngle[1],
	            x2+rightAngle[0],
	            y2+rightAngle[1],
	            x2,
	            y2
	            ];

	return "\tcontext.bezierCurveTo( " + args.join(", ") +" );";
}

// quadraticCurveTo code line
// adds a control point at a right angle
// from a line between the two end points
function codeStringQuadraticCurveTo(x1,y1,x2,y2){
	var rightAngle = getRightAngle(x1,y1,x2,y2);
	
	var args = [
	            ((x2+x1)/2) +rightAngle[0],
	            ((y2+y1)/2) +rightAngle[1],
	            x2,
	            y2
	            ];

	return "\tcontext.quadraticCurveTo( " + args.join(", ") +" );";
}

// closePath code line
function codeStringClosePath(x1,y1,x2,y2){
	return "\tcontext.closePath();";
}

/***********************************
 * inserts code line before the 
 * last fill or stroke
 */

function makeCodeLine(x1,y1,x2,y2){
	
	var codePart = "";
	if(global.command == "moveTo"){
		codePart = codeStringMoveTo(x1,y1,x2,y2);
	}
	else if(global.command == "lineTo"){
		codePart = codeStringLineTo(x1,y1,x2,y2);
	}
	else if(global.command == "bezierCurveTo"){
		codePart = codeStringBezierCurveTo(x1,y1,x2,y2);
	}
	else if(global.command == "quadraticCurveTo"){
		codePart = codeStringQuadraticCurveTo(x1,y1,x2,y2);
	}
	else if(global.command == "closePath"){
		codePart = codeStringClosePath(x1,y1,x2,y2);
	}

	return codePart;
}

function getArgsToBeChanged(){

	var argIndex;
	if(global.command == "moveTo"){
		return [0,1];
	}
	else if(global.command == "lineTo"){
		return [0,1];
	}
	else if(global.command == "bezierCurveTo"){
		return [4,5];
	}
	else if(global.command == "quadraticCurveTo"){
		return [2,3];
	}
	else if(global.command == "closePath"){
		return [];
	}

	return [];
}

function getPosToInsertAt( codeLines ){
	for( var i=codeLines.length-1; i>-1; i-- ){
		var pos = codeLines[i].search( /(?:context\.(?:beginPath|moveTo|lineTo|bezierCurveTo|quadraticCurveTo|arc|arcTo|closePath)\b)|(?:\}\b)/);
		if( pos > -1 ){
			return i+1;
		}
	}

	return -1;
}

function getInitalPosToInsertAt( codeLines ){
	for( var i=0,l=codeLines.length; i<l; i++ ){
		var pos = codeLines[i].search( /context\.beginPath\b/);
		if( pos > -1 ){
			return i+1;
		}
	}

	return -1;
}

/***********************************
 * inserts code line before the 
 * last fill or stroke
 */

function addComandToCode(codeLines,x1,y1,x2,y2){
	var newCodeLine = makeCodeLine(x1,y1,x2,y2);
	
	if(newCodeLine == ""){
		return codeLines;
	}
	
 	var insertedAt = getPosToInsertAt( codeLines );
 	
	if(insertedAt <0){
		insertedAt = getInitalPosToInsertAt( codeLines );
	}

 	global.lineBeingChangedIndex = insertedAt;
	global.argsIndex = getArgsToBeChanged();

	codeLines.splice(insertedAt,0,newCodeLine);
	return codeLines;
}


