/** Copyright 2013 Martyn Peck (mwp@mwpnet.com) **/

/**    This file is part of drawing-to-code.									**/
/**																				**/
/**    drawing-to-code is free software: you can redistribute it and/or modify	**/
/**    it under the terms of the GNU General Public License as published by		**/
/**    the Free Software Foundation, either version 3 of the License, or		**/
/**    (at your option) any later version.										**/
/**																				**/
/**    drawing-to-code is distributed in the hope that it will be useful,		**/
/**    but WITHOUT ANY WARRANTY; without even the implied warranty of			**/
/**    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the			**/
/**    GNU General Public License for more details.								**/
/**																				**/
/**    You should have received a copy of the GNU General Public License		**/
/**    along with drawing-to-code.  If not, see <http://www.gnu.org/licenses/>.	**/


module("parseCode");

//parseCode


test( "parseCode test",3, function() {
	var code = "a\nb\nc\nd\n";
	var result = ["a","b","c","d"];

	ok(parseCode(code), "parseCode returning something");
	deepEqual( parseCode(code), result, "parsed multilines" );
	
	code = "\tcontext.lineTo( 246, 78 );    \n\tcontext.lineTo( 291, 79 );\n\tcontext.lineTo( 300, 114 );\t\t\n\tcontext.lineTo( 293, 156 );\n\tcontext.lineTo( 279, 197 );\n";
	result = [
			"	context.lineTo( 246, 78 );    ",
			"	context.lineTo( 291, 79 );",
			"	context.lineTo( 300, 114 );\t\t",
			"	context.lineTo( 293, 156 );",
			"	context.lineTo( 279, 197 );"
	      	];

	deepEqual( parseCode(code), result, "parsed real code - with constructed string" );

});

//parseCodeLine
test( "parseCodeLine test",5, function() {

	var codeline = "\t\tfoo ( 300, 114, 123 );\t\n";
	var result = [ "\t\tfoo (", [300, 114, 123], ");\t\n" ];
	ok(parseCodeLine(codeline), "parseCodeLine returning something");
	deepEqual( parseCodeLine(codeline), result, "parsed line - with args" );

	codeline = "\t\tbar ();\t\n";
	result = [ "\t\tbar (", [], ");\t\n" ];
	deepEqual( parseCodeLine(codeline), result, "parsed line -without args" );

	codeline = "\t\tbaz;\t\n";
	result = [ "\t\tbaz;\t\n", [], "" ];
	deepEqual( parseCodeLine(codeline), result, "parsed line -without function" );
	
	codeline = "\tcontext.lineTo( 300, 114 );\n";
	result = [ "\tcontext.lineTo(", [300, 114], ");\n" ];
	deepEqual( parseCodeLine(codeline), result, "parsed real code line" );

	
});

//rejoinCodeLine
test( "rejoinCodeLine test",4, function() {

	var funcpart = "foo";
	var args = [ 1,2,3,4];
	var endpart = "bar";
	
	var result = "foo 1, 2, 3, 4 bar";
	ok(rejoinCodeLine(funcpart,args,endpart), "rejoinCodeLine returning something");
	deepEqual( rejoinCodeLine(funcpart,args,endpart), result, "rejoined line - with args" );

	args = [];
	result = "foobar";
	deepEqual( rejoinCodeLine(funcpart,args,endpart), result, "rejoined line - with out args" );

	funcpart = "\tcontext.lineTo(";
	args = [300,114];
	endpart = ");\n";
	result = "\tcontext.lineTo( 300, 114 );\n";
	deepEqual( rejoinCodeLine(funcpart,args,endpart), result, "rejoined real code line" );

});

//rejoinCode
test( "rejoinCode test",2, function() {

	var code = ["foo","bar","baz"];
	var result = "foo\nbar\nbaz\n";
	ok(rejoinCode(code), "rejoinCode returning something");
	deepEqual( rejoinCode(code), result, "rejoinCode worked" );

});

// rejoinCodeLine - parseCodeLine

test( "rejoinCodeLine - parseCodeLine test",2, function() {

	var funcpart = "foo(";
	var args = [ 1,2,3,4];
	var endpart = ")bar";
	
	var result = [ funcpart, args, endpart ];
	deepEqual( 
			parseCodeLine(rejoinCodeLine(funcpart,args,endpart)), 
			result, 
			"parsed rejoined line - with args" 
			);

	args = [];
	result = [ funcpart, args, endpart ];
	deepEqual( 
			parseCodeLine(rejoinCodeLine(funcpart,args,endpart)), 
			result, 
			"parsed rejoined line - with out args" 
			);

});


// rejoinCode - parseCode

test( "rejoinCode - parseCode test",1, function() {

	var code = ["foo","bar","baz"];
	deepEqual( 
			parseCode(rejoinCode(code)),
			code, "rejoinCode - parseCode worked" );
	
});

