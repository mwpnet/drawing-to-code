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

function pathButtonSelected( event, ui ){
	var button = $('.ui-selected',this).attr('id');
	
	if( button == "beginPathButton"){
		state.command = "beginPath";
	}
	if( button == "moveToButton"){
		state.command = "moveTo";
	}
	if( button == "lineToButton"){
		state.command = "lineTo";
	}
	if( button == "bezierCurveToButton"){
		state.command = "bezierCurveTo";
	}
	if( button == "quadraticCurveToButton"){
		state.command = "quadraticCurveTo";
	}
	if( button == "arcToButton"){
		state.command = "arcTo";
	}
	if( button == "arcButton"){
		state.command = "arc";
	}
	if( button == "closePathButton"){
		state.command = "closePath";
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
	return "\n\tcontext.moveTo( " + x2 + ", " + y2 + " );\n";
}

///////////////////////////////////////
// lineTo code line
function codeStringLineTo(x1,y1,x2,y2){
	return "\n\tcontext.lineTo( " + x2 + ", " + y2 + " );\n";
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

	return "\n\tcontext.bezierCurveTo( " + args.join(", ") +" );\n";
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

	return "\n\tcontext.quadraticCurveTo( " + args.join(", ") +" );\n";
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

	return "\n\tcontext.arcTo( " + args.join(", ") +" );\n";
}

///////////////////////////////////////
// arc command line
// the new end point is used as the 
// center of the arc. it is given an 
// arbitrary radius, start angle and 
// end angle.
function codeStringArc(x1,y1,x2,y2){
	return "\n\tcontext.arc( " + x2 + ", " + y2 + ", 50, 0, 2.0, false );\n"; // using 2.0 just to avoid 50 decimal places
}

///////////////////////////////////////
// closePath code line
function codeStringClosePath(x1,y1,x2,y2){
	return "\n\tcontext.closePath();\n";
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
function getPosToInsertAt( codeTree, pos ){
	
	var position = findTwoDrawItemsAroundPos( codeTree, pos );
	return decodePositionToInsertAt(position,codeTree);
	
	//
}

//////////////////////////////////////
// give the position just before node, or if undefined, the position
// just before the end of the function,
function decodePositionToInsertAt(position,codeTree){
	
	var insertAt = 0;
	
	if( typeof position.drawItem == "undefined" ){
		insertAt = endOfFunctonPosition(codeTree);
	}
	else {
		insertAt = position.drawItem.start;
	}

	return insertAt;
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
function addComandToCode(codeTree,code,x1,y1,x2,y2,command,pos){

	if( typeof pos == 'undefined' ){
		pos = editor.indexFromPos( editor.getCursor() );
	}

	if( typeof(command) == 'undefined' || command == ""){
		return {};
	}

	var myNewCodeLine = makeCodeLine(command,x1,y1,x2,y2);
	
    var insertAt = getPosToInsertAt(codeTree, pos);
    
    
	var newcode = code.substring(0,insertAt) + myNewCodeLine + code.substring(insertAt);
	var argsIndex = getArgsToBeChanged(command);
	var moveInfo = {
			destArgs: argsIndex,
			srcArgs: argsIndex,
			type: "line",
			xOld: x2,
			yOld: y2,
			
			newCode: newcode,
			newCodeLine: myNewCodeLine,
			insertAt: insertAt,
	};
	return moveInfo;
}



