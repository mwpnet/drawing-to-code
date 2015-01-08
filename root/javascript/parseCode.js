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
	var pair = { 
			position: pos,
			start: undefined,
			end: undefined,
			prevDrawItem: undefined,
			drawItem: undefined,
			found: false
			};

	acorn.walk.simple( codeTree, {
		CallExpression: findTwoDrawItemsAroundPosCallback
		},undefined,pair);

	return pair;
}

function findTwoDrawItemsAroundPosCallback(node, pair){
	if( pair.found ){
		return;
	}
	
	if( node.type == "CallExpression" && node.callee.object.name == "context" ){
		if( node.callee.property.name == "stroke" || node.callee.property.name == "fill" ||
				node.callee.property.name == "strokeRect" || node.callee.property.name == "fillRect" ||node.callee.property.name == "clearRect" ||
				node.callee.property.name == "strokeText" || node.callee.property.name == "fillText"){

			if( pair.position <= node.callee.property.end ){
				pair.drawItem = node;
				pair.end = node.callee.end;
				pair.found = true;
			}
			else {
				pair.prevDrawItem = node;
				pair.start = node.callee.end;
			}
			
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

function getProperty( property, defaultValue, pos ){

	var code = getCode();
	var codeTree = acorn.parse( code);

	if( typeof pos == 'undefined' ){
		pos = editor.indexFromPos( editor.getCursor() );
	}

	var fromTo = findTwoDrawItemsAroundPos(codeTree, pos );
	
	var position = findProperty( code, codeTree,property, fromTo);

	var val = defaultValue;
	if( position.valuePart != undefined ){
		val = position.value;
	}
	return val;
}


function setCreateProperty(type,value,quote, pos){ // type = lineCap, lineJoin, lilneWidth, miterLimit

	var newVal = value.toString();
	if(quote){
		newVal = "\"" + newVal + "\"";
	}
	
	var code = getCode();

	var codeTree = acorn.parse( code);

	var cursor = editor.getCursor();
	if( typeof pos == 'undefined' ){
		pos = editor.indexFromPos( cursor );
	}

	var fromTo = findTwoDrawItemsAroundPos(codeTree, pos );

	var position = findProperty( code, codeTree, type, fromTo);

	var newCode = code;
	
	if( position.valuePart != undefined ){
		newCode = code.substring(0,position.valuePart.start) + newVal + code.substring(position.valuePart.end);
	}
	else {
		newCode = code.substring(0,fromTo.drawItem.start) + "context." + type + " = " + newVal + ";\n" + code.substring(fromTo.drawItem.start);
		var lineCh = editor.posFromIndex(fromTo.drawItem.start+1);
		editor.indentLine( lineCh.line, "prev");
		}

	updateCode(newCode);
	editor.setCursor(cursor);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);

}

function removeProperty( type, pos ){

	var code = getCode();

	var codeTree = acorn.parse( code);

	var cursor = editor.getCursor();
	if( typeof pos == 'undefined' ){
		pos = editor.indexFromPos( cursor );
	}

	var fromTo = findTwoDrawItemsAroundPos(codeTree, pos );

	var position = findProperty( code, codeTree, type, fromTo);

	var newCode = code;
	if( position.assignment.start >=0 ){
		// the +1 is to try to handle the folowing semi-collen
		newCode = code.substring(0,position.assignment.start) + code.substring(position.assignment.end+1);
	}

	updateCode(newCode);
	editor.setCursor(editor.posFromIndex(position.assignment.start));

	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);
}


///////////////////////////////////////
//
function findProperty( code, codeTree, property, fromTo ){ //codeSearch
	
	var position = { 
			identifier: property, // the identifier we're looking for
			assignment: undefined,
			valuePart: undefined,
			start: fromTo.start,
			end: fromTo.end
			};

	acorn.walk.simple( codeTree, {
		AssignmentExpression: findPropertyCallBack
		},undefined,position);

	return position;
}


function findPropertyCallBack(node, position){
	
	if( node.end < position.start || position.end < node.start ){
		return;
	}
	
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
			properties: [],
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

		position.properties.push( [ node.left.property.name, val, node ] );
	}
}

//////////////////////////////////////
//
function endOfFunctonPosition(codeTree){
	return codeTree.end-1;
}

//////////////////////////////////////
//
function findStatementStart(codeTree, pos){
	
	var start = { 
			position: pos,
			start: undefined,
			node:undefined,
			found: false,
			lastStart: undefined,
			lastEnd:undefined,
			};

	var found = acorn.walk.findNodeAround( codeTree, pos, 'ExpressionStatement' );
	if( typeof found != 'undefined'){
		start.node = found.node;
		start.start = found.node.start;
	}
	else {
		found =  acorn.walk.findNodeBefore(codeTree, pos, 'ExpressionStatement' );
		if( typeof found != 'undefined'){
			start.node = found.node;
			start.start = found.node.end;
		}
		else {
			found =  acorn.walk.findNodeAfter(codeTree, pos, 'ExpressionStatement' );
			if( typeof found != 'undefined'){
				start.node = found.node;
				start.start = found.node.start;
			}
			else {
				found = acorn.walk.findNodeAround( codeTree, pos, 'FunctionDeclaration' );
				start.node = found.node;
				start.start = found.node.body.body[ found.node.body.body.length-1  ].end;
			}
		}
	}
	return start;
}

