
module("moveHandle");

test( "updateCodeLine test",1, function() {

	global.lineBeingChangedIndex = 2;
	global.argsIndex = [1,2];

	var codeLines = [
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.arcTo( 267.4, 199.6, 263.4, 105.6, 254 );",
	                 "context.closePath();",
	                 "context.stroke();"
	                 ];
	var result = [
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 267.4, 10, 20, 105.6, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.arcTo( 267.4, 199.6, 263.4, 105.6, 254 );",
	                 "context.closePath();",
	                 "context.stroke();"
	                 ];
	deepEqual( updateCodeLine(codeLines,[10,20]), result,"updateCodeLine");


});

