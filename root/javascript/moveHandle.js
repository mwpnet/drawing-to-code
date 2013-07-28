/********************************************
 * functions to update code lines
 * based on mouse moves
 *******************************************/


function updateCodeLine(codeLines,newCoords){

	var lineIndex = global.lineBeingChangedIndex;
	var argsIndex = global.argsIndex;

	if( argsIndex.length ==0){
		return codeLines;
	}

	var lineParts = parseCodeLine(codeLines[lineIndex]);
	var args = lineParts[1];
	
	for( var i=0,l=argsIndex.length,m=newCoords.length; i<l && i<m; i++){
		var co=argsIndex[i];
		args[co] = newCoords[i];
	}

	codeLines[lineIndex] = rejoinCodeLine( lineParts[0], args, lineParts[2]);
	return codeLines;
}
	 
