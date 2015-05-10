var canvas = document.getElementById('gameBoard');
var context = canvas.getContext('2d');

var makeMom = function (src, x, y) {
	var height = 50;
	var width = 50;
	var velocity = 15;
	var moving = false;

	var momImage = new Image();
	momImage.src = src;

	var putOnCanvas = function () {
		context.drawImage(momImage, x, y, height, width);
	}

	var stopMoving = function() {
		moving = false;
	}

	var moveLeft = function () {
		moving = true;
		velocity = -5;
	}

	var moveRight = function () {
		moving = true;
		velocity = 5;
	}

	var move = function() {
		if (moving) {
			x += velocity;
		}
	}

	var heal = function () {
		var newRay = makeHealingRay(x + (width/2),y);
		healingRays.push(newRay);
	}

	return {
		moveLeft: moveLeft,
		moveRight: moveRight,
		stopMoving: stopMoving,
		move: move,
		putOnCanvas: putOnCanvas,
		heal: heal
	};
}

var makeFamilyMember = function (src, x, y) {
	var height = 50;
	var width = 50;
	var velocity = -2;
	var saved = false;

	var familyMember = new Image();
	familyMember.src = src;

	var putOnCanvas = function() {
		if (!saved) {
			context.drawImage(familyMember, x, y, height, width);
		} else {
			familyMember.src = src.split('.jpg')[0] + '-saved.jpg';
			context.drawImage(familyMember, x, y, height, width);
		}
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
		if (!saved) {
			x += velocity;
		}
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

	var isSaved = function() {
		return saved;
	}

	var saveWithMomsLove = function() {
		var savedNoise = new Audio();
		savedNoise.src = './audio/saved.m4a';
		savedNoise.play();
		saved = true;
	}

	return {
		putOnCanvas: putOnCanvas,
		reverseDirection: reverseDirection,
		isOnLeftEdge: isOnLeftEdge,
		isOnRightEdge: isOnRightEdge,
		isSaved,
		move: move,
		getX: getX,
		getY: getY,
		getHeight: getHeight,
		getWidth: getWidth,
		getSrc: getSrc,
		saveWithMomsLove: saveWithMomsLove
	};
};

var healingRay = new Image();
healingRay.src = './images/heart.png'

var makeHealingRay = function (x, y) {
	var height = 15;
	var width = 15;
	var velocity = 8;

	var healingRaySound = new Audio();
	healingRaySound.src = './audio/pew.m4a';
	healingRaySound.play();

	var putOnCanvas = function() {
		context.drawImage(healingRay, x, y, height, width);
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

familyMembers.stillSomeToSave = function() {
	return this.filter(function(member) { return !member.isSaved()}).length > 0;
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
			if (didItCollide(ray, member) && !member.isSaved()) {
				member.saveWithMomsLove();
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
	if (familyMembers.stillSomeToSave()) {
		patrolTheSkies();
		mom.move();
		mom.putOnCanvas();
		beamMeUp();
		requestAnimationFrame(tick);
	} else {
		// We win!
		greatSuccess();
	}
}

var greatSuccess = function() {
	var victoryMessage = [
	  'You purged the zombie plague with your love',
	  'And there\'s still plenty to go around',
	  '',
	  'Happy Mother\'s Day!',
	  '<3 Boys'
	];

	var x = 50;
	var y = 150;
	var fontSize = 22;
	var gradient = context.createLinearGradient(x,y,x,y + victoryMessage.length * fontSize);

	gradient.addColorStop(0,"pink");
	gradient.addColorStop(1,"purple");
	context.fillStyle = gradient;
	context.font =  fontSize + 'px serif';

	victoryMessage.forEach(function(line) {
		context.fillText(line, x, y, canvas.width);
		y += fontSize;
	});

	var gameWonNoise = new Audio();
	gameWonNoise.src = './audio/winnerwinnerchickendinner.m4a';
	gameWonNoise.play();

	// Add mom for full effect	
	mom.putOnCanvas();
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

document.addEventListener('keyup', function(e) {
	if (e.keyCode === 37 || e.keyCode === 39) {
		mom.stopMoving();
	}
})

// Start zombie noise
var zombieNoise = new Audio();
zombieNoise.src = './audio/brains.m4a';
// zombieNoise.play();

// Kick off game loop;
tick();