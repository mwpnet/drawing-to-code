

var fakeCanvas = {
		save:function(){ return true; },

		beginPath:function(){ return true; },
	    lineWidth:function(){ return true; },
	    strokeStyle:function(){ return true; },

	    moveTo:function(){ return true; },
	    lineTo:function(){ return true; },
		bezierCurveTo:function(){ return true; },
		quadraticCurveTo:function(){ return true; },
		arc:function(){ return true; },
		arcTo:function(){ return true; },
		closePath:function(){ return true; },

		stroke:function(){ return true; },
		fill:function(){ return true; },
		
		restore:function(){ return true; },

		isPointInPath:function(x,y){ return true; }
}


module("drawPathHandles.js");

test( "drawPathBox test",2, function() {
	
	fakeCanvas.isPointInPath = function(x,y){ return false; };
	equal(drawPathBox(fakeCanvas,10,20),false, "mouse not in path box");

	fakeCanvas.isPointInPath = function(x,y){ return true; };
	equal(drawPathBox(fakeCanvas,10,20),true, "mouse in path box");

});

test( "drawControlePointHandle test",2, function() {
	
	fakeCanvas.isPointInPath = function(x,y){ return false; };
	equal(drawControlePointHandle(fakeCanvas,10,20),false, "mouse not in control handle");

	fakeCanvas.isPointInPath = function(x,y){ return true; };
	equal(drawControlePointHandle(fakeCanvas,10,20),true, "mouse in control handle");

});

test( "drawPathX test",1, function() {
	ok(! drawPathX(fakeCanvas,10,20), "path X");
});

test("drawCircleForArcs test",1,function() {
	ok(! drawCircleForArcs(fakeCanvas,10,20,30, 1.0,2.0,false), "circle outline");
});


//lastEndPoint (prevCodeLine){

test("lastEndPoint test",8,function(){
	var prevCodeLine = [ "moveTo(",[10,20],")\n"];
	deepEqual(lastEndPoint(prevCodeLine), [10,20],"moveTo test");
	
	prevCodeLine = [ "lineTo(",[10,20],")\n"];
	deepEqual(lastEndPoint(prevCodeLine), [10,20],"lineTo test");
	
	prevCodeLine = [ "bezierCurveTo(",[10,20,30,40,50,60],")\n"];
	deepEqual(lastEndPoint(prevCodeLine), [50,60],"bezierCurveTo test");
	
	prevCodeLine = [ "quadraticCurveTo(",[10,20,30,40],")\n"];
	deepEqual(lastEndPoint(prevCodeLine), [30,40],"quadraticCurveTo test");
	
	// there's a qunit-assert-close.js plugin
	// that I need to look into using
	var eta =.0000001;
	prevCodeLine = [ "arc(",[10,20,30,0,Math.PI/2,false],")\n"];
	var result = lastEndPoint(prevCodeLine);
	ok(  (Math.abs(result[0]-10)<eta),"arc test #1a");
	ok(  (Math.abs(result[1]-50)<eta),"arc test #1b");
	
	
	prevCodeLine = [ "arc(",[10,20,30,0,Math.PI,false],")\n"];
	result = lastEndPoint(prevCodeLine);
	ok(  (Math.abs(result[0]+20)<eta),"arc test #2a");
	ok(  (Math.abs(result[1]-20)<eta),"arc test #2b");
	
})


// drawing path markers
test( "draw markers", 8, function() {
	
	fakeCanvas.isPointInPath = function(x,y){ return false; };
	deepEqual(drawMoveTo(fakeCanvas,10,20),NaN, "mouse not in drawMoveTo");

	fakeCanvas.isPointInPath = function(x,y){ return true; };
	deepEqual(drawMoveTo(fakeCanvas,10,20),[0,1], "mouse in drawMoveTo");

	fakeCanvas.isPointInPath = function(x,y){ return false; };
	deepEqual(drawLineTo(fakeCanvas,10,20),NaN, "mouse not in drawLineTo");

	fakeCanvas.isPointInPath = function(x,y){ return true; };
	deepEqual(drawLineTo(fakeCanvas,10,20),[0,1], "mouse in drawLineTo");


	state.mouseX = 20;
	state.mouseY = 10;

	fakeCanvas.isPointInPath = function(x,y){ return false; };
	deepEqual(drawBezierCurveTo(fakeCanvas,10,20,30,40,50,60,70,80),NaN, "mouse not in any controle points in drawBezierCurveTo");

	fakeCanvas.isPointInPath = function(x,y){ return true; };
	deepEqual(drawBezierCurveTo(fakeCanvas,10,20,30,40,50,60,70,80),[4,5], "mouse in controle point in drawBezierCurveTo");

	fakeCanvas.isPointInPath = function(x,y){ return false; };
	deepEqual(drawQuadraticCurveTo(fakeCanvas,10,20,30,40,50,60),NaN, "mouse not in any controle points in drawQuadraticCurveTo");

	fakeCanvas.isPointInPath = function(x,y){ return true; };
	deepEqual(drawQuadraticCurveTo(fakeCanvas,10,20,30,40,50,60),[2,3], "mouse in controle point in drawQuadraticCurveTo");


});

//drawing path markers
test( "draw markers", 3, function() {

	codeLines = [
				"	context.lineTo( 246, 78 );    ",
				"	context.lineTo( 291, 79 );",
				"	context.lineTo( 300, 114 );\t\t",
				"	context.lineTo( 293, 156 );",
				"	context.lineTo( 279, 197 );"
		      	];

	fakeCanvas.isPointInPath = function(x,y){ return false; };
	state.mouseInHandle = false;
	drawEditHandles( fakeCanvas, codeLines );
	equal(state.mouseInHandle, false, "state.mouseInHandle set properly");

	
	fakeCanvas.isPointInPath = function(x,y){ return false; };
	state.mouseInHandle = true;
	drawEditHandles( fakeCanvas, codeLines );
	equal(state.mouseInHandle, true, "state.mouseInHandle set properly");

	
	fakeCanvas.isPointInPath = function(x,y){ return true; };
	state.mouseInHandle = false;
	drawEditHandles( fakeCanvas, codeLines );
	equal(state.mouseInHandle, true, "state.mouseInHandle set properly");

});