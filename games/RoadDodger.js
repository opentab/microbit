function onStart(  ) {
	// Config
	globals.config_initialCarColumn = 2;
	globals.config_initialObstacleColumn = 2;
	globals.config_initialObstacleSpeed = 1000;
	
	// globals
	globals.speed = globals.config_initialObstacleSpeed;
	globals.obstacleY = 0;
	globals.obstacleTimeout = 0;
	globals.collision = false;
	globals.dodged = 0;
	
	// Initial set up
	this.initialBoardState();
	this.drawInitialObstacleColumn();
	
	// Run!
	while (true) {
		var pressedA = microbit.buttonAPressed;
		var pressedB = microbit.buttonBPressed;
		
		if (pressedA) {
			this.moveCarLeft();
		}
		
		if (pressedB) {
			this.moveCarRight();
		}
		
		if(!globals.collision) {
			this.drawObstacleMovement();
		}
		
		this.detectCollision();
		
		if(globals.collision) {
			globals.obstacleTimeout = 0;
			this.drawExplosion();
		}
		
		globals.obstacleTimeout = globals.obstacleTimeout + 50;
		wait(25);
	}

}

function drawInitialObstacleColumn() {
	globals.obstacleColumn = globals.config_initialObstacleColumn;
	microbit.on(globals.obstacleColumn, globals.obstacleY);
}

function drawObstacleMovement() {
	if(globals.obstacleTimeout > globals.speed) {
		globals.obstacleTimeout = 0;
		microbit.off(globals.obstacleColumn, globals.obstacleY);
		
		globals.obstacleY = globals.obstacleY + 1;
		
		if(globals.obstacleY < 5) {
			microbit.on(globals.obstacleColumn, globals.obstacleY);
		}
		
		if(globals.obstacleY >= 5) {
			this.increaseSpeed();
			globals.dodged = globals.dodged + 1;
			globals.obstacleY = 0;
			globals.obstacleColumn = Random.number(1, 3);
			microbit.on(globals.obstacleColumn, globals.obstacleY);
		}
	}
}

function increaseSpeed() {
	if(globals.speed >= 200) {
		globals.speed = globals.speed - 100;
	}
}

function detectCollision() {
	if(globals.obstacleColumn == globals.carColumn &&
		(globals.obstacleY == 3 || globals.obstacleY == 4)) {
		globals.collision = true;
	}
}

function initialBoardState(  ) {
	var i = 0;
	// Draw lines down both sides
	while (i < 5) {
		
		microbit.on(0, i);
		microbit.on(4, i);
		i = i + 1;
		
	}
	
	globals.carColumn = globals.config_initialCarColumn;
	this.drawCar();
}

function drawCar(  ) {
	microbit.on(globals.carColumn, 3);
	microbit.on(globals.carColumn, 4);
}

function clearCar(  ) {
	microbit.off(globals.carColumn, 3);
	microbit.off(globals.carColumn, 4);
}

function moveCarLeft(  ) {
	this.clearCar();
	
	if (( globals.carColumn > 1 ) && ( globals.carColumn <= 3 )) {
		globals.carColumn = globals.carColumn - 1;
	}
	
	this.drawCar();
}

function moveCarRight(  ) {
	this.clearCar();
	
	if (( globals.carColumn < 3 ) && ( globals.carColumn >= 1 )) {
		globals.carColumn = globals.carColumn + 1;
	}
	
	this.drawCar();
}

function drawExplosion() {
	var phrase = globals.dodged + " obstacles dodged!";
	microbit.clear();
	microbit.say(phrase);
}
