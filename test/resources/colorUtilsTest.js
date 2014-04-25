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



module("colorUtils.js");

test( "rgbArrayToHex test",7, function() {
	
	equal(rgbArrayToHex([0,0,0]),0x000000, "rgbArrayToHex #1");
	equal(rgbArrayToHex([255,0,0]),0xFF0000, "rgbArrayToHex #2");
	equal(rgbArrayToHex([0,255,0]),0x00FF00, "rgbArrayToHex #3");
	equal(rgbArrayToHex([0,0,255]),0x0000FF, "rgbArrayToHex #4");
	equal(rgbArrayToHex([255,255,255]),0xFFFFFF, "rgbArrayToHex #5");
	equal(rgbArrayToHex([0xFF, 0xEB, 0xCD]),0xFFEBCD, "rgbArrayToHex #6 BlanchedAlmond");
	equal(rgbArrayToHex([ 0x77, 0x88, 0x99 ]),0x778899, "rgbArrayToHex #7 LightSlateGray");

});

test( "rgbHexToArray test",7, function() {
	
	deepEqual(rgbHexToArray(0x000000),[0,0,0], "rgbHexToArray #1");
	deepEqual(rgbHexToArray(0xFF0000),[255,0,0], "rgbHexToArray #2");
	deepEqual(rgbHexToArray(0x00FF00),[0,255,0], "rgbHexToArray #3");
	deepEqual(rgbHexToArray(0x0000FF),[0,0,255], "rgbHexToArray #4");
	deepEqual(rgbHexToArray(0xFFFFFF),[255,255,255], "rgbHexToArray #5");
	deepEqual(rgbHexToArray(0xFFEBCD),[0xFF, 0xEB, 0xCD], "rgbHexToArray #6 BlanchedAlmond");
	deepEqual(rgbHexToArray(0x778899),[ 0x77, 0x88, 0x99 ], "rgbHexToArray #7 LightSlateGray");

});

test( "rgbArrayCssColor test",7, function() {
	
	equal(rgbArrayCssColor([0,0,0]),"#000000", "rgbArrayCssColor #1");
	equal(rgbArrayCssColor([255,0,0]),"#FF0000", "rgbArrayCssColor #2");
	equal(rgbArrayCssColor([0,255,0]),"#00FF00", "rgbArrayCssColor #3");
	equal(rgbArrayCssColor([0,0,255]),"#0000FF", "rgbArrayCssColor #4");
	equal(rgbArrayCssColor([255,255,255]),"#FFFFFF", "rgbArrayCssColor #5");
	equal(rgbArrayCssColor([0xFF, 0xEB, 0xCD]),"#FFEBCD", "rgbArrayCssColor #6 BlanchedAlmond");
	equal(rgbArrayCssColor([ 0x77, 0x88, 0x99 ]),"#778899", "rgbArrayCssColor #7 LightSlateGray");

});

test( "cssColorToArray test",10, function() {
	
	deepEqual(cssColorToArray("#000000"),[0,0,0], "cssColorToArray #1");
	deepEqual(cssColorToArray("#FF0000"),[255,0,0], "cssColorToArray #2");
	deepEqual(cssColorToArray("#00FF00"),[0,255,0], "cssColorToArray #3");
	deepEqual(cssColorToArray("#0000FF"),[0,0,255], "cssColorToArray #4");
	deepEqual(cssColorToArray("#FFFFFF"),[255,255,255], "cssColorToArray #5");
	deepEqual(cssColorToArray("#FFEBCD"),[0xFF, 0xEB, 0xCD], "cssColorToArray #6 BlanchedAlmond");
	deepEqual(cssColorToArray("#778899"),[ 0x77, 0x88, 0x99 ], "cssColorToArray #7 LightSlateGray");

	deepEqual(cssColorToArray("notAColor"),[0, 0, 0], "cssColorToArray #8 not a color");
	deepEqual(cssColorToArray("BlanchedAlmond"),[0xFF, 0xEB, 0xCD], "cssColorToArray #9 BlanchedAlmond");
	deepEqual(cssColorToArray("LightSlateGray"),[ 0x77, 0x88, 0x99 ], "cssColorToArray #10 LightSlateGray");

});

