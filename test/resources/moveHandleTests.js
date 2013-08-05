
module("moveHandle");

test( "updateCodeLine test",3, function() {

	state.codeLineBeingReferenced = 2;
	state.destArgs = [1,2];
	state.srcArgs = [];
	state.type = "line";

	
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
	deepEqual( updateCodeLine(codeLines,[10,20]), result,"updateCodeLine for simple coords");


	
	///////////////////////////////
	state.codeLineBeingReferenced = 2;
	state.destArgs = [3];
	state.srcArgs = [1,2];
	state.type = "rad";

	
	var codeLines = [
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 10, 10, 14, 105.6, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.arcTo( 267.4, 199.6, 263.4, 105.6, 254 );",
	                 "context.closePath();",
	                 "context.stroke();"
	                 ];
	var result = [
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 10, 10, 14, 5, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.arcTo( 267.4, 199.6, 263.4, 105.6, 254 );",
	                 "context.closePath();",
	                 "context.stroke();"
	                 ];
	deepEqual( updateCodeLine(codeLines,[13,18]), result,"updateCodeLine for radious");


	///////////////////////////////
	state.codeLineBeingReferenced = 2;
	state.destArgs = [3];
	state.srcArgs = [1,2];
	state.type = "ang";
	
	
	var codeLines = [
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 10, 10, 14, 105.6, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.arcTo( 267.4, 199.6, 263.4, 105.6, 254 );",
	                 "context.closePath();",
	                 "context.stroke();"
	                 ];
	var result = [
	                 "context.moveTo( 101, 113 );",
	                 "context.lineTo( 246, 78 );",
	                 "context.bezierCurveTo( 10, 10, 14, 0, 254, 106 );",
	                 "context.quadraticCurveTo( 250.9, 101.2, 202.9, 132.2);",
	                 "context.arc(267.4, 199.6, 263.4, 105.6, 254, 106 );",
	                 "context.arcTo( 267.4, 199.6, 263.4, 105.6, 254 );",
	                 "context.closePath();",
	                 "context.stroke();"
	                 ];
	deepEqual( updateCodeLine(codeLines,[15,14]), result,"updateCodeLine for angle");
	

});

