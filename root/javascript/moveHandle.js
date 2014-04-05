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


/**
 * 
 * @param code - the original code string
 * @param newCoords - an array with the new x,y coords
 * @param info
			destArgs - array of index on arguments to be change
			srcArgs - array of index on arguments that values are taken from for computations
			type - which type of change is to be made
			arguments - node array with the original arguments
			xOld - coord of start of this path segment
			yOld
 * @returns
 */

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

	var destArgs = info.destArgs;
	var srcArgs = info.srcArgs;
	var type = info.type;
	var args = info.arguments;
	
	if( typeof(destArgs) == "undefined" || destArgs.length ==0){
		return code;
	}

	if( type =="rad"){
		r=distance(newCoords[0],newCoords[1],args[srcArgs[0]].value,args[srcArgs[1]].value); 
		r=Math.round(r);// should be an integer
		var start = args[destArgs[0]].start;
		var end = args[destArgs[0]].end;
		
		code = code.substring(0,start) + r.toString() + code.substring(end);
	}
	else if( type =="ang"){
		ang = xyToAngle(newCoords[0],newCoords[1],args[srcArgs[0]].value,args[srcArgs[1]].value);
		ang = ang.toFixed(4); // don't want 20 decimal places

		var start = args[destArgs[0]].start;
		var end = args[destArgs[0]].end;
		
		code = code.substring(0,start) + ang.toString() + code.substring(end);
	}
	else if( type=="rad2"){
		//destArgs: [4],
		//srcArgs: [0,1,2,3,4],
		var startpoint = [info.xOld,info.yOld];
		var d=distance(args[0].value,args[1].value,newCoords[0],newCoords[1]);
		var r=computRad( startpoint[0],startpoint[1],args[0].value,args[1].value,args[2].value,args[3].value,d);

		r=Math.round(r);// should be an integer
		console.debug(newCoords[0],newCoords[1],args[0].value,args[1].value,args[2].value,args[3].value,args[4].value,d,r);

		var start = args[4].start;
		var end = args[4].end;
		
		code = code.substring(0,start) + r.toString() + code.substring(end);
	}
	else if( type == "line"){
		// need to do it in reverse so range doesn't get out of sync with string
		for( var i=destArgs.length-1; i>=0; i--){ 
			var start = args[destArgs[i]].start;
			var end = args[destArgs[i]].end;
			code = code.substring(0,start) + newCoords[ i ].toString() + code.substring(end);
			document.getElementById('errorBox').innerHTML = args[destArgs[0]].start+","+args[destArgs[0]].end+"\n";
		}
	}

	return code;
}
	 

/**
 * 
 * @param code
 * @param newCoords
 * @param info
			destArgs - array of index on arguments to be change
			srcArgs - array of index on arguments that values are taken from for computations
			type - which type of change is to be made
			arguments - node array with the original arguments

 * @returns
 * 		code string with the new args 
 */
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
	var destArgs = info.destArgs;
	var srcArgs = info.srcArgs;
	var type = info.type;
	var args = info.arguments;
	

	if( typeof(destArgs) == "undefined" || destArgs.length ==0){
		return code;
	}

	var newCode = code;
	if( type == "truefalse"){
		var start = args[destArgs[0]].start;
		var end = args[destArgs[0]].end;
		var newval = ! args[srcArgs[0]].value;
		newCode = code.substring(0,start) + newval.toString() + code.substring(end);
	}
	return newCode;
}
