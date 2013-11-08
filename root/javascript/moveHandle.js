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



/**************************************
 * functions to update code lines based
 * on mouse position
**************************************/

///////////////////////////////////////
// given the array of code lines, 
// updates the arguments of the code 
// based on information passed in in 
// info.
// meant to be called whenever the 
// mouse button is pressed and the 
// mouse moves.
//
function updateCodeLine(codeLines,newCoords,info){
	var lineIndex = info.codeLineBeingReferenced;
	var destArgs = info.destArgs;
	var srcArgs = info.srcArgs;
	var type = info.type;

	if( typeof(destArgs) == "undefined" || destArgs.length ==0){
		return codeLines;
	}

	var lineParts = parseCodeLine(codeLines[lineIndex]);
	var args = lineParts[1];
	
	if( type =="rad"){
		r=distance(newCoords[0],newCoords[1],args[srcArgs[0]],args[srcArgs[1]]);
		args[destArgs[0]] = Math.round(r); // should be an integer
	}
	else if( type =="ang"){
		ang = xyToAngle(newCoords[0],newCoords[1],args[srcArgs[0]],args[srcArgs[1]]);
		args[destArgs[0]] = ang.toFixed(4); // don't want 20 decimal palces
	}
	else if( type=="rad2"){
		var startpoint = [info.xOld,info.yOld];
		var d=distance(args[srcArgs[0]],args[srcArgs[1]],newCoords[0],newCoords[1]);
		
		var r=computRad( startpoint[0],startpoint[1],args[srcArgs[0]],args[srcArgs[1]],args[srcArgs[2]],args[srcArgs[3]],d);
		args[destArgs[0]] = r;
	}
	else if( type == "line"){
		for( var i=0,l=destArgs.length,m=newCoords.length; i<l && i<m; i++){
			args[ destArgs[i] ] = newCoords[ i ];
		}
	}

	codeLines[lineIndex] = rejoinCodeLine( lineParts[0], args, lineParts[2]);
	return codeLines;
}
	 

///////////////////////////////////////
//given the array of code lines, 
//updates the arguments of the code 
//based on information passed in in 
//info.
// similar to updateCodeLine, but meant
// to only be called once when the 
// mouse button is first pressed.
//
function updateCodeLineOnce(codeLines,newCoords,info){
	var lineIndex = info.codeLineBeingReferenced;
	var destArgs = info.destArgs;
	var srcArgs = info.srcArgs;
	var type = info.type;

	if( typeof(destArgs) == "undefined" || destArgs.length ==0){
		return codeLines;
	}

	var lineParts = parseCodeLine(codeLines[lineIndex]);
	var args = lineParts[1];
	
	if( type == "truefalse"){
			args[destArgs[0]] = ! args[srcArgs[0]];
	}

	codeLines[lineIndex] = rejoinCodeLine( lineParts[0], args, lineParts[2]);
	return codeLines;
}
