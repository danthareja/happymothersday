var canvas = document.getElementById('gameBoard');
var context = canvas.getContext('2d');

// Configuration 
// var movingWidth = canvas.width * .10;
// var workingWidth = canvas.width - 2 * movingWidth;



var makeMom = function (x, y) {
	var height = 25;
	var width = 25;
	var velocity = 15;

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

	var heal = function () {
		var newRay = makeHealingRay(x + (width/2),y);
		healingRays.push(newRay);
	}

	return {
		moveLeft: moveLeft,
		moveRight: moveRight,
		putOnCanvas: putOnCanvas,
		heal: heal
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

	var getX = function () {
		return x;
	}

	var getY = function () {
		return y;
	}

	var getHeight = function () {
		return height;
	}

	var getWidth = function () {
		return width;
	}

	return {
		putOnCanvas: putOnCanvas,
		reverseDirection: reverseDirection,
		isOnLeftEdge: isOnLeftEdge,
		isOnRightEdge: isOnRightEdge,
		move: move,
		getX: getX,
		getY: getY,
		getHeight: getHeight,
		getWidth: getWidth
	};
};

var makeHealingRay = function (x, y) {

	var height = 5;
	var width = 5;
	var velocity = 10;

	var putOnCanvas = function() {
		context.fillStyle = "yellow";
		context.fillRect(x, y, height, width);
	}

	var move = function () {
		y -= velocity;
	}

	var getX = function () {
		return x;
	}

	var getY = function () {
		return y;
	}

	var getHeight = function () {
		return height;
	}

	var getWidth = function () {
		return width;
	}

	return {
		putOnCanvas: putOnCanvas,
		move: move,
		getX: getX,
		getY: getY,
		getHeight: getHeight,
		getWidth: getWidth
	};
}

// Initial Building the Board

var mom = makeMom(canvas.width / 2 - .5 * 25, canvas.height - 25);
var familyMembers = [];
var healingRays = [];

for (var y=0; y<4; y++) {
	for (var x=0; x<canvas.width; x+=canvas.width/5) {
		familyMembers.push(makeFamilyMember(x, y * 60));
	}	
}



var patrolTheSkies = function () {
	// Check if the right edge of family members hits edge of canvas
	if (familyMembers[4].isOnRightEdge()) {
		familyMembers.forEach(function (member) {
			member.reverseDirection();
		});
	}	
	// Check if the left edge of family members hits edge of canvas
	else if (familyMembers[0].isOnLeftEdge()) {
		familyMembers.forEach(function (member) {
			member.reverseDirection();
		});
	}

	familyMembers.forEach(function (member) {
		member.move();
		member.putOnCanvas();
	});
}

var beamMeUp = function () {
	healingRays.forEach(function (ray) {
		if (ray.getY() < 0) {
			healingRays.shift();
		}

		familyMembers.forEach(function (member) {
			if (didItCollide(ray, member)) {
				console.log('ITS A hit!');
			}
		})
		ray.move();
		ray.putOnCanvas();
	})

}


var didItCollide = function (object1, object2) {
	return (object1.getX() < object2.getX() + object2.getWidth() && 
		object1.getX() + object1.getWidth()  > object2.getX() &&
		object1.getY() < object2.getY() + object2.getHeight() && 
		object1.getY() + object1.getHeight() > object2.getY()); 
}


// This is the main run block that re-draws the canvas

var tick = function () {
	// Clears entire canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Re-paint based on updated positioning
	patrolTheSkies();
	mom.putOnCanvas();
	beamMeUp();
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
	if (e.keyCode === 32) {
		mom.heal();
	}

})
// tick();