test( "cssColorToHex test",10, function() {
	
	equal(cssColorToHex("#000000"),0x000000, "cssColorToArray #1");
	equal(cssColorToHex("#FF0000"),0xFF0000, "cssColorToArray #2");
	equal(cssColorToHex("#00FF00"),0x00FF00, "cssColorToArray #3");
	equal(cssColorToHex("#0000FF"),0x0000FF, "cssColorToArray #4");
	equal(cssColorToHex("#FFFFFF"),0xFFFFFF, "cssColorToArray #5");
	equal(cssColorToHex("#FFEBCD"),0xFFEBCD, "cssColorToArray #6 BlanchedAlmond");
	equal(cssColorToHex("#778899"),0x778899, "cssColorToArray #7 LightSlateGray");

	equal(cssColorToHex("notAColor"),0x000000, "cssColorToArray #8 not a color");
	equal(cssColorToHex("BlanchedAlmond"),0xFFEBCD, "cssColorToArray #9 BlanchedAlmond");
	equal(cssColorToHex("LightSlateGray"),0x778899, "cssColorToArray #10 LightSlateGray");

});

test( "rgbHexToCssColor test",7, function() {
	
	equal(rgbHexToCssColor(0x000000),"#000000", "rgbArrayCssColor #1");
	equal(rgbHexToCssColor(0xFF0000),"#FF0000", "rgbArrayCssColor #2");
	equal(rgbHexToCssColor(0x00FF00),"#00FF00", "rgbArrayCssColor #3");
	equal(rgbHexToCssColor(0x0000FF),"#0000FF", "rgbArrayCssColor #4");
	equal(rgbHexToCssColor(0xFFFFFF),"#FFFFFF", "rgbArrayCssColor #5");
	equal(rgbHexToCssColor(0xFFEBCD),"#FFEBCD", "rgbArrayCssColor #6 BlanchedAlmond");
	equal(rgbHexToCssColor(0x778899),"#778899", "rgbArrayCssColor #7 LightSlateGray");

});


// testing inverses
test( "rgbArrayToHex-rgbHexToArray test",7, function() {
	
	equal(rgbArrayToHex(rgbHexToArray(0x000000)),0x000000, "rgbArrayToHex-rgbHexToArray #1");
	equal(rgbArrayToHex(rgbHexToArray(0xFF0000)),0xFF0000, "rgbArrayToHex-rgbHexToArray #2");
	equal(rgbArrayToHex(rgbHexToArray(0x00FF00)),0x00FF00, "rgbArrayToHex-rgbHexToArray #3");
	equal(rgbArrayToHex(rgbHexToArray(0x0000FF)),0x0000FF, "rgbArrayToHex-rgbHexToArray #4");
	equal(rgbArrayToHex(rgbHexToArray(0xFFFFFF)),0xFFFFFF, "rgbArrayToHex-rgbHexToArray #5");
	equal(rgbArrayToHex(rgbHexToArray(0xFFEBCD)),0xFFEBCD, "rgbArrayToHex-rgbHexToArray #6 BlanchedAlmond");
	equal(rgbArrayToHex(rgbHexToArray(0x778899)),0x778899, "rgbArrayToHex-rgbHexToArray #7 LightSlateGray");

});

test( "rgbHexToArray-rgbArrayToHex test",7, function() {
	
	deepEqual(rgbHexToArray(rgbArrayToHex([0,0,0])),[0,0,0], "rgbHexToArray-rgbArrayToHex #1");
	deepEqual(rgbHexToArray(rgbArrayToHex([255,0,0])),[255,0,0], "rgbHexToArray-rgbArrayToHex #2");
	deepEqual(rgbHexToArray(rgbArrayToHex([0,255,0])),[0,255,0], "rgbHexToArray-rgbArrayToHex #3");
	deepEqual(rgbHexToArray(rgbArrayToHex([0,0,255])),[0,0,255], "rgbHexToArray-rgbArrayToHex #4");
	deepEqual(rgbHexToArray(rgbArrayToHex([255,255,255])),[255,255,255], "rgbHexToArray-rgbArrayToHex #5");
	deepEqual(rgbHexToArray(rgbArrayToHex([0xFF, 0xEB, 0xCD])),[0xFF, 0xEB, 0xCD], "rgbHexToArray-rgbArrayToHex #6 BlanchedAlmond");
	deepEqual(rgbHexToArray(rgbArrayToHex([ 0x77, 0x88, 0x99 ])),[ 0x77, 0x88, 0x99 ], "rgbHexToArray-rgbArrayToHex #7 LightSlateGray");

});


