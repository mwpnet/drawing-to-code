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
function updateCodeLine(code,newCoords,info){
	var lineIndex = info.codeLineBeingReferenced;
	var destArgs = info.destArgs;
	var srcArgs = info.srcArgs;
	var type = info.type;
	var args = info.arguments;
	
	var newcode=code;
	
	if( typeof(destArgs) == "undefined" || destArgs.length ==0){
		return newCode;
	}

	var lineParts = parseCodeLine(codeLines[lineIndex]);
	var args = lineParts[1];
	
	if( type =="rad"){
		r=distance(newCoords[0],newCoords[1],args[srcArgs[0]].value,args[srcArgs[1]].value); 
		r=Math.round(r);// should be an integer
		var start = args[destArgs[0]].range[0];
		var end = args[destArgs[0]].range[1];
		
		newcode = code.substring(0,start) . r.toString . code.substring(end);
	}
	else if( type =="ang"){
		ang = xyToAngle(newCoords[0],newCoords[1],args[srcArgs[0]].value,args[srcArgs[1]].value);
		ang = ang.toFixed(4); // don't want 20 decimal places

		var start = args[destArgs[0]].range[0];
		var end = args[destArgs[0]].range[1];
		
		newcode = code.substring(0,start) . ang.toString . code.substring(end);
	}
	else if( type=="rad2"){
		var startpoint = [info.xOld,info.yOld];
		var d=distance(args[srcArgs[0]].value,args[srcArgs[1]].value,newCoords[0],newCoords[1]);
		
		var r=computRad( startpoint[0],startpoint[1],args[srcArgs[0]].value,args[srcArgs[1]].value,args[srcArgs[2]].value,args[srcArgs[3]].value,d);

		r=Math.round(r);// should be an integer
		var start = args[destArgs[0]].range[0];
		var end = args[destArgs[0]].range[1];
		
		newcode = code.substring(0,start) . r.toString . code.substring(end);
	}
	else if( type == "line"){
		// need to do it in reverse so range doesn't get out of sync with string
		for( var i=destArgs.length-1; i>=0; i--){ 
			
			var start = args[destArgs[i]].range[0];
			var end = args[destArgs[i]].range[1];
			
			newcode = code.substring(0,start) . newCoords[ i ].toString . code.substring(end);
		}
	}

	return newCode;
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
function updateCodeLineOnce(code,newCoords,info){
	var lineIndex = info.codeLineBeingReferenced;
	var destArgs = info.destArgs;
	var srcArgs = info.srcArgs;
	var type = info.type;
	var args = info.arguments;
	

	if( typeof(destArgs) == "undefined" || destArgs.length ==0){
		return code;
	}

	var newcode = code;
	if( type == "truefalse"){
		var start = args[destArgs[0]].range[0];
		var end = args[destArgs[0]].range[1];
		
		var newval = ! args[srcArgs[0]].value;
		
		newcode = code.substring(0,start) . newval.toString . code.substring(end);
	}
	return newcode;
}
