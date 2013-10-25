/////////////////////////////////////////////
// functions to update code lines
// based on mouse moves
/////////////////////////////////////////////

/*******************************
 * 
 * @param codeLines
 * @returns codeLines - with the updated line
 */
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
