var shadowInfo = {};

function initShadowProp() {
	shadowInfo.shadowOffsetX = document.getElementById('shadowOffsetXInput');
	shadowInfo.shadowOffsetY = document.getElementById('shadowOffsetYInput');
	shadowInfo.shadowBlur = document.getElementById('shadowBlurInput');

	var offsetX = getShadowOffset("shadowOffsetX");
	shadowInfo.shadowOffsetX.value=offsetX;
	
	var offsetY = getShadowOffset("shadowOffsetY");
	shadowInfo.shadowOffsetY.value=offsetY;
	
	var offsetY = getShadowOffset("shadowBlur");
	shadowInfo.shadowBlur.value=offsetY;
	
}

///////////////////////
// shadow offset
function changeShadowOffsetX(){
	var width = shadowInfo.shadowOffsetX.value;

	setCreateProperty("shadowOffsetX",width,false);
}

function changeShadowOffsetY(){
	var width = shadowInfo.shadowOffsetY.value;

	setCreateProperty("shadowOffsetY",width,false);
}

function changeShadowBlur(){
	var width = shadowInfo.shadowBlur.value;

	setCreateProperty("shadowBlur",width,false);
}

function incDecShadowX(incDec){

	var width = parseInt( shadowInfo.shadowOffsetX.value );
	var newWidth = width + incDec;
	shadowInfo.shadowOffsetX.value = newWidth;

	setCreateProperty("shadowOffsetX",newWidth,false);
}

function incDecShadowY(incDec){

	var width = parseInt( shadowInfo.shadowOffsetY.value );
	var newWidth = width + incDec;
	shadowInfo.shadowOffsetY.value = newWidth;

	setCreateProperty("shadowOffsetY",newWidth,false);
}

function incDecShadowBlur(incDec){

	var blur = parseInt( shadowInfo.shadowBlur.value );
	var newBlur = blur + incDec;
	if(newBlur<0){
		newBlur=0;
	}
	shadowInfo.shadowBlur.value = newBlur;

	setCreateProperty("shadowBlur",newBlur,false);
}


function getShadowOffset( property ){
	return getProperty( property, 0);
}

function updateShadowOffsetX(){
	shadowInfo.shadowOffsetX.value = getShadowOffset("shadowOffsetX");
}

function updateShadowOffsetY(){
	shadowInfo.shadowOffsetY.value = getShadowOffset("shadowOffsetY");
}

function updateShadowOffsetY(){
	shadowInfo.shadowBlur.value = getShadowOffset("shadowBlur");
}

