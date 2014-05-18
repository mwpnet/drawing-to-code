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



// finds the last and second to last drawing item
//   for acorn.walk.simple( codeTree, {
//					CallExpression: findLastTwoDrawItemsCallback
//			},undefined,position);

function findLastTwoDrawItemsCallback(node, position){
	//position.secondToLastDrawItem
	//position.lastDrawItem
	//position.lastNoneDrawItem
	
	if( node.type == "CallExpression" && node.callee.object.name == "context" ){
		if( node.callee.property.name == "stroke" || node.callee.property.name == "fill" ||
				node.callee.property.name == "strokeRect" || node.callee.property.name == "fillRect" ||
				node.callee.property.name == "strokeText" || node.callee.property.name == "fillText"){
			position.secondToLastDrawItem = position.lastDrawItem;
			position.lastDrawItem = node;
		}
		else {
			position.lastNoneDrawItem = node;
		}
	}
}

// find last assignment command and returns that node
//   for acorn.walk.simple( codeTree, {
//					AssignmentExpression: findAssignmentCallBack
//			},undefined,position);

function findAssignmentCallBack(node, position){
	
	// position.identifier -- property name
	// position.assignment
	// position.value
	
	var identifier = position.identifier;
	
	if(node.type == "AssignmentExpression" && node.operator== "=" && node.left.type == "MemberExpression" && node.left.object.name == "context" ){
		if( identifier == undefined || node.left.property.name == identifier ){
			position.assignment = node;
			position.rawValue = node.right;
			
			if(node.right.type == "Literal"){
				position.value = node.right.value;
			}
			else if( node.right.type == "UnaryExpression" && node.right.argument.type == "Literal"){
				position.value = -node.right.argument.value;
			}
		}
	}
}

function endOfFunctonPosition(codeTree){
	return codeTree.end-1;
}


