// take initial time stamp
let prevTime = performance.now();

let end;
let path = false;
let size;
let crumbs = true;
let crumbLocations;
let wasHere;
let correctPath;
let maze;// = generateMaze(size);
let player;// = {x:0,y:0};
let move = false;
var canvas;
var context;

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

gameLoop(prevTime);

function newMaze(s) {
	size = s;
	let game = document.getElementById('game');
	game.innerHTML = '<canvas id=\'myCanvas\' width=\'500\' height=\'500\'></canvas>';
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');
	maze = generateMaze(size);
	player = {x:0,y:0};
	path = false;
}

function endMaze() {
	context = false;
	let game = document.getElementById('game');
	game.innerHTML = '<div class=\'choose-maze\'><div>Select Maze Size</div><input type=\'button\' value=\'5x5\' onClick=\'newMaze(5)\'><input type=\'button\' value=\'10x10\' onClick=\'newMaze(10)\'><input type=\'button\' value=\'15x15\' onClick=\'newMaze(15)\'><input type=\'button\' value=\'20x20\' onClick=\'newMaze(20)\'>';
}

function shortestPath() {
	
	shortestPathRecursive(0, 0);
	console.log(correctPath);
}

function shortestPathRecursive(x, y) {
	if (x === end.x && y === end.y) {
		return true;
	}
	if (maze[y][x] === 'wall' || wasHere[y][x]) {
		return false;
	}
	wasHere[y][x] = true;
	if (x !== 0) {
		if (shortestPathRecursive(x-1, y)) {
			correctPath[y][x] = true;
			return true;
		}
	}
	if (x !== size-1) {
		if (shortestPathRecursive(x+1, y)) {
			correctPath[y][x] = true;
			return true;
		}
	}
	if (y !== 0) {
		if (shortestPathRecursive(x, y-1)) {
			correctPath[y][x] = true;
			return true;
		}
	}
	if (y !== size-1) {
		if (shortestPathRecursive(x, y+1)) {
			correctPath[y][x] = true;
			return true;
		}
	}
	return false;
}

function gameLoop(timeStamp) {
	elapsedTime = timeStamp - prevTime;
	prevTime = timeStamp;

	processInput();
	update(elapsedTime);
	render();

	requestAnimationFrame(gameLoop);
}

// performs all the updating of events; it must not do any display
function update() {
}

function processInput() {

	// if keypress
	if (move === 'up') {
		if (player.y-1 > -1 && (maze[player.y-1][player.x] === 'floor' || maze[player.y-1][player.x] === 'end' || maze[player.y-1][player.x] === 'crumb' || maze[player.y-1][player.x] === 'path')) {
			if (maze[player.y-1][player.x] === 'end') {
				endMaze();
			}
			if (crumbs) {
				maze[player.y][player.x] = 'crumb';// TODO toggle
			}
			else {
				maze[player.y][player.x] = 'floor';// TODO toggle
			}
			crumbLocations[player.y][player.x] = true;
			player.y--;
			maze[player.y][player.x] = 'player';
			move = true;
		}
	}
	else if (move === 'down') {
		if (player.y+1 < size && (maze[player.y+1][player.x] === 'floor' || maze[player.y+1][player.x] === 'end' || maze[player.y+1][player.x] === 'crumb' || maze[player.y+1][player.x] === 'path')) {
			if (maze[player.y+1][player.x] === 'end') {
				endMaze();
			}
			if (crumbs) {
				maze[player.y][player.x] = 'crumb';// TODO toggle
			}
			else {
				maze[player.y][player.x] = 'floor';// TODO toggle
			}
			crumbLocations[player.y][player.x] = true;
			player.y++;
			maze[player.y][player.x] = 'player';
			move = true;
		}
	}
	else if (move === 'left') {
		if (player.x-1 > -1 && (maze[player.y][player.x-1] === 'floor' || maze[player.y][player.x-1] === 'end' || maze[player.y][player.x-1] === 'crumb' || maze[player.y][player.x-1] === 'path')) {
			if (maze[player.y][player.x-1] === 'end') {
				endMaze();
			}
			if (crumbs) {
				maze[player.y][player.x] = 'crumb';// TODO toggle
			}
			else {
				maze[player.y][player.x] = 'floor';// TODO toggle
			}
			crumbLocations[player.y][player.x] = true;
			player.x--;
			maze[player.y][player.x] = 'player';
			move = true;
		}
	}
	else if (move === 'right') {
		if (player.x+1 < size && (maze[player.y][player.x+1] === 'floor' || maze[player.y][player.x+1] === 'end' || maze[player.y][player.x+1] === 'crumb' || maze[player.y][player.x+1] === 'path')) {
			if (maze[player.y][player.x+1] === 'end') {
				endMaze();
			}
			if (crumbs) {
				maze[player.y][player.x] = 'crumb';// TODO toggle
			}
			else {
				maze[player.y][player.x] = 'floor';// TODO toggle
			}
			crumbLocations[player.y][player.x] = true;
			player.x++;
			maze[player.y][player.x] = 'player';
			move = true;
		}
	}

}

