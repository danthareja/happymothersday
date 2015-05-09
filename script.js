var canvas = document.getElementById('gameBoard');
var context = canvas.getContext('2d');

// Configuration 
// var movingWidth = canvas.width * .10;
// var workingWidth = canvas.width - 2 * movingWidth;



var makeMom = function (x, y) {
	var height = 25;
	var width = 25;
	var velocity = 5;

	var putOnCanvas = function () {
		context.fillStyle = "red";
		context.fillRect(x, y, width, height);
	}

	var moveLeft = function () {
		x -= velocity;
	}

	var moveRight = function () {
		x += velocity;
	}

	return {
		moveLeft: moveLeft,
		moveRight: moveRight,
		putOnCanvas: putOnCanvas
	};
}

var makeFamilyMember = function (x, y) {

	var height = 50;
	var width = 50;
	var velocity = -2;

	var putOnCanvas = function() {
		context.fillStyle = "green";
		context.fillRect(x, y, width, height);
	}

	var reverseDirection = function () {
		velocity *= (-1);
		console.log('direction was reversed, velocity now equals', velocity);
	}

	var isOnRightEdge = function () {
		return x + width === canvas.width;
	}

	var isOnLeftEdge = function () {
		return x === 0;
	}

	var move = function () {
		x += velocity;
	}
	return {
		putOnCanvas: putOnCanvas,
		reverseDirection: reverseDirection,
		isOnLeftEdge: isOnLeftEdge,
		isOnRightEdge: isOnRightEdge,
		move: move
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


var patrolTheSkies = function () {
	// Check if the right edge of family members hits edge of canvas
	if (familyMembers[4].isOnRightEdge()) {
		console.log('hey, listen! family just hit the right edge');
		familyMembers.forEach(function (member) {
			member.reverseDirection();
		});
	}	
	// Check if the left edge of family members hits edge of canvas
	else if (familyMembers[0].isOnLeftEdge()) {
		console.log('hey, listen! family just hit the left edge');
		familyMembers.forEach(function (member) {
			member.reverseDirection();
		});
	}

	familyMembers.forEach(function (member) {
		member.move();
		member.putOnCanvas();
	});
}

// This is the main run block that re-draws the canvas

var tick = function () {
	// Clears entire canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Re-paint based on updated positioning
	patrolTheSkies();
	mom.putOnCanvas();
	requestAnimationFrame(tick);
}


// Assign movement to keyboard

document.addEventListener('keydown', function (e) {
	e.preventDefault();
	if (e.keyCode === 37) {
		mom.moveLeft();
	}
	if (e.keyCode === 39) {
		mom.moveRight();
	}
})
tick();