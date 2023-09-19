
// Collision Detections //

function colDetect_BoxMap(bx,by,bw,bh) {
	// the zone containing the tiles the box is colliding with
	let zone_x1 = Math.floor(bx)
	let zone_x2 = Math.floor(bx+bw-0.00001)
	let zone_y1 = Math.floor(by)
	let zone_y2 = Math.floor(by+bh-0.00001)

	// see if at least one tile is a wall
	for (var tile_x = zone_x1; tile_x <= zone_x2; tile_x++) {
		for (var tile_y = zone_y1; tile_y <= zone_y2; tile_y++) {
			var t = mapGet(tile_x, tile_y)
			if (t != 0) {
				return true
			}
		}
	}
	return false
}

function colDetect_PointMap(px,py) {
	let t = mapGet(tile_x, tile_y)
	return (t != null && t.wall != 0)
}

function colDetect_PointBox(px,py, bx,by,bw,by) {
	return (px >= bx+bw || px <= bx || py >= by+bh || py <= by)
}

function colDetect_BoxBox(x1,y1,w1,h1, x2,y2,w2,h2) {
	return !(x2 >= x1+w1 || x2+w2 <= x1 || y2 >= y1+h1 || y2+h2 <= y1)
}










// Collision Responses //

// handles collisions of entity with wall, it will update its velocity
function colResp_EntityMap(e) {
	// max velocity to add to position, remaining velocity to add to position, velocity to add
	let max_vel = null
	let rem_vel = null
	let add_vel = null

	// updating position x
	max_vel = e.w/2
	rem_vel = e.vx
	while (true) {
		// add velocity to the position
		add_vel = Math.min(Math.abs(rem_vel), max_vel)*Math.sign(e.vx)
		e.x += add_vel
		rem_vel -= add_vel
		// if collision
		if (colDetect_BoxMap(e.x, e.y, e.w, e.h)) {
			// push
			if (e.vx < 0) {
				// console.log("<0")
				e.x = Math.ceil(e.x)
			}
			if (e.vx > 0) {
				// console.log(">0", e.x, Math.floor(e.x), Math.floor(e.x+e.w), Math.floor(e.x+e.w)-e.w)
				e.x = Math.floor(e.x+e.w)-e.w
			}
			e.vx = 0
			// e.vy *= wall_friction // friction on the walls
			break
		}
		if (rem_vel == 0) { break }
	}

	// updating position y
	max_vel = e.h/2
	rem_vel = e.vy
	while (true) {
		// add velocity to the position
		add_vel = Math.min(Math.abs(rem_vel), max_vel)*Math.sign(e.vy)
		e.y += add_vel
		rem_vel -= add_vel
		// if collision
		if (colDetect_BoxMap(e.x, e.y, e.w, e.h)) {
			// push
			if (e.vy < 0) {
				e.y = Math.ceil(e.y)
			}
			if (e.vy > 0) {
				e.y = Math.floor(e.y+e.h)-e.h
			}
			e.vy = 0
			// e.vx *= wall_friction // friction on the walls
			break
		}
		if (rem_vel == 0) { break }
	}
}



