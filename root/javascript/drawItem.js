
function addDrawItem(codeLine){
	var code = getCode();

	var codeTree = acorn.parse( code);

	//var insertAt = codeTree.body[0].end-1;
	
	var cursor = editor.getCursor();
	var index = editor.indexFromPos( cursor );
	
	var insertAt = findStatementStart(codeTree, index);
	
	var newLinePosPair = editor.posFromIndex( insertAt.start );
	editor.replaceRange( codeLine, newLinePosPair);
	cursor.line++;
	editor.setCursor(cursor);
	editor.focus();

	var code = getCode();
	codeTree = acorn.parse( code);


	context.clearRect(0, 0, canvas.width, canvas.height);

	drawCode( code );
	drawEditHandles( context, codeTree,mousex,mousey );
	
}

function addFill(){
	addDrawItem( "\tcontext.fill();\n");
}

function addStroke(){
	addDrawItem( "\tcontext.stroke();\n");
}

function addFillRect(){
	addDrawItem( "\tcontext.fillRect(50,50,50,50);\n");
}

function addStrokeRect(){
	addDrawItem( "\tcontext.strokeRect(50,50,50,50);\n");
}

function addFillText(){
	addDrawItem( "\tcontext.fillText(\"Text goes here\",50,50);\n");
}

function addStrokeText(){
	addDrawItem( "\tcontext.strokeText(\"Text goes here\",50,50);\n");
}