//reports to the display any events that require reporting; no updating of data structure
function render() {

	// clear canvas and redraw every frame
	if (context) {
		context.clearRect(0, 0, canvas.width, canvas.height);

		let scale = 500 / size;

		// Draw Maze
		for (let i = 0; i < maze.length; i++) {
			for (let j = 0; j < maze[i].length; j++) {
				if (maze[i][j] === 'floor') {
					context.fillStyle='#FFFFFF';
				}
				else if (maze[i][j] === 'wall') {
					context.fillStyle='#000000';
				}
				else if (maze[i][j] === 'player') {
					context.fillStyle='#146e87';
				}
				else if (maze[i][j] === 'end') {
					context.fillStyle='#d32a43';
				}
				else if (maze[i][j] === 'crumb') {
					context.fillStyle='#eab84d';
				}
				else if (maze[i][j] === 'path') {
					context.fillStyle='#409649';
				}
				context.fillRect(j*scale,i*scale,scale,scale);
			}
		}
	}
}

function onKeyDown(e) {
	if (move === false) {
		if (e.key === 'w' || e.key === 'i') {
			move = 'up';
		}
		if (e.key === 's' || e.key === 'k') {
			move = 'down';
		}
		if (e.key === 'a' || e.key === 'j') {
			move = 'left';
		}
		if (e.key === 'd' || e.key === 'l') {
			move = 'right';
		}
	}
	if (e.key === 'b') {
		if (crumbs) {
			crumbs = false;
			// replace all crumbs with floor
			for (let i = 0; i < maze.length; i++) {
				for (let j = 0; j < maze[i].length; j++) {
					if (maze[i][j] === 'crumb') {
						maze[i][j] = 'floor';
					}
				}
			}
		}
		else {
			crumbs = true;
			// replace crumbs in maze
			for (let i = 0; i < crumbLocations.length; i++) {
				for (let j = 0; j < crumbLocations[i].length; j++) {
					if (crumbLocations[i][j]) {
						maze[i][j] = 'crumb';
					}
				}
			}
		}
	}
	if (e.key === 'p') {
		if (!path) {
			path = true;
			shortestPath();
			for (let i = 0; i < correctPath.length; i++) {
				for (let j = 0; j < correctPath[i].length; j++) {
					if (correctPath[i][j]) {
						if (maze[i][j] === 'floor') {
							maze[i][j] = 'path';
						}
					}
				}
			}
		}
		else if (path) {
			path = false;
			for (let i = 0; i < maze.length; i++) {
				for (let j = 0; j < maze[i].length; j++) {
					if (maze[i][j] === 'path') {
						maze[i][j] = 'floor';
					}
				}
			}
		}
	}
}

function onKeyUp(e) {
	if (e.key === 'w' || e.key === 'i') {
		move = false;
	}
	if (e.key === 's' || e.key === 'k') {
		move = false;
	}
	if (e.key === 'a' || e.key === 'j') {
		move = false;
	}
	if (e.key === 'd' || e.key === 'l') {
		move = false;
	}
}

