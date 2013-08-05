
module("addPathCommands.js");
// getRightAngle
test( "getRightAngle test",6, function() {
	
	deepEqual( getRightAngle(0,0,1,0), [0,.1],"getRightAngle test #1");
	deepEqual( getRightAngle(0,0,0,1), [-.1,0],"getRightAngle test #2");
	deepEqual( getRightAngle(10,10,20,20), [-1,1],"getRightAngle test #3");
	deepEqual( getRightAngle(293, 156, 279, 197 ), [ -41*.1, -14*.1],"getRightAngle test #4");
	deepEqual( getRightAngle(267, 199, 263, 105), [94*.1, -4*.1],"getRightAngle test #5");
	deepEqual( getRightAngle(177, 242,94, 196), [46*.1, -83*.1],"getRightAngle test #6");
	
});

test( "bulk command line sting tests",5, function() {

	ok( codeStringMoveTo( 1,2,3,4), "codeStringMoveTo returned something");
	ok( codeStringLineTo( 1,2,3,4), "codeStringLineTo returned something");
	ok( codeStringBezierCurveTo( 1,2,3,4), "codeStringBezierCurveTo returned something");
	ok( codeStringQuadraticCurveTo( 1,2,3,4), "codeStringQuadraticCurveTo returned something");
	ok( codeStringClosePath( 1,2,3,4), "codeStringClosePath returned something");
	
});



test( "makeCodeLine test",6, function() {
	
	equal( makeCodeLine( "foo", 1,2,3,4), "","makeCodeLine - no recognizable command");

	equal( makeCodeLine( "moveTo", 1,2,3,4), "\tcontext.moveTo( 3, 4 );","makeCodeLine - moveTo");
	
	equal( makeCodeLine( "lineTo", 1,2,3,4), "\tcontext.lineTo( 3, 4 );","makeCodeLine - lineTo");
	
	//[-.2,.2]
	equal( makeCodeLine( "bezierCurveTo", 1,2,3,4), "\tcontext.bezierCurveTo( 0.8, 2.2, 2.8, 4.2, 3, 4 );","makeCodeLine - bezierCurveTo");
	
	//[-.2,.2]
	equal( makeCodeLine( "quadraticCurveTo",1,2,3,4), "\tcontext.quadraticCurveTo( 1.8, 3.2, 3, 4 );","makeCodeLine - quadraticCurveTo");
	
	//[-.2,.2]
	equal( makeCodeLine( "closePath", 1,2,3,4), "\tcontext.closePath();","makeCodeLine - closePath");
	
});

test( "getArgsToBeChanged test",6, function() {
	
	state.command = "bar";
	deepEqual( getArgsToBeChanged(), [],"getArgsToBeChanged - no command");

	state.command = "moveTo";
	ok( getArgsToBeChanged(), "getArgsToBeChanged - moveTo");

	state.command = "lineTo";
	ok( getArgsToBeChanged(), "getArgsToBeChanged - lineTo");

	state.command = "bezierCurveTo";
	ok( getArgsToBeChanged(), "getArgsToBeChanged - bezierCurveTo");

	state.command = "quadraticCurveTo";
	ok( getArgsToBeChanged(), "getArgsToBeChanged - quadraticCurveTo");

	state.command = "closePath";
	ok( getArgsToBeChanged(), "getArgsToBeChanged - closePath");
});

test( "getPosToInsertAt test",8, function() {
	
	var codeLines = [
	                 "context.beginPath();",
	                 "context.moveTo( 101, 113 );",
	                 "context.stroke();"
	                 ];
	equal( getPosToInsertAt(codeLines), 2,"getPosToInsertAt - moveTo");

	var codeLines = [
	                 "context.beginPath();",
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.stroke();"
	                 ];
	equal( getPosToInsertAt(codeLines), 3,"getPosToInsertAt - lineTo");

	var codeLines = [
	                 "context.beginPath();",
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.stroke();"
	                 ];
	equal( getPosToInsertAt(codeLines), 4,"getPosToInsertAt - bezierCurveTo");

	var codeLines = [
	                 "context.beginPath();",
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.stroke();"
	                 ];
	equal( getPosToInsertAt(codeLines), 5,"getPosToInsertAt - quadraticCurveTo");

	var codeLines = [
	                 "context.beginPath();",
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.stroke();"
	                 ];
	equal( getPosToInsertAt(codeLines), 6,"getPosToInsertAt - arc");

	var codeLines = [
	                 "context.beginPath();",
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.arcTo( 267.4, 199.6, 263.4, 105.6, 254 );",
	                 "context.stroke();"
	                 ];
	equal( getPosToInsertAt(codeLines), 7,"getPosToInsertAt -arcTo");

	var codeLines = [
	                 "context.beginPath();",
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.arcTo( 267.4, 199.6, 263.4, 105.6, 254 );",
	                 "context.closePath();",
	                 "context.stroke();"
	                 ];
	equal( getPosToInsertAt(codeLines), 8,"getPosToInsertAt - closePath");

	var codeLines = [
	                 "context.beginPath();",
	                 "context.stroke();"
	                 ];
	equal( getPosToInsertAt(codeLines), 1,"getPosToInsertAt - closePath");

});


test( "addComandToCode test",2, function() {
	
	var codeLines = [
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.stroke();"
	                 ];

	state.command = "bar";

	deepEqual( addComandToCode(codeLines,1,2,3,4), codeLines,"addComandToCode - no recognizable command");

	state.command = "lineTo";
	var result = [
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "\tcontext.lineTo( 3, 4 );",
	                 "context.stroke();"
	                 ];

	deepEqual( addComandToCode(codeLines,1,2,3,4), result,"addComandToCode - lineTo command");

});

	
