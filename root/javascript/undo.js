

var undoStack = [];

// there are two places that undo/redo needs to watch:
// 	1: the canvise
//	2: the code edit area

// for the canves there ar:
//	a: new command added
//	b:existing command altered.

// for the code area, it has to work with the built in undo/redo functionality
