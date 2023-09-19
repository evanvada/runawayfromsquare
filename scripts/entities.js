
class Player {
	constructor(x, y) {
		// position
		this.x = x
		this.y = y

		// hit box
		this.w = 0.75
		this.h = 0.75

		// movement
		this.vx = 0
		this.vy = 0
		this.acc = 0.015 // acceleration
		this.dec = 0.5 // deceleration
		this.max_speed = 0.1
		this.jump_boost = -0.25

		// coyote jump
		this.can_jump = false
		this.last_jumped = 0
		this.last_grounded = 0

		// misc
		this.life = 500
		this.hurting = 0
	}

	update() {
		controlEntity(this, key["q"], key["d"], key["z"])

		let last_vy = this.vy
		updateForces(this)
		if (last_vy > 0 && this.vy == 0) {
			for (var i = 0; i < Math.floor(last_vy*100); i++) {
				particles.push(new Particle(this.x, this.y+0.5, "rgba(0, 255, 127, 1)"))
			}
		}

		this.hurting *= 0.95

		// update camera position
		camera.x += (this.x-camera.x)/10
		camera.y += (this.y-camera.y)/10
	}

	draw() {
		ctx.fillStyle = "rgba(0, 255, 127, 1)";
		let s_pos_1 = Trans_WS(camera, this.x-this.w/2, this.y-this.h/2);
		let s_pos_2 = Trans_WS(camera, this.x+this.w/2, this.y+this.h/2);
		ctx.fillRect(s_pos_1.x, s_pos_1.y, s_pos_2.x-s_pos_1.x, s_pos_2.y-s_pos_1.y);
	}

	hurt(damage) {
		this.life -= damage
		this.hurting = 1
		if (this.life < 0) {
			this.life = 0
		}
	}
}

class Coin {
	constructor(x, y) {
		this.x = x
		this.y = y

		this.life = 1
	}

	update() {
		if (vecLength(player.x-this.x, player.y-this.y) < 0.5) {
			score += 1
			this.life = 0
			for (var i = 0; i < 20; i++) {
				particles.push(new Particle(this.x, this.y, "rgba(255, 127, 0, 1)"))
			}
		}
	}

	draw() {
		let s_pos = Trans_WS(camera, this.x, this.y+Math.cos(upc*0.1+this.x*0.5+this.y*0.5)*0.1);
		ctx.fillStyle = "rgba(255, 127, 0, 1)";
		ctx.beginPath();
		ctx.arc(s_pos.x, s_pos.y, 0.25*camera.zoom, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}
}

class Monster {
	constructor(x, y) {
		// position
		this.x = x
		this.y = y

		// hit box
		this.w = 0.75
		this.h = 0.75

		// movement
		this.vx = 0
		this.vy = 0
		this.acc = 0.015 // acceleration
		this.dec = 0.5 // deceleration
		this.max_speed = 0.1
		this.jump_boost = -0.25

		// coyote jump
		this.can_jump = false
		this.last_jumped = 0
		this.last_grounded = 0

		// misc
		this.life = 100;

		// ai
		this.brain = {}
		this.brain.openNodes = [];
		this.brain.closedNodes = [];
		this.brain.path = [];
		this.brain.path_progression = 0;
	}

	despawn() {
		for (var i = 0; i < 100; i++) {
			particles.push(new Particle(this.x, this.y+0.5, "rgba(195, 31, 0, 1)"))
		}
		this.life = 0
	}

	update() {
		if (Math.random()<0.2 && this.can_jump) {
			this.newPath()
		}
		followPath(this)

		let last_vy = this.vy
		updateForces(this)
		if (last_vy > 0 && this.vy == 0) {
			for (var i = 0; i < Math.floor(last_vy*100); i++) {
				particles.push(new Particle(this.x, this.y+0.5, "rgba(195, 31, 0, 1)"))
			}
		}

		if (colDetect_BoxBox(this.x, this.y, this.w, this.h, player.x, player.y, player.w, player.h)) {
			player.hurt(1)
		}
	}

	newPath() {
		this.brain.start_x = Math.floor(this.x)
		this.brain.start_y = Math.floor(this.y)
		this.brain.end_x = Math.floor(player.x)
		this.brain.end_y = Math.floor(player.y)
		searchPath(this.brain)
	}

	draw() {
		ctx.fillStyle = "rgba(195, 31, 0, 1)";
		let s_pos_1 = Trans_WS(camera, this.x-this.w/2, this.y-this.h/2);
		let s_pos_2 = Trans_WS(camera, this.x+this.w/2, this.y+this.h/2);
		ctx.fillRect(s_pos_1.x, s_pos_1.y, s_pos_2.x-s_pos_1.x, s_pos_2.y-s_pos_1.y);
	}
}



class Particle {
	constructor(x, y, color, vel=0.1, lif_min=5, lif_plus=15) {
		this.x = x
		this.y = y

		this.vx = Math.random()*vel*2-vel
		this.vy = Math.random()*vel*2-vel

		this.color = color

		this.life = Math.random()*lif_plus+lif_min
	}

	update() {
		this.vy *= 0.95
		this.vx *= 0.95
		this.x += this.vx
		this.y += this.vy
		this.life -= 1
	}

	draw() {
		let s_pos = Trans_WS(camera, this.x, this.y+Math.cos(upc*0.1+this.x*0.5+this.y*0.5)*0.1);
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(s_pos.x, s_pos.y, 0.1*camera.zoom, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}
}




function controlEntity(e, left, right, jump) {
	// player
	if (left || right) {
		if (left) {
			e.vx -= e.acc
			if (e.vx < -e.max_speed) {
				e.vx = -e.max_speed
			}
		}
		if (right) {
			e.vx += e.acc
			if (e.vx > e.max_speed) {
				e.vx = e.max_speed
			}
		}
	} else {
		e.vx *= e.dec
	}

	if (jump && e.can_jump) {
		e.vy = e.jump_boost
		e.last_jumped = upc
		e.can_jump = false
	}
}



function updateForces(e) {
	e.vy += gravity
	e.vx *= friction
	e.vy *= friction

	let enti = {}
	enti.x = e.x-e.w/2
	enti.y = e.y-e.h/2
	enti.vx = e.vx
	enti.vy = e.vy
	enti.w = e.w
	enti.h = e.h
	
	colResp_EntityMap(enti, map)
	
	e.vx = enti.vx
	e.vy = enti.vy
	e.x = enti.x+e.w/2
	e.y = enti.y+e.h/2

	let grounded = colDetect_BoxMap(e.x-e.w/2, e.y-e.h/2+0.01, e.w, e.h, map)
	if (grounded) { e.last_grounded = upc }
	if (e.last_grounded > e.last_jumped && upc-e.last_grounded < 10) {
		e.can_jump = true
	} else {
		e.can_jump = false
	}
}


















