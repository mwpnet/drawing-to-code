/** Copyright 2013 Martyn Peck (mwp@mwpnet.com) **/

/**    This file is part of drawing-to-code.									**/
/**																				**/
/**    drawing-to-code is free software: you can redistribute it and/or modify	**/
/**    it under the terms of the GNU General Public License as published by		**/
/**    the Free Software Foundation, either version 3 of the License, or		**/
/**    (at your option) any later version.										**/
/**																				**/
/**    drawing-to-code is distributed in the hope that it will be useful,		**/
/**    but WITHOUT ANY WARRANTY; without even the implied warranty of			**/
/**    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the			**/
/**    GNU General Public License for more details.								**/
/**																				**/
/**    You should have received a copy of the GNU General Public License		**/
/**    along with drawing-to-code.  If not, see <http://www.gnu.org/licenses/>.	**/



/********************************************
 * functions to add path code lines
 *******************************************/

///////////////////////////////////////
// mouse callbacks for when a button is
// clicked

function onClickMoveTo(){
	state.command = "moveTo";
	selectButton("moveToButton");
}

function onClickLineTo(){
	state.command="lineTo";
	selectButton("lineToButton");
}

function onClickBezierCurveTo(){
	state.command="bezierCurveTo";
	selectButton("bezierCurveToButton");
}

function onClickQuadraticCurveTo(){
	state.command="quadraticCurveTo";
	selectButton("quadraticCurveToButton");
}

function onClickArcTo(){
	state.command="arcTo";
	selectButton("arcToButton");
}
function onClickArc(){
	state.command="arc";
	selectButton("arcButton");
}

function onClickClosePath(){
	state.command="closePath";
	selectButton("closePathButton");
}

///////////////////////////////////////
// changes the look of the buttons so 
// one looks pressed and the rest look 
// unpressed
function selectButton(button){
	if(button == "moveToButton"){
		$("#moveToButton").css("border-style","inset");
	}
	else {
		$("#moveToButton").css("border-style","outset");
	}
	
	if(button == "lineToButton"){
		$("#lineToButton").css("border-style","inset");
	}
	else {
		$("#lineToButton").css("border-style","outset");
	}
	
	if(button == "bezierCurveToButton"){
		$("#bezierCurveToButton").css("border-style","inset");
	}
	else {
		$("#bezierCurveToButton").css("border-style","outset");
	}
	
	if(button == "quadraticCurveToButton"){
		$("#quadraticCurveToButton").css("border-style","inset");
	}
	else {
		$("#quadraticCurveToButton").css("border-style","outset");
	}
	
	if(button == "arcToButton"){
		$("#arcToButton").css("border-style","inset");
	}
	else {
		$("#arcToButton").css("border-style","outset");
	}
	
	if(button == "arcButton"){
		$("#arcButton").css("border-style","inset");
	}
	else {
		$("#arcButton").css("border-style","outset");
	}
	
	if(button == "closePathButton"){
		$("#closePathButton").css("border-style","inset");
	}
	else {
		$("#closePathButton").css("border-style","outset");
	}
}


/***********************************
 * construct code lines
 * all take two points. The first pair 
 * are where the last end point (which are 
 * ignored in some of these). The second 
 * pair are the new end point.
 */


///////////////////////////////////////
// moveTo code line
function codeStringMoveTo(x1,y1,x2,y2){
	return "\tcontext.moveTo( " + x2 + ", " + y2 + " );";
}

///////////////////////////////////////
// lineTo code line
function codeStringLineTo(x1,y1,x2,y2){
	return "\tcontext.lineTo( " + x2 + ", " + y2 + " );";
}


///////////////////////////////////////
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

///////////////////////////////////////
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

///////////////////////////////////////
// arcTo code line
// The new end point is used as the 
// second control point. The first 
// control point is computed to make a 
// right angle, and centered above the 
// mid point of the two given points.
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

///////////////////////////////////////
// arc command line
// the new end point is used as the 
// center of the arc. it is given an 
// arbitrary radius, start angle and 
// end angle.
function codeStringArc(x1,y1,x2,y2){
	return "\tcontext.arc( " + x2 + ", " + y2 + ", 50, 0, 2.0, false );"; // using 2.0 just to avoid 50 decimal places
}

///////////////////////////////////////
// closePath code line
function codeStringClosePath(x1,y1,x2,y2){
	return "\tcontext.closePath();";
}

///////////////////////////////////////
//inserts code line before the last 
// fill or stroke
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

///////////////////////////////////////
// this returns the arguments that are 
// changed when you add an path, but 
// drag it around before releasing it.
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

///////////////////////////////////////
// finds the line number of the last 
// path command 
function getPosToInsertAt( codeTree ){
	
	var position = { 
			lastPathCmd:-1,
			lastStroke:-1,
			lastFill:-1
			};

	acorn.walk.simple( codeTree, {
		Expression: getPosToInsertAtCallBack
		},undefined,position);

	var insertAt = 0;
	
	if( position.lastStroke < 0 && position.lastFill <0){
		insertAt = position.lastPathCmd;
	}
	if(  position.lastStroke >= 0 && position.lastFill <0){
		insertAt = position.lastStroke;
	}
	if( position.lastStroke < 0 && position.lastFill >=0){
		insertAt = position.lastFill;
	}
	if( position.lastStroke >= 0 && position.lastFill >=0){
		if( position.lastStroke < position.lastFill){
			insertAt = position.lastStroke;
		}
		else {
			insertAt = position.lastFill;			
		}
	}	
	
	return insertAt;
}

function getPosToInsertAtCallBack(node, position){
		
	//find last path command and use that to insert after,
	// unless it's a closePath command, in which case it is inserted before it.
	
	//XXX need to fix this so it handles semicolons and whitespace properly
	if( node.type == "CallExpression"){
		if( node.callee.object.name == "context" ){
			position.lastPathCmd = node.end+1;
		}
		if( node.callee.property.name == "stroke"){
			position.lastStroke = node.start;
		}
		else if( node.callee.property.name == "fill"){
			position.lastFill = node.start;
		}
	}
}

/**
 * 
 * @param codeTree
 * @param code
 * @param x1 - start coords of this path segment
 * @param y1 - 
 * @param x2 - end coords of this path segment
 * @param y2
 * @param command
 			command - the path command to be added
 * @returns
			destArgs
			srcArgs
			type
			xOld
			yOld
			
			newCode
* 			
 */
///////////////////////////////////////
// takes the code lines, old and new 
// end points, and the command selected
// and returns the information needed 
// to update the code.
function addComandToCode(codeTree,code,x1,y1,x2,y2,command){

	if( typeof(command) == 'undefined' || command == ""){
		return {};
	}

	var myNewCodeLine = makeCodeLine(command,x1,y1,x2,y2);
	
    var insertAt = getPosToInsertAt(codeTree);
    
    
	var newcode = code.substring(0,insertAt) + "\n" + myNewCodeLine + "\n" + code.substring(insertAt);
	var argsIndex = getArgsToBeChanged(command);
	var moveInfo = {
			destArgs: argsIndex,
			srcArgs: argsIndex,
			type: "line",
			xOld: x2,
			yOld: y2,
			
			newCode: newcode
	};
	return moveInfo;
}



