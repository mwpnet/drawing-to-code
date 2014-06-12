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



function findTwoDrawItemsAroundPos( codeTree, pos ){
	
	//position.secondToLastDrawItem
	//position.lastDrawItem
	// position.identifier -- property name
	// position.assignment

	var pair = { 
			position: pos,
			start: undefined,
			end: undefined,
			prevDrawItem: undefined,
			drawItem: undefined,
			found: false
			};

	acorn.walk.simple( codeTree, {
		CallExpression: findLastTwoDrawItemsCallback
		},undefined,pair);

	return pair;
}

function findTwoDrawItemsAroundPosCallback(node, pair){
	if( position.found ){
		return;
	}
	
	if( node.type == "CallExpression" && node.callee.object.name == "context" ){
		if( node.callee.property.name == "stroke" || node.callee.property.name == "fill" ||
				node.callee.property.name == "strokeRect" || node.callee.property.name == "fillRect" ||node.callee.property.name == "clearRect" ||
				node.callee.property.name == "strokeText" || node.callee.property.name == "fillText"){

			if( position.ps <= node.callee.property.end ){
				position.drawItem = node;
				position.end = node.callee.end;
				position.found = true;
			}
			else {
				position.prevDrawItem = node;
				position.start = node.callee.end;
			}
			
			position.secondToLastDrawItem = position.lastDrawItem;
			position.lastDrawItem = node;
		}
	}
}


//finds the last and second to last drawing item
//for acorn.walk.simple( codeTree, {
//				CallExpression: findLastTwoDrawItemsCallback
//		},undefined,position);

function findLastTwoDrawItems( codeTree ){
	
	//position.secondToLastDrawItem
	//position.lastDrawItem
	// position.identifier -- property name
	// position.assignment

	var position = { 
			secondToLastDrawItem: undefined,
			lastDrawItem: undefined,
			lastNoneDrawItem: undefined
			};

	acorn.walk.simple( codeTree, {
		CallExpression: findLastTwoDrawItemsCallback
		},undefined,position);

	return position;
}


function findLastTwoDrawItemsCallback(node, position){
	//position.secondToLastDrawItem
	//position.lastDrawItem
	//position.lastNoneDrawItem
	
	if( node.type == "CallExpression" && node.callee.object.name == "context" ){
		if( node.callee.property.name == "stroke" || node.callee.property.name == "fill" ||
				node.callee.property.name == "strokeRect" || node.callee.property.name == "fillRect" ||node.callee.property.name == "clearRect" ||
				node.callee.property.name == "strokeText" || node.callee.property.name == "fillText"){
			position.secondToLastDrawItem = position.lastDrawItem;
			position.lastDrawItem = node;
		}
		else {
			position.lastNoneDrawItem = node;
		}
	}
}

/*********************************
*************************************/


function getProperty( property, defaultValue ){

	var code = getCode();
	var codeTree = acorn.parse( code);

	var position = findProperty( code, codeTree,property);

	var val = defaultValue;
	if( position.valuePart != undefined ){
		val = position.value;
	}
	return val;
}


function setCreateProperty(type,value,quote){ // type = lineCap, lineJoin, lilneWidth, miterLimit

	var newVal = value.toString();
	if(quote){
		newVal = "\"" + newVal + "\"";
	}
	
	var code = getCode();

	var codeTree = acorn.parse( code);

	var position = findProperty( code, codeTree, type);

	var newCode = code;
	
	if( position.valuePart != undefined ){
		newCode = code.substring(0,position.valuePart.start) + newVal + code.substring(position.valuePart.end);
	}
	else {
		var position2 = { 
				secondToLastDrawItem: undefined,
				lastDrawItem: undefined,
				lastNoneDrawItem: undefined
				};

		acorn.walk.simple( codeTree, {
			CallExpression: findLastTwoDrawItemsCallback
			},undefined,position2);
		newCode = code.substring(0,position2.lastDrawItem.start) + "\tcontext." + type + " = " + newVal + ";\n" + code.substring(position2.lastDrawItem.start);
	}

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);

}

function removeProperty(type){

	var code = getCode();

	var codeTree = acorn.parse( code);

	var position = findProperty( code, codeTree, type);

	var newCode = code;
	if( position.lineStart >=0 ){
		// the +1 is to try to handle the folowing semi-collen
		newCode = code.substring(0,position.assignment.start) + code.substring(position.assignment.end+1);
	}

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);
}


///////////////////////////////////////
//
function findProperty( code, codeTree, property ){ //codeSearch
	
	var position = { 
			identifier: property, // the identifier we're looking for
			assignment: undefined,
			valuePart: undefined,
			};

	acorn.walk.simple( codeTree, {
		AssignmentExpression: findPropertyCallBack
		},undefined,position);

	return position;
}


function findPropertyCallBack(node, position){
	
	// position.identifier -- property name
	// position.assignment
	// position.valuePart
	// position.value
	
	var identifier = position.identifier;
	
	if(node.type == "AssignmentExpression" && node.operator== "=" && node.left.type == "MemberExpression" && node.left.object.name == "context" ){
		if( identifier == undefined || node.left.property.name == identifier ){
			position.assignment = node;
			position.valuePart = node.right;
			
			if(node.right.type == "Literal"){
				position.value = node.right.value;
			}
			else if( node.right.type == "UnaryExpression" && node.right.argument.type == "Literal"){
				position.value = -node.right.argument.value;
			}
		}
	}
}

////////////////////////////////
//
function findAllPropertyFromTo( codeTree, fromTo ){ //codeSearch
	
	var position = { 
			identifiers: [],
			start: fromTo.start,
			end: fromTo.end,
			};

	acorn.walk.simple( codeTree, {
		AssignmentExpression: findAllPropertyFromToCallBack
		},undefined,position);

	return position;
}

function findAllPropertyFromToCallBack(node, position){
	
	if( node.end < position.start || position.end < node.start ){
		return;
	}

	if(node.type == "AssignmentExpression" && node.operator== "=" && node.left.type == "MemberExpression" && node.left.object.name == "context" ){
		var val;

		if( node.right.type == "Literal"){
			val = node.right.value;
		}
		else if( node.right.type == "UnaryExpression" && node.right.argument.type == "Literal"){
			val = -node.right.argument.value;
		}
		else {
			// not a literal value. don't store it
			return;
		}

		position.identifiers.push( [ node.left.property.name, val, node ] );
	}
}

//////////////////////////////////////
//
function endOfFunctonPosition(codeTree){
	return codeTree.end-1;
}


