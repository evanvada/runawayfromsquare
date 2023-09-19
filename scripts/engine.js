// configuration canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// configuration pour pixel art (après redimensionnement du canvas)
ctx.scale(1,1);
ctx.imageSmoothingEnabled = false;

// temps
var upc = 0;

// copie d'objet
function json_copy(src) {
	return JSON.parse(JSON.stringify(src));
}

// inputs et évenements
var key = {};
var mouse = {x:0, y:0, left:false, right:false, middle:false};
var last_key = json_copy(key);
var last_mouse = json_copy(mouse);
document.addEventListener('keyup', keyUpListener);
document.addEventListener('keydown', keyDownListener);
document.addEventListener('keypress', keyPressListener);
document.addEventListener('mousemove', mouseMoveListener);
document.addEventListener('mouseup', mouseUpListener);
document.addEventListener('mousedown', mouseDownListener);
document.addEventListener('wheel', mouseWheelListener);

// boucle de jeu
function gameLoop() {
	last_key = json_copy(key)
	last_mouse = json_copy(mouse)
	upc++;
	requestAnimationFrame(update);
	requestAnimationFrame(gameLoop);
}

// évenements
function reactKeyPress(e) {}
function keyPressListener(event) {
	reactKeyPress(event)
}
function reactKeyDown(e) {}
function keyDownListener(event) {
	reactKeyDown(event)
	key[event.key] = true
}
function keyUpListener(event) {
	key[event.key] = false
}
function mouseMoveListener(event) {
	var rect = canvas.getBoundingClientRect()
	mouse.x = event.pageX - rect.left
	mouse.y = event.pageY - rect.top
}
function mouseDownListener(event) {
	switch (event.button) {
		case 0:
			mouse.left = true
			break;
		case 1:
			mouse.middle = true
			break;
		case 2:
			mouse.right = true
			break;
	}
}
function mouseUpListener(event) {
	switch (event.button) {
		case 0:
			mouse.left = false
			break;
		case 1:
			mouse.middle = false
			break;
		case 2:
			mouse.right = false
			break;
	}
}
function mouseWheelListener(event) {
	mouse.wheel += event.deltaY;
}