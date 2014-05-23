var fontInfo = {
		font:{
			element:undefined,
		},
		textAlign: {
			left:{
				element: undefined,
				canvas: undefined
			},
			center:{
				element: undefined,
				canvas: undefined
			},
			right:{
				element: undefined,
				canvas: undefined
			},
			start:{
				element: undefined,
				canvas: undefined
			},
			end:{
				element: undefined,
				canvas: undefined
			}
		},
		textBaseline:{
			alphabetic:{
				element: undefined,
				canvas: undefined
			},
			top:{
				element: undefined,
				canvas: undefined
			},
			hanging:{
				element: undefined,
				canvas: undefined
			},
			middle:{
				element: undefined,
				canvas: undefined
			},
			ideographic:{
				element: undefined,
				canvas: undefined
			},
			bottom:{
				element: undefined,
				canvas: undefined
			}
		}

};

/////////////////////////
// button stuff

function initFontProp() {
	fontInfo.textAlign.left.element = document.getElementById('textAlignLeft');
	fontInfo.textAlign.center.element = document.getElementById('textAlignCenter');
	fontInfo.textAlign.right.element = document.getElementById('textAlignRight');
	fontInfo.textAlign.start.element = document.getElementById('textAlignStart');
	fontInfo.textAlign.end.element = document.getElementById('textAlignEnd');

	fontInfo.textBaseline.alphabetic.element = document.getElementById('textBaselineStyleBoxAlphabetic');
	fontInfo.textBaseline.top.element = document.getElementById('textBaselineStyleBoxTop');
	fontInfo.textBaseline.hanging.element = document.getElementById('textBaselineStyleBoxHanging');
	fontInfo.textBaseline.middle.element = document.getElementById('textBaselineStyleBoxMiddle');
	fontInfo.textBaseline.ideographic.element = document.getElementById('textBaselineStyleBoxIdeographic');
	fontInfo.textBaseline.bottom.element = document.getElementById('textBaselineStyleBoxBottom');

	//fontInfo.lineCapNoneCanvas = lineInfo.lineCapNoneElement.getContext('2d');
	fontInfo.textAlign.left.canvas = fontInfo.textAlign.left.element.getContext('2d');
	fontInfo.textAlign.center.canvas = fontInfo.textAlign.center.element.getContext('2d');
	fontInfo.textAlign.right.canvas = fontInfo.textAlign.right.element.getContext('2d');
	fontInfo.textAlign.start.canvas = fontInfo.textAlign.start.element.getContext('2d');
	fontInfo.textAlign.end.canvas = fontInfo.textAlign.end.element.getContext('2d');

	fontInfo.textBaseline.alphabetic.canvas = fontInfo.textBaseline.alphabetic.element.getContext('2d');
	fontInfo.textBaseline.top.canvas = fontInfo.textBaseline.top.element.getContext('2d');
	fontInfo.textBaseline.hanging.canvas = fontInfo.textBaseline.hanging.element.getContext('2d');
	fontInfo.textBaseline.middle.canvas = fontInfo.textBaseline.middle.element.getContext('2d');
	fontInfo.textBaseline.ideographic.canvas = fontInfo.textBaseline.ideographic.element.getContext('2d');
	fontInfo.textBaseline.bottom.canvas = fontInfo.textBaseline.bottom.element.getContext('2d');

	drawTextAlign(fontInfo.textAlign.left.canvas,"left");
	drawTextAlign(fontInfo.textAlign.center.canvas,"center");
	drawTextAlign(fontInfo.textAlign.right.canvas,"right");
	drawTextAlign(fontInfo.textAlign.start.canvas,"start");
	drawTextAlign(fontInfo.textAlign.end.canvas,"end");

	drawTextBaseline(fontInfo.textBaseline.alphabetic.canvas,"alphabetic");
	drawTextBaseline(fontInfo.textBaseline.top.canvas,"top");
	drawTextBaseline(fontInfo.textBaseline.hanging.canvas,"hanging");
	drawTextBaseline(fontInfo.textBaseline.middle.canvas,"middle");
	drawTextBaseline(fontInfo.textBaseline.ideographic.canvas,"ideographic");
	drawTextBaseline(fontInfo.textBaseline.bottom.canvas,"bottom");

	fontInfo.font.element = document.getElementById('fontInput');;
	
}

function drawTextAlign(canvas,type){
	canvas.beginPath();

	canvas.moveTo(100,0);
	canvas.lineTo(100,30);
	canvas.moveTo(80,15);
	canvas.lineTo(120,15);
	canvas.lineWidth=1;
	canvas.strokeStyle="red";
	canvas.stroke();

	canvas.strokeStyle="black";
	canvas.textAlign = type;
	canvas.textBaseline = "alphabetic"; 
	canvas.fillText("Text read Left to Right",100,15);
	// add this when start and end are properly supported
	//canvas.fillText("قراءة النص من اليمين إلى اليسار",100,20);
}

function drawTextBaseline(canvas,type){
	canvas.beginPath();

	canvas.moveTo(10,0);
	canvas.lineTo(10,30);
	canvas.moveTo(10,15);
	canvas.lineTo(50,15);
	canvas.lineWidth=1;
	canvas.strokeStyle="red";
	canvas.stroke();

	canvas.strokeStyle="black";
	canvas.textAlign = "start";
	canvas.textBaseline = type; 

	canvas.fillText("Text read Left to Right",10,15);
	// add this when start and end are properly supported
	//canvas.fillText("قراءة النص من اليمين إلى اليسار",100,20);
}


function changeFont(){
	var newFont = fontInfo.font.element.value;
	setCreateProperty("font",newFont,true);
}
