var canvas = document.getElementById('gameBoard');
var context = canvas.getContext('2d');

// Configuration 
// var movingWidth = canvas.width * .10;
// var workingWidth = canvas.width - 2 * movingWidth;



var makeMom = function (x, y) {
	var height = 25;
	var width = 25;

	var putOnCanvas = function () {
		context.fillStyle = "red";
		context.fillRect(x, y, width, height);
	}

	return {
		x: x,
		y: y,
		putOnCanvas: putOnCanvas
	};
}

var makeFamilyMember = function (x, y) {

	var height = 50;
	var width = 50;

	var putOnCanvas = function() {
		context.fillStyle = "green";
		context.fillRect(x, y, width, height);
	}

	return {
		x: x,
		y: y,
		putOnCanvas: putOnCanvas
	};
};

// Initial Building the Board

var mom = makeMom(canvas.width / 2 - .5 * 25, canvas.height - 25);
var familyMembers = [];

for (var y=0; y<4; y++) {
	for (var x=0; x<canvas.width; x+=canvas.width/5) {
		familyMembers.push(makeFamilyMember(x, y * 60));
	}	
}





// This is the main run block that re-draws the canvas

var tick = function () {
	// Clears entire canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Re-paint based on updated positioning
	familyMembers.forEach(function (member) {
		member.putOnCanvas();
	});
	mom.putOnCanvas();
	requestAnimationFrame(tick);
}

tick();