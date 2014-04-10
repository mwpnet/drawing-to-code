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


/**************************************
 * commands used to parse the given 
 * code and code lines, and reassemble 
 * them into new code
 *************************************/



function findStructure(codeTree){
	var structure={
			last:undefined,
			second:undefined,
			lastDraw:undefined
	};

	acorn.walk.simple( codeTree, {
		Expression: findLastTwoDrawItemsCallBack
		},undefined,structure);

	return structure;
}

/*********************************************
 * ***************************
 * 
 */
///////////////////////////////////////
// find the last two drawing elements
//
// used to find where in the code new code lines should be added.
function findLastTwoDrawItems(codeTree){
	var pair = {
			last:undefined,
			second:undefined,
			finishing:false,
			finished:false
	};

	acorn.walk.simple( codeTree, {
		Expression: findLastTwoDrawItemsCallBack
		},undefined,pair);

	return pair;
}

function findLastTwoDrawItemsCallBack(node, pair){
		
	if( node.type == "CallExpression"){
		if( node.callee.object.name == "context" ){
			if( node.callee.property.name == "stroke" || 
					node.callee.property.name == "fill" || 
					node.callee.property.name == "strokeText" || 
					node.callee.property.name == "fillText" || 
					node.callee.property.name == "strokeRect" || 
					node.callee.property.name == "fillRect" || 
					node.callee.property.name == "clearRect" ){
				pair.second = pair.last;
				pair.last = node;
			}
		}
	}
}


/////////////////////////////////////////
// finds the last node before the last drawing item
//
// used to find the position to add more code lines
function findLastNonDrawItem(codeTree){

	var line = {
			node:undefined
	};

	acorn.walk.simple( codeTree, {
		Expression: getPosToInsertAtCallBack
		},undefined,line);

	return line.node;
}

function findLastNonDrawItemCallback(node, line){

	if(node.type == "AssignmentExpression" && node.operator== "=" && node.left.type == "MemberExpression" ){
		if( node.left.object.name == "context"){
			line.node=node;
		}
	}
	if( node.type == "CallExpression"){
		if( node.callee.object.name == "context" ){
			if( node.callee.property.name != "stroke" && 
					node.callee.property.name != "fill" && 
					node.callee.property.name != "strokeText" && 
					node.callee.property.name != "fillText"&&
					node.callee.property.name != "strokeRect" && 
					node.callee.property.name != "fillRect" &&
					node.callee.property.name != "clearRect" ){
				line.node=node;
			}
		}
	}

}


///////////////////////////////////
// finds the property after the second to last draw item
//
// used to find property to be edited
function findProperty( codeTree, name, pair){
	
	var property = { 
			identifier: name, // the identifier we're looking for
			pair:pair,
			startLooking:false,
			
			start:-1, // the start and end of the value to be replaced
			end:-1,
			lineStart:-1,  // the start and end of the line for this identifier
			lineEnd:-1,     // used when deleating a line
			node:undefined
			};

	acorn.walk.simple( codeTree, {
		AssignmentExpression: codeSearchCallback
		},undefined,property);

	return property;
}

function findPropertyCallback(node, property){
	
	if( property.startLooking || node == property.pair.second){
		property.startLooking=true;
		
		if(node.type == "AssignmentExpression" && node.operator== "=" && node.left.type == "MemberExpression" ){
			if( node.left.object.name == "context" && node.left.property.name == property.name){
				if(node.right.type == "Literal"){
					property.node = node;
					property.start = node.right.start;
					property.end = node.right.end;
					
					property.lineStart = node.start;
					property.lineEnd = node.end;
				}
			}
		}
	}
}
