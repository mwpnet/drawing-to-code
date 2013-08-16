/*
 * parse code into an array of lines
 */
function parseCode( code ){
	var trimedCode = code.replace(/\n$/, ''); 
	return trimedCode.split(/\n/g);
}

/*
 * parse a line of code into the function 
 * part, the args, and the trailing rest
 */
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

/*
 * takes the parts of a line from parseCodeLine 
 * and rejoins it into the line again.
 * It should give aproximatly the original line back
 */
function rejoinCodeLine (functionPart, args, endPart ){
	var argsString = "";
	
	if(args.length==0){
		return functionPart + endPart;
	}

	argsString = " "+args.join(", ", args)+" ";

	var newLine = functionPart + argsString + endPart;
	return newLine;
}

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

/*
 * takes an array of code lines
 * and rejoins them into one string
 */
function rejoinCode(codeLines){
	return codeLines.join("\n") +"\n";
}
