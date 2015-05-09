var canvas = document.getElementById('gameBoard');
var context = canvas.getContext('2d');

// Configuration 
// var movingWidth = canvas.width * .10;
// var workingWidth = canvas.width - 2 * movingWidth;



var makeMom = function (src, x, y) {
	var height = 50;
	var width = 50;
	var velocity = 15;
	var mom = new Image();
	mom.src = src;

	var putOnCanvas = function () {
		context.drawImage(mom, x, y, height, width);
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

var makeFamilyMember = function (src, x, y) {
	var height = 50;
	var width = 50;
	var velocity = -2;
	var familyMember = new Image();
	familyMember.src = src;

	var putOnCanvas = function() {
		context.drawImage(familyMember, x, y, height, width);
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

	var getSrc = function() {
		return src;
	}

	var destroy = function() {
		familyMembers = familyMembers.filter(function(member) {
			return member.getSrc() !== src;
		});
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
		getWidth: getWidth,
		getSrc: getSrc,
		destroy: destroy
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

var mom = makeMom('./images/mom.jpg', canvas.width / 2 - .5 * 50, canvas.height - 50);
var familyMembers = [];
var healingRays = [];

// Initial Building the Board

// Crafty little way to get a array of randomized image sources
var familyPhotos = Array.apply(null, new Array(20))
  .map(function(x, i) { return './images/' + i + '.jpg' })
	.sort(function(a, b) { return Math.random() > 0.5 });

for (var y=0; y<4; y++) {
	for (var x=0; x<canvas.width; x+=canvas.width/5) {
		console.log(familyPhotos[familyPhotos.length - 1])
		familyMembers.push(makeFamilyMember(familyPhotos.pop(), x, y * 60));
	}
}

var patrolTheSkies = function () {
	var rightmost = familyMembers.reduce(function(rightMostMemberSoFar, currentMember) {
		if (currentMember.getX() > rightMostMemberSoFar.getX()) {
			rightMostMemberSoFar = currentMember;
		}
		return rightMostMemberSoFar;
	})
	var leftmost = familyMembers.reduce(function(leftMostMemberSoFar, currentMember) {
		if (currentMember.getX() < leftMostMemberSoFar.getX()) {
			leftMostMemberSoFar = currentMember;
		}
		return leftMostMemberSoFar;
	})
	// Check if the right edge of family members hits edge of canvas
	if (leftmost.isOnLeftEdge() || rightmost.isOnRightEdge()) {
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
				member.destroy();
				healingRays.shift();
			}
		})
		ray.move();
		ray.putOnCanvas();
	});
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
tick();