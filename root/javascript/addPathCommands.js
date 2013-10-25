/********************************************
 * functions to add path code lines
 *******************************************/

// mouse callbacks

function onClickMoveTo(){
	state.command = "moveTo";
}
function onClickLineTo(){
	state.command="lineTo";
}

function onClickBezierCurveTo(){
	state.command="bezierCurveTo";
}

function onClickQuadraticCurveTo(){
	state.command="quadraticCurveTo";
}

function onClickClosePath(){
	state.command="closePath";
}

function onClickArcTo(){
	state.command="arcTo";
}
function onClickArc(){
	state.command="arc";
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
	var rAngle = rightAngle(x1,y1,x2,y2);
	
	var args = [
	            x1+rAngle[0],
	            y1+rAngle[1],
	            x2+rAngle[0],
	            y2+rAngle[1],
	            x2,
	            y2
	            ];

	return "\tcontext.bezierCurveTo( " + args.join(", ") +" );";
}

// quadraticCurveTo code line
// adds a control point at a right angle
// from a line between the two end points
function codeStringQuadraticCurveTo(x1,y1,x2,y2){
	
	var rAngle = rightAngleCorner(x1,y1,x2,y2);
	
	var args = [
	            rAngle[0],
	            rAngle[1],
	            x2,
	            y2
	            ];

	return "\tcontext.quadraticCurveTo( " + args.join(", ") +" );";
}

function codeStringArcTo(x1,y1,x2,y2){
	var c=rightAngleCorner(x1,y1,x2,y2);
	
	var args = [
	            c[0],
	            c[1],
	            x2,
	            y2,
	            25
	            ];

	return "\tcontext.arcTo( " + args.join(", ") +" );";
}

function codeStringArc(x1,y1,x2,y2){
	return "\tcontext.arc( " + x2 + ", " + y2 + ", 50, 0, 2.0, false );"; // using 2.0 just to avoid 50 decimal places
}

// closePath code line
function codeStringClosePath(x1,y1,x2,y2){
	return "\tcontext.closePath();";
}

/***********************************
 * inserts code line before the 
 * last fill or stroke
 */

function makeCodeLine(command,x1,y1,x2,y2){
	
	var codePart = "";
	if(command == "moveTo"){
		codePart = codeStringMoveTo(x1,y1,x2,y2);
	}
	else if(command == "lineTo"){
		codePart = codeStringLineTo(x1,y1,x2,y2);
	}
	else if(command == "bezierCurveTo"){
		codePart = codeStringBezierCurveTo(x1,y1,x2,y2);
	}
	else if(command == "quadraticCurveTo"){
		codePart = codeStringQuadraticCurveTo(x1,y1,x2,y2);
	}
	else if(command == "arcTo"){
		codePart = codeStringArcTo(x1,y1,x2,y2);
	}
	else if(command == "arc"){
		codePart = codeStringArc(x1,y1,x2,y2);
	}
	else if(command == "closePath"){
		codePart = codeStringClosePath(x1,y1,x2,y2);
	}

	return codePart;
}

function getArgsToBeChanged(command){

	if(command == "moveTo"){
		return [0,1];
	}
	else if(command == "lineTo"){
		return [0,1];
	}
	else if(command == "bezierCurveTo"){
		return [4,5];
	}
	else if(command == "quadraticCurveTo"){
		return [2,3];
	}
	else if(command == "arcTo"){
		return [2,3];
	}
	else if(command == "arc"){
		return [0,1];
	}
	else if(command == "closePath"){
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

/*****************************
 * inserts code line after the last
 * path command
 * 
 * @param codeLines
 * @param x1 - the prev end point
 * @param y1
 * @param x2 - the new end point
 * @param y2
 * @returns
 */
function addComandToCode(codeLines,x1,y1,x2,y2,info){

	if( typeof(info.command) == 'undefined' || info.command == ""){
		return codeLines;
	}

	var myNewCodeLine = makeCodeLine(info.command,x1,y1,x2,y2);
	
	
 	var insertedAt = getPosToInsertAt( codeLines );
 	
	if(insertedAt <0){
		insertedAt = getInitalPosToInsertAt( codeLines );
	}

	var argsIndex = getArgsToBeChanged(info.command);
	var moveInfo = {
			codeLineBeingReferenced: insertedAt,
			destArgs: argsIndex,
			srcArgs: argsIndex,
			type: "line",
			xOld: x2,
			yOld: y2,
			
			newCodeLine: myNewCodeLine
	};
	return moveInfo;
}



