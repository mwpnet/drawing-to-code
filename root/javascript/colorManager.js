

// there are three bars, one square, and text input
// if one of the bars is clicked, the new valueis retrieved, and the square and text input areupdated.
// if the text area has a 


// for RGB

var colorGroup = {
		red:{
			start: "#000000",
			end:   "#FF0000"
		},
		green:{
			start: "#000000",
			end:   "#00FF00"
		},
		blue:{
			start: "#000000",
			end:   "#0000FF"
		}
};

function initColor(context, canvas){
	
}



function getStrokeStyle(codeLines){
	var re = /^(\s*context\.strokeStyle\s*=\s*\"?)([a-zA-Z0-9]+)(\"?\s*;\s*)$/;

	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		return arr[2];
	}
}


function updateStrokeStyle(colorIndex,colorHex){
	
	var code = getCode();
	var codeLines = parseCode(code);
	
	
	var newCodeLines = udateStrokeStyleCodeLine( codeLines, [ mousex, mousey ],state);

	var newCode = rejoinCode(newCodeLines);
	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );

}

function updateLineCap( codeLines, newVal ){
	var re = /^(\s*context\.strokeStyle\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		codeLines[pos] = arr[1]+newVal+arr[3];
		return codeLines;
	}
		
	codeLines.splice(-pos,0,"\tcontext.strokeStyle = \""+newVal+"\";");

	return codeLines;
}





function udateColorCodeLine(codeLines,colorHex){
	
}