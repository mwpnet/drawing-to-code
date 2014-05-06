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
 * commands used to parse the given 
 * code and code lines, and reassemble 
 * them into new code
 * 
 * XXX - this whole file should be 
 * replace with a real code parser, or 
 * something else completely.
 *************************************/


///////////////////////////////////////
// parse code into an array of lines
//
function parseCode( code ){
	var trimedCode = code.replace(/\n$/, ''); 
	return trimedCode.split(/\n/g);
}

///////////////////////////////////////
// parse a line of code into the 
// function part, the args, and the 
// trailing rest
//
function parseCodeLine(codeLine){

	var startParen = codeLine.indexOf("(");
	var endParen = codeLine.indexOf(")");
	
	if( startParen <0){
		return [ codeLine, [], ""];
	}

	var functionPart = codeLine.slice(0,startParen+1);
	var argsPart = codeLine.slice(startParen+1,endParen);
	var endPart = codeLine.slice(endParen);

	var getArgs = /(?:-?\d*(?:\d\.?|\.?\d)\d*)|(?:\btrue\b)|(?:\bfalse\b)/g;
	var args = argsPart.match( getArgs );

	if( args){
		for(var i=0,l=args.length; i<l;i++){
			if(args[i] == "true"){
				args[i] = true;
			}
			else if( args[i]=="false"){
				args[i] = false;
			}
			else {
				args[i] = parseFloat( args[i] );
			}
		}
	}
	else {
		args = [];
	}
	return [ functionPart, args, endPart ];
}

///////////////////////////////////////
// takes the parts of a line from 
// parseCodeLine and rejoins it into 
// the line again. It should give 
//approximately the original line back
//
function rejoinCodeLine (functionPart, args, endPart ){
	var argsString = "";
	
	if(args.length==0){
		return functionPart + endPart;
	}

	argsString = " "+args.join(", ", args)+" ";

	var newLine = functionPart + argsString + endPart;
	return newLine;
}

///////////////////////////////////////
function parseCodeLineAssignment(codeLine){
	var objStart = codeLine.indexOf(".");
	var startValue = codeLine.indexOf("=");
	var endValue = codeLine.indexOf(";");
	
	var objPart = codeLine.slice(0,objStart);
	var propertyPart = codeLine.slice(objStart+1,startValue+1);
	var valuePart = codeLine.slice(startValue+1,endValue);
	var restPart = codeLine.slice(endParen);
	
	return 
	
}

///////////////////////////////////////
// takes an array of code lines and 
//rejoins them into one string
//
function rejoinCode(codeLines){
	return codeLines.join("\n") +"\n";
}





