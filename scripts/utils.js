
// get value at corrdinates
function mapGet(x, y, no=0) {
	if (map[y] == null || map[y][x] == null) {
		return no
	}
	return map[y][x]
}

// transforms world point to screen point
function Trans_WS(cam, x, y) {
	return {
		x: (x-cam.x)*cam.zoom+canvas.width/2,
		y: (y-cam.y)*cam.zoom+canvas.height/2,
	};
}

// transforms screen point to world point
function Trans_SW(cam, x, y) {
	return {
		x: (x-canvas.width/2)/cam.zoom+cam.x,
		y: (y-canvas.height/2)/cam.zoom+cam.y,
	};
}






// get the length of a vector
function vecLength(x, y) {
	return Math.sqrt(x*x+y*y)
}

// get the unit vector
function unitVec(x, y) {
	var d = vecLength(x, y)
	return {
		x: x/d,
		y: y/d,
	};
}