// Prim's maze generation algorithm
function generateMaze(size) {

	// Start with an grid full of unvisited cells
	let maze = [];
	crumbLocations = [];
	wasHere = [];
	correctPath = [];
	for (let i = 0; i < size; i++) {
		maze.push([]);
		crumbLocations.push([]);
		wasHere.push([]);
		correctPath.push([]);
		for (let j = 0; j < size; j++) {
			maze[i].push('void');
			crumbLocations[i].push(false);
			wasHere[i].push(false);
			correctPath[i].push(false);
		}
	}

	// Pick a starting cell
	let cell = {
		x: 0,
		y: 0
	};


	// Mark as passage
	maze[cell.y][cell.x] = 'floor';

	// Initialize list of cells with vision, just used to track when maze is complete, and for random selection
	let vision = [];

	// Set vision on adjacent cells
	if (cell.y+1 < size) {
		maze[cell.y+1][cell.x] = 'vision';
		vision.push({x: cell.x, y: cell.y+1});
	}
	if (cell.x+1 < size) {
		maze[cell.y][cell.x+1] = 'vision';
		vision.push({x: cell.x+1, y: cell.y});
	}
	if (cell.y-1 > -1) {
		maze[cell.y-1][cell.x] = 'vision';
		vision.push({x: cell.x, y: cell.y-1});
	}
	if (cell.x-1 > -1) {
		maze[cell.y][cell.x-1] = 'vision';
		vision.push({x: cell.x-1, y: cell.y});
	}

	// While there are still unvisited cells with vision
	while (vision.length > 0) {

		// Select a random cell with vision
		let random = Math.floor(Math.random() * vision.length);
		let randomCell = vision[random];

		// Check all adjacent cells to randomCell for floors
		let floorCount = 0;
		if (randomCell.y+1 < size) {
			if (maze[randomCell.y+1][randomCell.x] === 'floor') {
				floorCount++;
				if (randomCell.x+1 < size) {
					if (maze[randomCell.y+1][randomCell.x+1] === 'floor') {
						floorCount--;
					}
				}
				if (randomCell.x-1 > -1) {
					if (maze[randomCell.y+1][randomCell.x-1] === 'floor') {
						floorCount--;
					}
				}
			}
			else {
				if (randomCell.x+1 < size) {
					if (maze[randomCell.y+1][randomCell.x+1] === 'floor') {
						floorCount++;
					}
				}
				if (randomCell.x-1 > -1) {
					if (maze[randomCell.y+1][randomCell.x-1] === 'floor') {
						floorCount++;
					}
				}
			}
		}
		if (randomCell.x+1 < size) {
			if (maze[randomCell.y][randomCell.x+1] === 'floor') {
				floorCount++;
				if (randomCell.y+1 < size) {
					if (maze[randomCell.y+1][randomCell.x+1] === 'floor') {
						floorCount--;
					}
				}
				if (randomCell.y-1 > -1) {
					if (maze[randomCell.y-1][randomCell.x+1] === 'floor') {
						floorCount--;
					}
				}
			}
			else {
				if (randomCell.y+1 < size) {
					if (maze[randomCell.y+1][randomCell.x+1] === 'floor') {
						floorCount++;
					}
				}
				if (randomCell.y-1 > -1) {
					if (maze[randomCell.y-1][randomCell.x+1] === 'floor') {
						floorCount++;
					}
				}
			}
		}
		if (randomCell.y-1 > -1) {
			if (maze[randomCell.y-1][randomCell.x] === 'floor') {
				floorCount++;
				if (randomCell.x+1 < size) {
					if (maze[randomCell.y-1][randomCell.x+1] === 'floor') {
						floorCount--;
					}
				}
				if (randomCell.x-1 > -1) {
					if (maze[randomCell.y-1][randomCell.x-1] === 'floor') {
						floorCount--;
					}
				}
			}
			else {
				if (randomCell.x+1 < size) {
					if (maze[randomCell.y-1][randomCell.x+1] === 'floor') {
						floorCount++;
					}
				}
				if (randomCell.x-1 > -1) {
					if (maze[randomCell.y-1][randomCell.x-1] === 'floor') {
						floorCount++;
					}
				}
			}
		}
		if (randomCell.x-1 > -1) {
			if (maze[randomCell.y][randomCell.x-1] === 'floor') {
				floorCount++;
				if (randomCell.y+1 < size) {
					if (maze[randomCell.y+1][randomCell.x-1] === 'floor') {
						floorCount--;
					}
				}
				if (randomCell.y-1 > -1) {
					if (maze[randomCell.y-1][randomCell.x-1] === 'floor') {
						floorCount--;
					}
				}
			}
			else {
				if (randomCell.y+1 < size) {
					if (maze[randomCell.y+1][randomCell.x-1] === 'floor') {
						floorCount++;
					}
				}
				if (randomCell.y-1 > -1) {
					if (maze[randomCell.y-1][randomCell.x-1] === 'floor') {
						floorCount++;
					}
				}
			}
		}

		// if only one adjacent floor
		if (floorCount === 1) {
			// Remove randomCell from vision
			vision.splice(random, 1);
			// Set randomCell to a floor cell
			maze[randomCell.y][randomCell.x] = 'floor';
			// Update final floor cell
			end = {
				x: randomCell.x,
				y: randomCell.y
			};

			// Update vision
			if (randomCell.y+1 < size) {
				if (maze[randomCell.y+1][randomCell.x] === 'void') {
					maze[randomCell.y+1][randomCell.x] = 'vision';
					vision.push({x: randomCell.x, y: randomCell.y+1});
				}
			}
			if (randomCell.x+1 < size) {
				if (maze[randomCell.y][randomCell.x+1] === 'void') {
					maze[randomCell.y][randomCell.x+1] = 'vision';
					vision.push({x: randomCell.x+1, y: randomCell.y});
				}
			}
			if (randomCell.y-1 > -1) {
				if (maze[randomCell.y-1][randomCell.x] === 'void') {
					maze[randomCell.y-1][randomCell.x] = 'vision';
					vision.push({x: randomCell.x, y: randomCell.y-1});
				}
			}
			if (randomCell.x-1 > -1) {
				if (maze[randomCell.y][randomCell.x-1] === 'void') {
					maze[randomCell.y][randomCell.x-1] = 'vision';
					vision.push({x: randomCell.x-1, y: randomCell.y});
				}
			}
		}
		else {
			// Remove randomCell from vision
			vision.splice(random, 1);
			// Set randomCell to wall cell
			maze[randomCell.y][randomCell.x] = 'wall';
		}
	}

	// Set start and end locations
	maze[0][0] = 'player';
	maze[end.y][end.x] = 'end';
	
	return maze;
}