test( "rgbHexToCssColor-cssColorToHex test",7, function() {
	
	equal(rgbHexToCssColor(cssColorToHex("#000000")),"#000000", "rgbHexToCssColor-cssColorToHex #1");
	equal(rgbHexToCssColor(cssColorToHex("#FF0000")),"#FF0000", "rgbHexToCssColor-cssColorToHex #2");
	equal(rgbHexToCssColor(cssColorToHex("#00FF00")),"#00FF00", "rgbHexToCssColor-cssColorToHex #3");
	equal(rgbHexToCssColor(cssColorToHex("#0000FF")),"#0000FF", "rgbHexToCssColor-cssColorToHex #4");
	equal(rgbHexToCssColor(cssColorToHex("#FFFFFF")),"#FFFFFF", "rgbHexToCssColor-cssColorToHex #5");
	equal(rgbHexToCssColor(cssColorToHex("#FFEBCD")),"#FFEBCD", "rgbHexToCssColor-cssColorToHex #6 BlanchedAlmond");
	equal(rgbHexToCssColor(cssColorToHex("#778899")),"#778899", "rgbHexToCssColor-cssColorToHex #7 LightSlateGray");

});

test( "cssColorToHex-rgbHexToCssColor test",7, function() {
	
	equal(cssColorToHex(rgbHexToCssColor(0x000000)),0x000000, "cssColorToHex-rgbHexToCssColor #1");
	equal(cssColorToHex(rgbHexToCssColor(0xFF0000)),0xFF0000, "cssColorToHex-rgbHexToCssColor #2");
	equal(cssColorToHex(rgbHexToCssColor(0x00FF00)),0x00FF00, "cssColorToHex-rgbHexToCssColor #3");
	equal(cssColorToHex(rgbHexToCssColor(0x0000FF)),0x0000FF, "cssColorToHex-rgbHexToCssColor #4");
	equal(cssColorToHex(rgbHexToCssColor(0xFFFFFF)),0xFFFFFF, "cssColorToHex-rgbHexToCssColor #5");
	equal(cssColorToHex(rgbHexToCssColor(0xFFEBCD)),0xFFEBCD, "cssColorToHex-rgbHexToCssColor #6 BlanchedAlmond");
	equal(cssColorToHex(rgbHexToCssColor(0x778899)),0x778899, "cssColorToHex-rgbHexToCssColor #7 LightSlateGray");
});

test( "rgbArrayCssColor-cssColorToArray test",7, function() {
	
	equal(rgbArrayCssColor(cssColorToArray("#000000")),"#000000", "rgbArrayCssColor-cssColorToArray #1");
	equal(rgbArrayCssColor(cssColorToArray("#FF0000")),"#FF0000", "rgbArrayCssColor-cssColorToArray #2");
	equal(rgbArrayCssColor(cssColorToArray("#00FF00")),"#00FF00", "rgbArrayCssColor-cssColorToArray #3");
	equal(rgbArrayCssColor(cssColorToArray("#0000FF")),"#0000FF", "rgbArrayCssColor-cssColorToArray #4");
	equal(rgbArrayCssColor(cssColorToArray("#FFFFFF")),"#FFFFFF", "rgbArrayCssColor-cssColorToArray #5");
	equal(rgbArrayCssColor(cssColorToArray("#FFEBCD")),"#FFEBCD", "rgbArrayCssColor-cssColorToArray #6 BlanchedAlmond");
	equal(rgbArrayCssColor(cssColorToArray("#778899")),"#778899", "rgbArrayCssColor-cssColorToArray #7 LightSlateGray");

});
test( "cssColorToArray-rgbArrayCssColor test",7, function() {
	
	deepEqual(cssColorToArray(rgbArrayCssColor([0,0,0])),[0,0,0], "cssColorToArray #1");
	deepEqual(cssColorToArray(rgbArrayCssColor([255,0,0])),[255,0,0], "cssColorToArray #2");
	deepEqual(cssColorToArray(rgbArrayCssColor([0,255,0])),[0,255,0], "cssColorToArray #3");
	deepEqual(cssColorToArray(rgbArrayCssColor([0,0,255])),[0,0,255], "cssColorToArray #4");
	deepEqual(cssColorToArray(rgbArrayCssColor([255,255,255])),[255,255,255], "cssColorToArray #5");
	deepEqual(cssColorToArray(rgbArrayCssColor([0xFF, 0xEB, 0xCD])),[0xFF, 0xEB, 0xCD], "cssColorToArray #6 BlanchedAlmond");
	deepEqual(cssColorToArray(rgbArrayCssColor([ 0x77, 0x88, 0x99 ])),[ 0x77, 0x88, 0x99 ], "cssColorToArray #7 LightSlateGray");
});


//////////////
// posibly more tests
//hex--array--css
//hex--css--array
//array--hex--css
//array-css--hex
//css-hex--array
//css-array--hex
