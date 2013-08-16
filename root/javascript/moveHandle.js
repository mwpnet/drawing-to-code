/////////////////////////////////////////////
// functions to update code lines
// based on mouse moves
/////////////////////////////////////////////

/*******************************
 * 
 * @param codeLines
 * @returns codeLines - with the updated line
 */
function updateCodeLine(codeLines,newCoords){
	var lineIndex = state.codeLineBeingReferenced;
	var destArgs = state.destArgs;
	var srcArgs = state.srcArgs;
	var type = state.type;

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
		var params =computCenterToParameters(newCoords[0],newCoords[1],args[srcArgs[0]],args[srcArgs[1]],args[srcArgs[2]],args[srcArgs[3]]);
		//var r=computRad(newCoords[0],newCoords[1],args[srcArgs[0]],args[srcArgs[1]],args[srcArgs[2]],args[srcArgs[3]],params[0],params[1]);

		//args[destArgs[0]] = Math.round(r); // should be an integer
	}
	else if( type == "truefalse"){
		if(!state.flipped){
			args[destArgs[0]] = ! args[destArgs[0]];
		}
	}
	else {
		for( var i=0,l=destArgs.length,m=newCoords.length; i<l && i<m; i++){
			var co=destArgs[i];
			args[ destArgs[i] ] = newCoords[ i ];
		}
	}

	codeLines[lineIndex] = rejoinCodeLine( lineParts[0], args, lineParts[2]);
	return codeLines;
}
	 
